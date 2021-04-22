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
import { UploadService } from '../../../../services/upload/upload.service';
import { ProveedorService } from '../../../../services/Proveedor/Procesos/proveedor.service';
import { CajaChicaService } from '../../../../services/Proveedor/Procesos/caja-chica.service';
import { InputFileI } from '../../../../models/inputFile.models';
declare const $:any;

const MAXIMO_TAMANIO_BYTES = 2000000;

@Component({
  selector: 'app-caja-chica',
  templateUrl: './caja-chica.component.html',
  styleUrls: ['./caja-chica.component.css']
})
 
export class CajaChicaComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsManual: FormGroup;
  formParamsFile: FormGroup;
  formParamsDoc : FormGroup;
  formParamsDocDet : FormGroup;

  idUserGlobal : string = '' ;
  flag_modoEdicion :boolean =false;
  flagModo_EdicionDet  :boolean =false;

  liquidacionCajaCab :any[]=[]; 
  centroCostro  :any[]=[]; 
  estados :any[]=[]; 
  tiposDocumentosCajaChica :any[]=[]; 
  
  objLiquidacionesCab:any = {};
  liquidacionesDet :any[]=[]; 


  filtrarCab = "";
  idLiquidacionCaja_Cab_Global = 0;
  idLiquidacionCaja_Det_Global = 0;
  flagComprobante = 1;
  idEstado_Global = 0;
f
  filesExcel:InputFileI[] = [];

  documentosCajaChica :any[]=[];
  documentosCajaChica_Det :any[]=[];

  filesDoc:InputFileI[] = []; 
  filesDoc_Det:InputFileI[] = []; 
  
  flagExpandirComprimir = false;
  flagVer = "Ocultar";

  totalesNoAfecto = '';
  totalesIgv = '';
  totalesPercepciones = '';
  totalesOtros = '';
  totalesGeneral = '';
  numeroDoc_Global = '';

 
  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private proveedorService:ProveedorService , private cajaChicaService : CajaChicaService, private uploadService : UploadService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormularioManual();
   this.inicializarFile();
   this.inicializarFormularioDocAdicionales();
   this.inicializarFormularioDocAdicionales_Det();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idCentroCostro : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('0'),
     }) 
 }

 
 inicializarFormularioDocAdicionales(){ 
  this.formParamsDoc = new FormGroup({ 
    file : new FormControl()
   }) 
}
inicializarFormularioDocAdicionales_Det(){ 
  this.formParamsDocDet = new FormGroup({ 
    file : new FormControl()
   }) 
}


 inicializarFormulario(){ 
    this.formParams= new FormGroup({      
      id_LiquidacionCaja_Cab: new FormControl('0'), 
      Ges_Ordt_Codigo: new FormControl('0'), 
      fechaInicial: new FormControl( new Date()), 
      fechaFinal: new FormControl( new Date()),  
    }) 
 }

 inicializarFormularioManual(){ 
  this.formParamsManual= new FormGroup({      
    id_LiquidacionCaja_Det : new FormControl('0'), 
    id_LiquidacionCaja_Cab : new FormControl('0'), 
    Pub_TiDo_Codigo : new FormControl('0'), 
    nroSerie_Doc : new FormControl(''), 
    numero_Doc : new FormControl(''), 
    fechaEmision_Doc : new FormControl( new Date()), 
    id_Proveedor : new FormControl('0'), 
    nro_RUC : new FormControl(''), 
    razonsocial : new FormControl(''), 
    concepto_Doc : new FormControl(''),  
    subTotal_Doc : new FormControl(''), 
    IgvTotal_Doc : new FormControl(''), 
    percepciones_Doc : new FormControl(''), 
    otrosG_Doc : new FormControl(''), 
    total_Doc : new FormControl(''), 
    Estado : new FormControl('1'), 
    usuario_creacion : new FormControl('0'), 
  }) 
  }
  
  inicializarFile(){ 
    this.formParamsFile = new FormGroup({
      file : new FormControl('')
     })
  }

  getGenerarCalculos( ){ 
    if (this.formParamsManual.value.Pub_TiDo_Codigo == 1 || this.formParamsManual.value.Pub_TiDo_Codigo == '1' ) {

      let subTotal  = (!this.formParamsManual.value.subTotal_Doc) ? 0 : Number( this.formParamsManual.value.subTotal_Doc ) ;
      let igv  = (subTotal * 0.18);

      console.log(igv)

      let percep  = (!this.formParamsManual.value.percepciones_Doc) ? 0 : Number( this.formParamsManual.value.percepciones_Doc ) ;
      let otrosCargo  = (!this.formParamsManual.value.otrosG_Doc) ? 0 : Number( this.formParamsManual.value.otrosG_Doc ) ;

      let totalGeneral = (subTotal + igv + percep + otrosCargo); 

      this.formParamsManual.patchValue({ "IgvTotal_Doc" : Number(igv) , "total_Doc" : Number(totalGeneral)  });
      
    }
  }


 getCargarCombos(){ 
  this.spinner.show(); 
  combineLatest([this.registerService.get_centroCosto(this.idUserGlobal), this.registroFacturasService.get_estado_cajaChica(), this.registroFacturasService.get_tipoDocumento_cajaChica() ])
   .subscribe(([ _centroCostro, _estados, _tiposDocumentosFiles ]) =>{
      this.spinner.hide(); 
        this.centroCostro =_centroCostro;
        this.estados = _estados; 
        this.tiposDocumentosCajaChica =_tiposDocumentosFiles;
    })
}

 mostrarInformacion(){ 

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
    this.cajaChicaService.get_mostrarCajaChicaCab(this.formParamsFiltro.value.idCentroCostro, fechaIni,fechaFin, this.formParamsFiltro.value.idEstado, this.idUserGlobal   )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.liquidacionCajaCab = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }   

 cerrarModal_registro(){
  setTimeout(()=>{ // 
    $('#modal_registro').modal('hide');  
  },0); 
 }

 nuevo(){
  this.idLiquidacionCaja_Cab_Global = 0;
  this.idLiquidacionCaja_Det_Global = 0;
  this.idEstado_Global = 240;
  this.flag_modoEdicion = false;
  this.liquidacionesDet = [];
  this.documentosCajaChica = [];
  this.flagComprobante = 1;
  this.inicializarFormulario();
  this.blank_Detalle();
  this.blankDoc();
  setTimeout(()=>{ // 
    $('#modal_registro').modal('show');  
  },0);
 }

  editar({id_LiquidacionCaja_Cab, idEstado}){

    this.idLiquidacionCaja_Cab_Global = id_LiquidacionCaja_Cab;
    this.idLiquidacionCaja_Det_Global = 0;
    this.idEstado_Global = idEstado;

    this.flag_modoEdicion = true;
    this.liquidacionesDet = [];
    this.documentosCajaChica = [];
    this.blank_Detalle();
    this.blankDoc();
    this.obtenerDatosLiquidacionCabDet(id_LiquidacionCaja_Cab);
    this.mostrarDocumentosCajaChica();
  }  

  obtenerDatosLiquidacionCabDet(idLiquidacionCaja_Cab : number ){
  
    this.spinner.show();
      this.cajaChicaService.get_datosLiquidacionesCabDet( idLiquidacionCaja_Cab, this.idUserGlobal  ).subscribe((res :RespuestaServer)=>{ 
        this.spinner.hide(); 
  
         if (res.ok) { 
  
          if (res.data['liquidacionesCab'].length > 0){
            this.objLiquidacionesCab = res.data['liquidacionesCab'][0]; 
            const {id_LiquidacionCaja_Cab , Ges_Ordt_Codigo, fechaInicial , fechaFinal } =this.objLiquidacionesCab;
            this.formParams.patchValue({ "id_LiquidacionCaja_Cab" : id_LiquidacionCaja_Cab , "Ges_Ordt_Codigo" : Ges_Ordt_Codigo ,"fechaInicial" : new Date(fechaInicial) ,"fechaFinal" : new Date(fechaFinal) , });
          } 
  
          this.liquidacionesDet = res.data['liquidacionesDet'];

          setTimeout(()=>{ // 
            $('#modal_registro').modal('show');  
          },0);    

          this.calculosTotales_detalle();

        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }  
      },((error)=>{
        this.spinner.hide(); 
        this.alertasService.Swal_alert('error', JSON.stringify(error));
        alert(JSON.stringify(error));
      }))
  
  }  
  
  registrarLiquidacion(){
  
    if (this.flag_modoEdicion == true) {
        if ( this.idLiquidacionCaja_Cab_Global == 0 || this.idLiquidacionCaja_Cab_Global == null)  {
          this.alertasService.Swal_alert('error', 'No se cargó el Id de la liquidacion, actualice su página.');
          return 
        }
    }
    
    if (this.formParams.value.Ges_Ordt_Codigo == '' || this.formParams.value.Ges_Ordt_Codigo == 0 || this.formParams.value.Ges_Ordt_Codigo == null)  {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el centro de costo.');
      return 
    }
   
    if (this.formParams.value.fechaInicial == '' || this.formParams.value.fechaInicial == 0 || this.formParams.value.fechaInicial == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese o seleccione la fecha inicial.');
      return 
    }
  
    if (this.formParams.value.fechaFinal == '' || this.formParams.value.fechaFinal == 0 || this.formParams.value.fechaFinal == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese o seleccione la fecha final.');
      return 
    }
   
    const fechaI = this.funcionGlobalServices.formatoFecha(this.formParams.value.fechaInicial);
    const fechaF = this.funcionGlobalServices.formatoFecha(this.formParams.value.fechaFinal);
  
    this.spinner.show(); 
    this.cajaChicaService.set_saveLiquidacionCab( this.idLiquidacionCaja_Cab_Global , this.formParams.value.Ges_Ordt_Codigo, fechaI,fechaF, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{  
    this.spinner.hide(); 
  
      if (res.ok) {   
  
          this.idLiquidacionCaja_Cab_Global  = Number(res.data) ;   
          this.formParams.patchValue({ "id_LiquidacionCaja_Cab" : Number(res.data)});
  
          if (this.flag_modoEdicion == false) {
            this.alertasService.Swal_Success('Se grabó correctamente la Liquidacion..');         
           }else{
            this.alertasService.Swal_Success('Se actualizo correctamente la Liquidacion..');
           }

           this.mostrarInformacion();
   
       //---- Fin de  almacenando el archivo inicial de la factura ----
  
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }    
    })
  
  }

  changeComprobante(comprobante:any){   
    this.flagComprobante = Number(comprobante);
    this.flagVer = 'Ocultar';
  }

  buscarRuc(nroRuc:any){

    if (!nroRuc){
        return;
    }      

    this.spinner.show();
    this.registerService.get_consultarRucProveedor( String(nroRuc).trim()  , this.idUserGlobal ).subscribe((res :RespuestaServer)=>{ 
    this.spinner.hide(); 

       if (res.ok) {
        if (res.data.length > 0) {
          this.formParamsManual.patchValue({ "id_Proveedor" : res.data[0]['id_Proveedor'], "nro_RUC": res.data[0]['nro_RUC'] , "razonsocial" :  res.data[0]['razonsocial'] });     
        }else{
          this.alertasService.Swal_alert('warning', 'Lo sentimos no hay resultados con  el Ruc ingresado, verifique.');
          this.formParamsManual.patchValue({ "id_Proveedor" : '0', "razonsocial" :  'No se encontro Proveedor' });     
        }
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }  
    },((error)=>{
      this.spinner.hide(); 
      this.alertasService.Swal_alert('error', JSON.stringify(error));
      alert(JSON.stringify(error));
    }))

  }

  
  keyPress(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros(event); 
  }

  blank_Detalle(){
    this.flagModo_EdicionDet= false;
    this.idLiquidacionCaja_Det_Global = 0;
    this.inicializarFormularioManual();
    this.blank_Det()
    this.documentosCajaChica_Det = [];
  }

  guardarDet_liquidacion(){

    if ( this.idLiquidacionCaja_Cab_Global == 0 || this.idLiquidacionCaja_Cab_Global == null)  {
      this.alertasService.Swal_alert('error', 'Debe de grabar primero la cabecera de la liquidacion');
      return 
    }

    if (this.formParamsManual.value.Pub_TiDo_Codigo == '0' || this.formParamsManual.value.Pub_TiDo_Codigo == 0 || this.formParamsManual.value.Pub_TiDo_Codigo == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione el Tipo de Documento.');
      return 
    }

    if (this.formParamsManual.value.nroSerie_Doc == '' || this.formParamsManual.value.nroSerie_Doc == 0 || this.formParamsManual.value.nroSerie_Doc == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese por favor el nro de serie.');
      return 
    }
    if (this.formParamsManual.value.numero_Doc == '' || this.formParamsManual.value.numero_Doc == 0 || this.formParamsManual.value.numero_Doc == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese por favor el nro de documento.');
      return 
    }
    if (this.formParamsManual.value.fechaEmision_Doc == '' || this.formParamsManual.value.fechaEmision_Doc == 0 || this.formParamsManual.value.fechaEmision_Doc == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese por favor la fecha de emsion.');
      return 
    }
    if (this.formParamsManual.value.id_Proveedor == '0' || this.formParamsManual.value.id_Proveedor == 0 || this.formParamsManual.value.id_Proveedor == null)  {
      this.alertasService.Swal_alert('error', 'No se tiene el Id del Proveedor');
      return 
    }

    if (this.formParamsManual.value.nro_RUC == '' || this.formParamsManual.value.nro_RUC == 0 || this.formParamsManual.value.nro_RUC == null)  {
      this.alertasService.Swal_alert('error', 'Digite el nro de Ruc y luego presione la tecla Enter para buscar ..');
      return 
    }

    if (this.formParamsManual.value.concepto_Doc == '' || this.formParamsManual.value.concepto_Doc == 0 || this.formParamsManual.value.concepto_Doc == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingrese el concepto');
      return 
    }

    if (this.formParamsManual.value.subTotal_Doc == '' || this.formParamsManual.value.subTotal_Doc == undefined || this.formParamsManual.value.subTotal_Doc == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese por favor el subTotal');
      return 
    }

    if (this.formParamsManual.value.IgvTotal_Doc == '' || this.formParamsManual.value.IgvTotal_Doc == 0 || this.formParamsManual.value.IgvTotal_Doc == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese por favor el Igv Total');
      return 
    }

    if (this.formParamsManual.value.total_Doc == '' || this.formParamsManual.value.total_Doc == 0 || this.formParamsManual.value.total_Doc == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese por favor el Total del docuemento');
      return 
    }

    if ( Number(this.formParamsManual.value.subTotal_Doc)  < 0  )  {
      this.alertasService.Swal_alert('error', 'Por favor ingresar el subTotal una cantidad positiva.');
      return 
    }

    
    if ( Number(this.formParamsManual.value._)  < 0  )  {
      this.alertasService.Swal_alert('error', 'Por favor ingresar el Total una cantidad positiva.');
      return 
    }
    
    // const cantidad = (String(this.formParamsActividadesDet.value.cantidadAprobada).length == 0)? 0: this.formParamsActividadesDet.value.cantidadAprobada ;
    // const precio = (String(this.formParamsActividadesDet.value.precioBaremo).length == 0)? 0: this.formParamsActividadesDet.value.precioBaremo ;
    // const total= (cantidad * precio);

    this.formParamsManual.patchValue({"id_LiquidacionCaja_Cab":  this.idLiquidacionCaja_Cab_Global , "usuario_creacion" : this.idUserGlobal }); 

    Swal.fire({
      icon: 'info',allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();

    if (this.flagModo_EdicionDet ==false) { /// nuevo

        // if (this.verificarBaremoYacargado( this.formParamsActividadesDet.value.idBaremo ) ==true) {
        //   this.alertasService.Swal_alert('error', 'El Baremos ya se cargo, verifique ..');
        //   return;
        // }

        this.cajaChicaService.set_save_LiquidacionDet(this.formParamsManual.value).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   

             this.idLiquidacionCaja_Det_Global  = Number(res.data);
             this.flagModo_EdicionDet = true;
             this.formParamsManual.patchValue({"id_LiquidacionCaja_Det  ": Number(res.data) });
             this.get_mostrarDetalle_liquidaciones();

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })

    }else{/// editar

        if ( this.idLiquidacionCaja_Det_Global == undefined || this.idLiquidacionCaja_Det_Global == 0 || this.idLiquidacionCaja_Det_Global == null)  {
          this.alertasService.Swal_alert('error', 'No se cargo el Id del detalle de la liquidacion , por favor actualizar la pagina..');
          return 
        }
        this.cajaChicaService.set_update_LiquidacionDet(this.formParamsManual.value  , this.idLiquidacionCaja_Det_Global ).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {        
 
           this.get_mostrarDetalle_liquidaciones();
           this.blank_Detalle();

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })      
    }

  }

  get_mostrarDetalle_liquidaciones(){
    this.cajaChicaService.get_mostrar_liquidacionesDet(this.idLiquidacionCaja_Cab_Global).subscribe((res:RespuestaServer)=>{
     if (res.ok) {            
       this.liquidacionesDet = res.data; 
      //  this.blank_Detalle();
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_Detalle();
     }      
    })        
  }

  modificar_detalleLiquidacion({id_LiquidacionCaja_Det, id_LiquidacionCaja_Cab, Pub_TiDo_Codigo, nroSerie_Doc, numero_Doc, fechaEmision_Doc, id_Proveedor, nro_RUC,  concepto_Doc, subTotal_Doc, IgvTotal_Doc, percepciones_Doc, otrosG_Doc, total_Doc}){  

    this.formParamsManual.patchValue({ 
      "id_LiquidacionCaja_Det" : id_LiquidacionCaja_Det, 
      "id_LiquidacionCaja_Cab" : id_LiquidacionCaja_Cab, 
      "Pub_TiDo_Codigo" : Pub_TiDo_Codigo, 
  
      "nroSerie_Doc" : nroSerie_Doc, 
      "numero_Doc" : numero_Doc, 
      "fechaEmision_Doc" : new Date(fechaEmision_Doc) , 
      "id_Proveedor" : id_Proveedor, 
      "nro_RUC" : nro_RUC, 
  
      "concepto_Doc" : concepto_Doc,  
      "subTotal_Doc" : subTotal_Doc , 
      "IgvTotal_Doc" : IgvTotal_Doc, 
  
      "percepciones_Doc" : percepciones_Doc, 
      "otrosG_Doc" : otrosG_Doc, 
      "total_Doc" : total_Doc, 
      "Estado" : '1', 
    }); 
  
    this.idLiquidacionCaja_Det_Global = id_LiquidacionCaja_Det;
    this.flagModo_EdicionDet= true;  

    setTimeout(() => {
      $("#100").prop("checked", true);
      this.changeComprobante(1);  
    }, 100);
    this.mostrarDocumentosCajaChica_Det( false);

  }
 
  eliminar_detalleLiquidacion(item:any){  
    Swal.fire({
      icon: 'info', allowOutsideClick: false,allowEscapeKey: false, text: 'Eliminando, Espere por favor'
    })
    Swal.showLoading();
    this.cajaChicaService.set_eliminaLiquidacionesDet(item.id_LiquidacionCaja_Det , this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
          var index = this.liquidacionesDet.indexOf( item );
          this.liquidacionesDet.splice( index, 1 );
          this.blank_Detalle();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
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
       this.filesExcel = fileE;
  }

  downloadFormat(){
    window.open('./assets/format/FORMATO_CAJA_CHICA.xlsx');    
  }

  blank(){
    this.filesExcel = [];
    this.inicializarFile()
 }

 subirArchivo(){

  if (!this.formParamsFile.value.file) {
    this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo excel.');
    return;
  }
  
  this.spinner.show();
  this.uploadService.upload_excelCajaChica( this.filesExcel[0].file , this.idLiquidacionCaja_Cab_Global, this.idUserGlobal ).subscribe(
    (res:RespuestaServer) =>{

      this.spinner.hide();
      if (res.ok==true) { 
        this.alertasService.Swal_Success('Se grabó correctamente el archivo..');
        this.blank(); 
        ///---- listando el detalle xxxx
        this.obtenerDatosLiquidacionCabDet(this.idLiquidacionCaja_Cab_Global)

      }else{
          this.filesExcel[0].message = String(res.data);
          this.filesExcel[0].status = 'error';   
      }
      },(err) => {
        this.spinner.hide();
        this.filesExcel[0].message = JSON.stringify(err);
        this.filesExcel[0].status = 'error';   
      }
  );

 }


 obtnerArchivoYacargado(nombreArchivo:string){  
  var flagRepetida=false;
  for (const obj of this.documentosCajaChica) {
    if (  obj.nombreArchivo == nombreArchivo ) {
         flagRepetida = true;
         break;
    }
  }
  return flagRepetida;
}

blankDoc(){
  this.inicializarFormularioDocAdicionales();
 }

 guardar_documentosCajaChica(){  

  if (!this.formParamsDoc.value.file) {
    this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo a cargar.');
    return;
  }    
  if (this.obtnerArchivoYacargado( this.filesDoc[0].file.name ) ==true) {
    this.alertasService.Swal_alert('error', 'El archivo que intenta subir, Ya se encuentra cargado');
    return;
  }

  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false,  text: 'Espere por favor'
  })
  Swal.showLoading();

 this.uploadService.upload_documentosCajaChica( this.filesDoc[0].file , this.idLiquidacionCaja_Cab_Global, this.idUserGlobal ).subscribe(
   (res:RespuestaServer) =>{
    Swal.close();
     if (res.ok==true) { 
          this.filesDoc = [];
          this.alertasService.Swal_Success('Proceso de carga realizado correctamente..');
          this.blankDoc();
          this.mostrarDocumentosCajaChica();           
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

  mostrarDocumentosCajaChica(){   
    if ( this.idLiquidacionCaja_Cab_Global == 0 || this.idLiquidacionCaja_Cab_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la id principal, actualice su pagina por favor..');
      return false;
    }
  
    this.spinner.show();
      this.cajaChicaService.get_documentosCajaChica(this.idLiquidacionCaja_Cab_Global ).subscribe((res:RespuestaServer)=>{
        this.spinner.hide();
      if (res.ok) { 
         this.documentosCajaChica = res.data;
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
    this.cajaChicaService.get_eliminarDocumentosCajaChica(item.id_Liquidacion_Archivo).subscribe((res:RespuestaServer)=>{
      Swal.close();
      console.log(res);
      if (res.ok) { 
               this.alertasService.Swal_Success("Proceso realizado correctamente..")
               var index = this.documentosCajaChica.indexOf( item );
               this.documentosCajaChica.splice( index, 1 );
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
    this.cajaChicaService.get_descargarDocumentosCajaChica(idDocumento_Archivo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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

  
  onDocumentChange(event:any) {   
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

  enviarAprobar(){

    if (this.liquidacionesDet.length ==0) {
      this.alertasService.Swal_alert('error','Agregue por favor el detalle de la Liquidacion..');
      return false;
    }

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de enviar a Aprobar ?')
    .then((result)=>{
      if(result.value){

        this.cajaChicaService.set_enviarAprobarCajaChica(  this.idLiquidacionCaja_Cab_Global,  this.idUserGlobal ).subscribe(
          (res:RespuestaServer) =>{
           Swal.close();
            if (res.ok==true) { 
    
              this.alertasService.Swal_Success('Enviar a Aprobar realizado correctamente..');
              this.cerrarModal_registro();
              this.mostrarInformacion();
     
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
 
  descargarCajaChica({id_LiquidacionCaja_Cab}){   
   
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.cajaChicaService.get_descargarCajaChica(id_LiquidacionCaja_Cab, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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

   verRegistros(){
    if (this.flagVer == 'Ver'){
      this.flagVer = 'Ocultar';
    }else{
      this.flagVer = 'Ver';
    }

   }

   calculosTotales_detalle(){

    let totalesNoAfecto = 0;
    let totalesIgv = 0;
    let totalesPercepciones = 0;
    let totalesOtros = 0;
    let totalesGeneral= 0;

    for (const doc of this.liquidacionesDet) {
      totalesNoAfecto +=  (!doc.subTotal_Doc)? 0 : Number(doc.subTotal_Doc);      
      totalesIgv +=  (!doc.IgvTotal_Doc)? 0 : Number(doc.IgvTotal_Doc);   
      totalesPercepciones +=  (!doc.percepciones_Doc)? 0 : Number(doc.percepciones_Doc);   
      totalesOtros +=  (!doc.otrosG_Doc)? 0 : Number(doc.otrosG_Doc);   
      totalesGeneral +=  (!doc.total_Doc)? 0 : Number(doc.total_Doc);   
    }

    this.totalesNoAfecto = this.formateando(totalesNoAfecto);
    this.totalesIgv = this.formateando(totalesIgv);;
    this.totalesPercepciones = this.formateando(totalesPercepciones);;
    this.totalesOtros = this.formateando(totalesOtros);;
    this.totalesGeneral = this.formateando(totalesGeneral);;

   }

   formateando(x) {
    return Number.parseFloat(x).toFixed(2);
  }

  blank_Det(){
    this.filesDoc_Det = [];
    this.inicializarFormularioDocAdicionales_Det()
 }

  abrirModal_importacion(objDetalle:any){ 
    ///----limpiando la parte de ingreso
    this.flagModo_EdicionDet= false; 
    this.inicializarFormularioManual();

    this.idLiquidacionCaja_Det_Global = objDetalle.id_LiquidacionCaja_Det;
    this.numeroDoc_Global = objDetalle.numero_Doc;
    this.mostrarDocumentosCajaChica_Det(true);
 }

 onDocumentChange_importacion(event:any) {   
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
     this.filesDoc_Det = fileE;
 }
 

 mostrarDocumentosCajaChica_Det(flagNuevo:boolean){   
  if ( this.idLiquidacionCaja_Det_Global == 0 || this.idLiquidacionCaja_Det_Global == null)  {
    this.alertasService.Swal_alert('error', 'No se cargo la id principal, actualice su pagina por favor..');
    return false;
  }

  this.spinner.show();
    this.cajaChicaService.get_documentosCajaChica_Det(this.idLiquidacionCaja_Det_Global ).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
    if (res.ok) { 

        this.documentosCajaChica_Det = res.data;
        this.blank_Det(); 

        if (flagNuevo == true) {
          setTimeout(()=>{ // 
            $('#modal_importacion').modal('show');
          },0);
        }

    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })
 }

 guardar_documentosCajaChica_Det(){  

  if (!this.formParamsDocDet.value.file) {
    this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo a cargar.');
    return;
  }    
  if (this.obtnerArchivoYacargado_Det( this.filesDoc_Det[0].file.name ) ==true) {
    this.alertasService.Swal_alert('error', 'El archivo que intenta subir, Ya se encuentra cargado');
    return;
  }

  const {size : sizeFile} = this.filesDoc_Det[0].file;
  if (this.funcionGlobalServices.verificar_tamanioArchivo(sizeFile , MAXIMO_TAMANIO_BYTES )){
      const tamanioEnMb = MAXIMO_TAMANIO_BYTES / 1000000;
      this.alertasService.Swal_alert('error', `El tamaño máximo del archivo debe ser ${tamanioEnMb} MB`);
      return; 
  }
 
  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false,  text: 'Espere por favor'
  })
  Swal.showLoading();

 this.uploadService.upload_documentosCajaChica_Det( this.filesDoc_Det[0].file , this.idLiquidacionCaja_Det_Global, this.idUserGlobal ).subscribe(
   (res:RespuestaServer) =>{
    Swal.close();
     if (res.ok==true) { 
          this.filesDoc_Det = [];
          this.alertasService.Swal_Success('Proceso de carga realizado correctamente..');
          /// listado doc adjuntados ---
          this.mostrarDocumentosCajaChica_Det(false);  
          
          //----principal el que contienen los detalles
          this.get_mostrarDetalle_liquidaciones();
     }else{
         this.filesDoc_Det[0].message = String(res.data);
         this.filesDoc_Det[0].status = 'error';   
     }
     },(err) => {
      Swal.close();
       this.filesDoc_Det[0].message = JSON.stringify(err);
       this.filesDoc_Det[0].status = 'error';   
     }
   );
  } 

 
  obtnerArchivoYacargado_Det(nombreArchivo:string){  
    var flagRepetida=false;
    for (const obj of this.documentosCajaChica_Det) {
      if (  obj.nombreArchivo == nombreArchivo ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  eliminarArchivoSeleccionado_Det(item:any){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.cajaChicaService.get_eliminarDocumentosCajaChica_Det(item.id_Liquidacion_Archivo).subscribe((res:RespuestaServer)=>{
      Swal.close(); 
      if (res.ok) { 
               this.alertasService.Swal_Success("Proceso realizado correctamente..")
               var index = this.documentosCajaChica_Det.indexOf( item );
               this.documentosCajaChica_Det.splice( index, 1 );
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
 
  downloadFileExport_Det(idDocumento_Archivo:number){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.cajaChicaService.get_descargarDocumentosCajaChica_Det(idDocumento_Archivo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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



}
