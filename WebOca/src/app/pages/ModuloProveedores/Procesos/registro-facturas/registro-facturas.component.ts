import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { RegisterService } from '../../../../services/register/register.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertasService } from '../../../../services/alertas/alertas.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { LoginService } from '../../../../services/login/login.service';
import { FuncionesglobalesService } from '../../../../services/funciones/funcionesglobales.service';
import { RespuestaServer } from '../../../../models/respuestaServer.models';
import Swal from 'sweetalert2';
import { RegistroFacturasService } from '../../../../services/Proveedor/Procesos/registro-facturas.service';
import { InputFileI } from '../../../../models/inputFile.models';
import { UploadService } from '../../../../services/upload/upload.service';

declare const $:any;
@Component({
  selector: 'app-registro-facturas',
  templateUrl: './registro-facturas.component.html',
  styleUrls: ['./registro-facturas.component.css']
})
 
export class RegistroFacturasComponent implements OnInit {

  formParams : FormGroup;
  formParamsFiltro : FormGroup;
  formParamsFile : FormGroup;

  idUserGlobal = '';
  idProveedor_Global = 0;
  idOrdenCompraCab_Global = 0;
  idDocumentoCab_Global = 0;

  filtrarCab = '';
  estados :any [] = []; 
  tiposDocumentosFiles :any [] =[];

  registroOrdenCompras :any [] = []; 
  objOrdenCompra_Global:any ={};

  documentosCab :any [] = []; 
  documentosDet :any [] = []; 

  nroDocSeleccionado = '';
  detalleDocumentosDet :any [] = []; 
  detalleDocumentosOC :any [] = []; 

  filesDoc:InputFileI[] = [];
  archivosImportados :any [] = []; 
   
  subTotalFactura  = 0;
  subTotalOC  = 0;
  TotalFacturaOC ='0';

  flag_modoEdicion = false;
  flagExpandirComprimir = false;


  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private uploadService : UploadService ) { 
      this.idUserGlobal = this.loginService.get_idUsuario();
      this.idProveedor_Global =  this.loginService.get_idProveedor(); 
    }

  ngOnInit(): void {
    this.getCargarCombos();
    this.inicializarFormularioFiltro(); 
    this.inicializarFormularioDoc(); 
    this.inicializarFormularioDocAdicionales();
  }

  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({ 
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('0')
     }) 
  }

  inicializarFormularioDoc(){ 
    this.formParams = new FormGroup({ 
      serieFactura : new FormControl(''),
      nroFactura : new FormControl(''),
      fechaDoc: new FormControl(new Date()),
      file : new FormControl()
     }) 
  }


  inicializarFormularioDocAdicionales(){ 
    this.formParamsFile = new FormGroup({ 
      tipoDoc  : new FormControl('0'),
      serieDoc : new FormControl(''),
      nroDoc : new FormControl(''),
      fechaDoc: new FormControl(new Date()),
      file : new FormControl()
     }) 
  }
  
  getCargarCombos(){ 
    this.spinner.show(); 
    combineLatest([ this.registroFacturasService.get_estado() , this.registroFacturasService.get_tipoDocumentoFile() ])
     .subscribe(([ _estados, _tiposDocumentosFiles]) =>{
        this.spinner.hide(); 
          this.estados = _estados; 
          this.tiposDocumentosFiles =_tiposDocumentosFiles;
      })
  }

  mostrarInformacion_ordenCompra(){

    if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
      return 
    } 
    if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
      return 
    } 
  
    const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
    const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);

    this.spinner.show();
    this.registroFacturasService.get_ordenesCompraCab( fechaIni, fechaFin, this.formParamsFiltro.value.idEstado, this.idProveedor_Global ).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok) { 
        this.registroOrdenCompras = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }


  mostrarInformacion_documentosCab(idOrdenCompraCab : number){

    this.idOrdenCompraCab_Global = idOrdenCompraCab;

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo los Documentos, Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.get_documentosCab( idOrdenCompraCab ).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
        this.documentosCab = res.data;
        this.totalFacturasOC();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  cerrarModal_documentos(){
    setTimeout(()=>{ // 
      $('#modal_documentos').modal('hide');  
    },0); 
  }

  abrirModal_documentos(objParteDiario :any){ 

    //----- parte diario CABECERA -----
    this.objOrdenCompra_Global = objParteDiario;
    this.idOrdenCompraCab_Global = objParteDiario.idOrdenCompraCab;

    this.documentosDet = [];
    this.nroDocSeleccionado = '';

    setTimeout(()=>{ // 
      $('#modal_documentos').modal('show');
    },0);

  }


  mostrarInformacion_documentosDet(idDocumentoCab : number, serieDoc:string, nroDoc:string){

    this.nroDocSeleccionado = serieDoc + '-' + nroDoc;

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo el detalle del Documento, Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.get_documentosDet( idDocumentoCab ).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
        this.documentosDet = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }


  //  ----------- AÑADIR DOCUMENTOS  -----------------

  cerrarModal_files(){
    setTimeout(()=>{ // 
      $('#modal_files').modal('hide');  
    },0); 

    for (const orden of this.registroOrdenCompras) {
        if (orden.idOrdenCompraCab == this.idOrdenCompraCab_Global ){
          this.objOrdenCompra_Global = orden;
          break;
        }
    }

  }

  abrirModal_files(){  

    if ( Number(this.objOrdenCompra_Global.total) ==  Number( this.objOrdenCompra_Global.TotalFactura)) {
      this.alertasService.Swal_alert('error','Se completo el ingreso de Documentos, solo puede editar');
      return 
    }

    console.log(Number(this.objOrdenCompra_Global.TotalFactura) +' >  '+  Number( this.objOrdenCompra_Global.total))
    
    if ( Number(this.objOrdenCompra_Global.TotalFactura) > Number( this.objOrdenCompra_Global.total)) {
      this.alertasService.Swal_alert('error','Se completo el ingreso de Documentos, solo puede editar');
      return 
    }

    this.idDocumentoCab_Global = 0;
    this.flag_modoEdicion = false;
    this.flagExpandirComprimir = false;

    this.archivosImportados = [];
    this.detalleDocumentosDet = [];

    this.subTotalFactura = 0;
    this.subTotalOC = 0;
    


    this.inicializarFormularioDoc();
    this.inicializarFormularioDocAdicionales();

    setTimeout(()=>{ // 
      $('#modal_files').modal('show'); 
      $('#btnRegistrar').removeClass('disabledForm'); 
    },0); 
  }


  editar_documentosCab(obj){  
 

    this.idDocumentoCab_Global = obj.id_Documento ;
    this.flag_modoEdicion = true;

    this.subTotalFactura = 0;
    this.subTotalOC = 0;
    this.flagExpandirComprimir = false;
    
    this.archivosImportados = [];
    this.detalleDocumentosDet = [];

    this.inicializarFormularioDoc();
    this.inicializarFormularioDocAdicionales();

    setTimeout(()=>{ // 
      $('#modal_files').modal('show'); 
      $('#btnRegistrar').removeClass('disabledForm'); 

      this.formParams.patchValue({ "serieFactura" : obj.serieFactura, "nroFactura": obj.nroFactura , "fechaDoc" : (!obj.fechaFactura) ? null : new Date(obj.fechaFactura)  });

      this.mostrarArchivosAdiconales();
      this.mostrarDetalleDocumentos();
    },0); 

  }

  async registrarFactura(){

    if ( this.idOrdenCompraCab_Global == 0 || this.idOrdenCompraCab_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargó el Id de la orden de compra, actualice su página.');
      return 
    }
    
    if (this.formParams.value.serieFactura == '' || this.formParams.value.serieFactura == 0 || this.formParams.value.serieFactura == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese la serie de la factura.');
      return 
    }

    if (this.formParams.value.nroFactura == '' || this.formParams.value.nroFactura == 0 || this.formParams.value.nroFactura == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese el numero de factura.');
      return 
    }
    if (this.formParams.value.fechaDoc == '' || this.formParams.value.fechaDoc == 0 || this.formParams.value.fechaDoc == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese o seleccione la fecha del Documento.');
      return 
    }


    if (this.flag_modoEdicion == false) { /// nuevo
      if (!this.formParams.value.file) {
        this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo del Documento .');
        return;
      } 
    }  

    const fechaD = this.funcionGlobalServices.formatoFecha(this.formParams.value.fechaDoc);


    if (this.flag_modoEdicion == false) { /// nuevo

      const  flagNroDoc :any = await this.registroFacturasService.get_verificar_nroDocumento(  this.idOrdenCompraCab_Global, this.idProveedor_Global  ,  this.formParams.value.serieFactura , this.formParams.value.nroFactura, this.idUserGlobal);
      if (flagNroDoc.ok = true) {
        if (flagNroDoc.data.length > 0) {

          const {validacion, mensaje} = flagNroDoc.data[0];  
          if (validacion == 0 || validacion == '0' ) {
            this.alertasService.Swal_alert('error',  mensaje);
            return 
          }   
        }
      }

    } 

    this.spinner.show(); 
    this.registroFacturasService.set_saveDocumentosCab( this.idOrdenCompraCab_Global , this.formParams.value.nroFactura, fechaD  , this.idUserGlobal, this.idDocumentoCab_Global, this.formParams.value.serieFactura).subscribe((res:RespuestaServer)=>{  
    this.spinner.hide(); 

      if (res.ok) {            

          this.idDocumentoCab_Global  = Number(res.data) ;     
        //---- almacenando el archivo inicial de la factura ----

        if (this.formParams.value.file) {

          Swal.fire({
            icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
          })
          Swal.showLoading();
          this.uploadService.upload_documentoCab( this.filesDoc[0].file , this.idDocumentoCab_Global, this.idUserGlobal ).subscribe(
           (res:RespuestaServer) =>{
            Swal.close();
             if (res.ok==true) { 
                 this.filesDoc = [];
  
                 if (this.flag_modoEdicion == false) {
                  this.alertasService.Swal_Success('Se grabó correctamente el documento..');
                 }else{
                  this.alertasService.Swal_Success('Se edito correctamente el documento..');
                 }

                 this.mostrarInformacion_documentosCab(this.idOrdenCompraCab_Global);
                 this.mostrarArchivosAdiconales(); 
                 setTimeout(() => {
                    $('#btnRegistrar').addClass('disabledForm');
                 }, 100);
             }else{
                 this.filesDoc[0].message = String(res.data);
                 this.filesDoc[0].status = 'error';   
             }
             },(err) => {
              Swal.close();
               this.filesDoc[0].message = JSON.stringify(err);
               this.filesDoc[0].status = 'error';   
             }
         );
         
       } else{
          if (this.flag_modoEdicion == false) {
            this.alertasService.Swal_Success('Se grabó correctamente el documento..');
            this.flag_modoEdicion = true;
           }else{
            this.alertasService.Swal_Success('Se actualizo correctamente el documento..');
           }
       }
       //---- Fin de  almacenando el archivo inicial de la factura ----

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }    
    })

  }

  enviarAprobar(){

    if (this.detalleDocumentosDet.length ==0) {
      this.alertasService.Swal_alert('error','Agregue por favor el detalle del  documento..');
      return false;
    }

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de enviar a Aprobar ?')
    .then((result)=>{
      if(result.value){

        this.registroFacturasService.set_enviarAprobarDocumento(  this.idDocumentoCab_Global,  this.idUserGlobal ).subscribe(
          (res:RespuestaServer) =>{
           Swal.close();
            if (res.ok==true) { 
    
              this.alertasService.Swal_Success('Enviar a Aprobar realizado correctamente..');
              this.cerrarModal_files();

              this.mostrarInformacion_documentosCab(this.idOrdenCompraCab_Global);
     
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
            },(err) => {
             Swal.close();
             this.alertasService.Swal_alert('error', JSON.stringify(err));
             alert(JSON.stringify(err)); 
            }
        ); 
         
      }

    }) 
  }

  onFileChange(event:any) {   
    var filesTemporal = event.target.files; //FileList object       
      var fileE:InputFileI [] = []; 
      for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
        fileE.push({
            'file': filesTemporal[i],
            'namefile': filesTemporal[i].name,
            'status': '',
            'message': ''
        })  
      }
       this.filesDoc = fileE;
  }
 
  blank(){
    this.inicializarFormularioDocAdicionales();
   }

   obtnerArchivoYacargado(nombreArchivo:string){  
    var flagRepetida=false;
    for (const obj of this.archivosImportados) {
      if (  obj.nombreArchivo == nombreArchivo ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  guardar_archivosAdicionales(){ 

    if (!this.formParamsFile.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo a cargar.');
      return;
    }    

    if (this.obtnerArchivoYacargado( this.filesDoc[0].file.name ) ==true) {
      this.alertasService.Swal_alert('error', 'El archivo que intenta subir, Ya se encuentra cargado');
      return;
    }

    if (this.formParamsFile.value.tipoDoc == '0' || this.formParamsFile.value.tipoDoc == 0 || this.formParamsFile.value.tipoDoc == null)  {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el Tipo de Documento.');
      return 
    }
    
    if (this.formParamsFile.value.serieDoc == '' || this.formParamsFile.value.serieDoc == 0 || this.formParamsFile.value.serieDoc == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese la serie del Documento.');
      return 
    }

    if (this.formParamsFile.value.nroDoc == '' || this.formParamsFile.value.nroDoc == 0 || this.formParamsFile.value.nroDoc == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese el Numero de Documento.');
      return 
    }
    if (this.formParamsFile.value.fechaDoc == '' || this.formParamsFile.value.fechaDoc == 0 || this.formParamsFile.value.fechaDoc == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese o seleccione la Fecha del Documento.');
      return 
    }
        
    const fechaD = this.funcionGlobalServices.formatoFecha(this.formParamsFile.value.fechaDoc);

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false,  text: 'Espere por favor'
    })
    Swal.showLoading();

   this.uploadService.upload_documentosAdicionalesCab( this.filesDoc[0].file , this.idDocumentoCab_Global, this.formParamsFile.value.tipoDoc , this.formParamsFile.value.nroDoc, fechaD , this.idUserGlobal, this.formParamsFile.value.serieDoc ).subscribe(
     (res:RespuestaServer) =>{
      Swal.close();
       if (res.ok==true) { 
            this.filesDoc = [];
            this.alertasService.Swal_Success('Proceso de carga realizado correctamente..');
            this.blank();
            this.mostrarArchivosAdiconales(); 
       }else{
           this.filesDoc[0].message = String(res.data);
           this.filesDoc[0].status = 'error';   
       }
       },(err) => {
        Swal.close();
         this.filesDoc[0].message = JSON.stringify(err);
         this.filesDoc[0].status = 'error';   
       }
   );
  } 
  
  mostrarArchivosAdiconales(){   
    if ( this.idDocumentoCab_Global == 0 || this.idDocumentoCab_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la id del documentos, actualice su pagina por favor..');
      return false;
    }

    this.spinner.show();
      this.registroFacturasService.get_archivosAdicionales(this.idDocumentoCab_Global ).subscribe((res:RespuestaServer)=>{
        this.spinner.hide();
      if (res.ok) { 
         this.archivosImportados = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  eliminarArchivoSeleccionado(item:any){    

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.get_eliminarArchivosAdicionales(item.id_Documento_Archivo).subscribe((res:RespuestaServer)=>{
      Swal.close();
      console.log(res);
      if (res.ok) { 
               this.alertasService.Swal_Success("Proceso realizado correctamente..")
               var index = this.archivosImportados.indexOf( item );
               this.archivosImportados.splice( index, 1 );
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
 
  downloadFileExport(idDocumento_Archivo:number){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.get_descargarFileAdicionales(idDocumento_Archivo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
      console.log(res);
      if (res.ok) { 
        window.open(String(res.data),'_blank');
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
  
  mostrarDetalleDocumentos( ){
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo el detalle del Documento, Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.get_documentosDet( this.idDocumentoCab_Global ).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
        this.detalleDocumentosDet = res.data;
        this.totalDocumentoDet(); 
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }



  ///---- DETALLE DE FACTURAS -----


  cerrarModal_detalle(){
    setTimeout(()=>{ // 
      $('#modal_detalleFactura').modal('hide');  
    },0); 
  }

  abrirModal_agregarDetalle(){

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo documentos, Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.get_detalleDocumentosOC( this.idOrdenCompraCab_Global ).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 

        this.detalleDocumentosOC = res.data;
      
        setTimeout(()=>{ // 
          $('#modal_detalleFactura').modal('show');  
          this.totalDocumentoOC();
        },0); 

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
  
  validacionCheckMarcado(){    
    let CheckMarcado = false;
    CheckMarcado = this.funcionGlobalServices.verificarCheck_marcado(this.detalleDocumentosOC);
  
    if (CheckMarcado ==false) {
      this.alertasService.Swal_alert('error','Por favor debe marcar un Producto de la Tabla');
      return false;
    }else{
      return true;
    }
  }
    
  guardarProductosItems(){   
  
    if (this.detalleDocumentosOC.length == 0) {
      this.alertasService.Swal_alert('error','No hay detalles de producto para agregar');
      return;
    }
  
    if (this.validacionCheckMarcado()==false){
      return;
    }
  
    const prodMarc = this.detalleDocumentosOC.filter((prod)=> prod.checkeado).map((p)=>{
        return { codigo : p.codigo,cantidadIngresoAlmacen : p.cantidadIngresoAlmacen, cantidadFacturada : p.cantidadFacturada, cantidadIngresoAprobada : p.cantidadIngresoAprobada, precio : p.precio }
    }); 
   
    if (!prodMarc) {
      return;
    }else{    
      let flagCantNull =false;
      for (const prod of prodMarc) {
          if (!prod.cantidadIngresoAprobada) {
            this.alertasService.Swal_alert('error','Es necesario ingresar una cantidad');
            flagCantNull =true;
            break;
          }
          if ( Number(prod.cantidadIngresoAprobada) <=0 ) {
            this.alertasService.Swal_alert('error','Tiene que ingresar un valor positivo');
            flagCantNull =true;
            break;
          }
          if (  (Number(prod.cantidadFacturada) + Number(prod.cantidadIngresoAprobada)) > Number(prod.cantidadIngresoAlmacen) ) {
            this.alertasService.Swal_alert('warning','La cant Facturada + Cant. Aprobada no tiene que superar a la cantidad de Ingreso por Almacén');
            flagCantNull =true;
            break;
          }
      }
  
      if (flagCantNull) {
          return;
      }
    }

    let listDocumentosDet = [];

    for (const prog of prodMarc) {
      listDocumentosDet.push({ 
        idDocumentoCab : this.idDocumentoCab_Global , 
        codigoProducto : prog.codigo , 
        cantAprobada : prog.cantidadIngresoAprobada , 
        precio : prog.precio ,  
        usuarioCreacion : this.idUserGlobal
      })
    } 
    
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Guardando el detalle, Espere por favor'  })
    Swal.showLoading();             
    this.registroFacturasService.set_save_detalleDocumentos( listDocumentosDet, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      Swal.close();    
      if (res.ok ==true) { 
        this.alertasService.Swal_alert('success','Se agregaron los productos');
        this.cerrarModal_detalle(); 
        this.mostrarDetalleDocumentos();
        this.mostrarInformacion_documentosCab(this.idOrdenCompraCab_Global);
        this.mostrarInformacion_ordenCompra();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })    
  
  }
  
  actualizarDetalleDocumento(cantidadIngresoAprobada:number, { id_Documento_Det, codigo ,cantidadIngresoAlmacen,cantidadFacturada, precio } ){

    if (!cantidadIngresoAprobada) {
      this.alertasService.Swal_alert('error','Es necesario ingresar una cantidad');
      return;
    }
    if ( Number(cantidadIngresoAprobada) <=0 ) {
      this.alertasService.Swal_alert('error','Tiene que ingresar un valor positivo');
      return;
    }
    if (  (Number(cantidadFacturada) + Number(cantidadIngresoAprobada)) > Number(cantidadIngresoAlmacen) ) {
      this.alertasService.Swal_alert('warning','La cant Facturada + Cant. Aprobada no tiene que superar a la cantidad de Ingreso por Almacén');
      return;
    }

      Swal.fire({
        icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo el detalle del Documento, Espere por favor'
      })
      Swal.showLoading();
      this.registroFacturasService.set_editarDocumentoDet( id_Documento_Det , codigo,  cantidadIngresoAprobada,  Number(precio), this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
        Swal.close();
        if (res.ok) { 
          this.alertasService.Swal_alert('success','Se actualizó la cantidad correctamente..');

          for (const doc of this.detalleDocumentosDet) {
               if (doc.id_Documento_Det == id_Documento_Det   ) {
                doc.subTotal = Number(doc.cantidadIngresoAprobada) *  Number(doc.precio);
                break;
               }
          }

          this.totalDocumentoDet();
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })

  }

  totalDocumentoDet(){
    let subTotales = 0;
    for (const docum of this.detalleDocumentosDet) { 
      subTotales += Number(docum.subTotal); 
    }
    this.subTotalFactura = subTotales;
  }

  totalDocumentoOC(){
    let subTotales = 0;
    for (const docum of this.detalleDocumentosOC) { 
      subTotales += Number(docum.subTotal); 
    }
    this.subTotalOC = subTotales;
  }

  totalFacturasOC(){
    let totales : number = 0;
    for (const docum of this.documentosCab) { 
      totales += Number(docum.total); 
    }

    this.TotalFacturaOC = totales.toFixed(3); 
  }

  actualizarDetalleDocumentoOC(cantidadIngresoAprobada:number, { id, codigo ,cantidadIngresoAlmacen,cantidadFacturada, precio }){

    if (!cantidadIngresoAprobada) {
      this.alertasService.Swal_alert('error','Es necesario ingresar una cantidad');
      return;
    }
    if ( Number(cantidadIngresoAprobada) <=0 ) {
      this.alertasService.Swal_alert('error','Tiene que ingresar un valor positivo');
      return;
    }
    if (  (Number(cantidadFacturada) + Number(cantidadIngresoAprobada)) > Number(cantidadIngresoAlmacen) ) {
      this.alertasService.Swal_alert('warning','La cant Facturada + Cant. Aprobada no tiene que superar a la cantidad de Ingreso por Almacén');
      return;
    }

    for (const doc of this.detalleDocumentosOC) {
      if (doc.id == id   ) {
       doc.subTotal = Number(doc.cantidadIngresoAprobada) *  Number(doc.precio);
       break;
      }
    }

    this.totalDocumentoOC();
  }

 
 


  


}