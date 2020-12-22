
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { BsLocaleService, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
 import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FuncionesglobalesService } from '../../../../services/funciones/funcionesglobales.service'; 
import { AlertasService } from '../../../../services/alertas/alertas.service'; 
import { LoginService } from '../../../../services/login/login.service';
import { InputFileI } from '../../../../models/inputFile.models';
import { CombosService } from '../../../../services/Logistica/Procesos/combos.service';
import { OrdenCompraAdjuntarService } from '../../../../services/Logistica/Procesos/orden-compra-adjuntar.service';
import { RespuestaServer } from '../../../../models/respuestaServer.models';
import { AdjuntarFileService } from '../../../../services/Logistica/Procesos/adjuntar-file.service';
import { combineLatest } from 'rxjs';



declare var $:any;

@Component({
  selector: 'app-orden-compra-adjuntar',
  templateUrl: './orden-compra-adjuntar.component.html',
  styleUrls: ['./orden-compra-adjuntar.component.css']
})
  
export class OrdenCompraAdjuntarComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParamsFile : FormGroup;
  
  idUserGlobal : string=''; 
  showDetalle = false;

  flagImportar=false;
  // filesExcel:InputFileI[] = [];
  ordenesCompraCab:any [] = [];
  datepiekerConfig:Partial<BsDatepickerConfig>;

  tituloModal="";
  filesOrdenCompra:InputFileI[] = [];
  
  tiposOrdenCompra:any [] =  [];
  estados:any [] =  [];
  tiposDocumentos:any [] =  [];
  opcionModal='';
  id_OrdenCompraGlobal = "";
  id_FileOrdenCompraGlobal = "";

  ordenesCompraFile:any [] =  [];
  flagModo_EdicionDet =false;

  constructor(private alertasService : AlertasService, private localeService: BsLocaleService, private spinner: NgxSpinnerService, private loginService: LoginService,
              private funcionGlobalServices : FuncionesglobalesService, private combosService:CombosService, private ordenCompraAdjuntarService: OrdenCompraAdjuntarService, private adjuntarFileService: AdjuntarFileService)   {
             
    // this.idUserGlobal = this.loginService.get_idUsuario();  
    this.idUserGlobal = this.loginService.get_idUsuario(); 
  }
 
  ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormularioArchivos();

   }

  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      tipoOc: new FormControl('0'), 
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()), 
      estado : new FormControl('0'), 
      nroOc : new FormControl(''), 
     }) 
  }

  inicializarFormularioArchivos(){ 
    this.formParamsFile= new FormGroup({
        nroOc : new FormControl(''),
        tipoDoc : new FormControl('0'),
        file: new FormControl(''),
        nroDoc : new FormControl(''),
        fecha : new FormControl(new Date()),
        importe : new FormControl(''),
     })
   }

 
  getCargarCombos(){ 
    this.spinner.show(); 

    //---- combineLatest : combina varios observables, en un array ---
    //--- la devolucion del subcribe , obtenemos el por medio de la desustructuracion de array
    combineLatest([this.combosService.get_tipoOrdenCompra(),this.combosService.get_estado(), this.combosService.get_tipoDocumento()])
   .subscribe(([tipoOrden,estados,tipoDocumento]) =>{
      this.spinner.hide(); 
      this.tiposOrdenCompra = tipoOrden;
      this.estados = estados;
      this.tiposDocumentos = tipoDocumento;
    })
  }

  mostrarInformacion(){
      if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
        return 
      }
      if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
        return 
      }
 
      const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
      const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);

      console.log(fechaIni)
  
      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        text: 'Espere por favor'
      })
      Swal.showLoading();
      this.ordenCompraAdjuntarService.get_mostrarOrdenesCompra(this.formParamsFiltro.value.tipoOc, fechaIni,fechaFin , this.formParamsFiltro.value.estado,  this.formParamsFiltro.value.nroOc  ).subscribe((res:RespuestaServer)=>{            
        Swal.close()
        if (res.ok==true) {         
          this.ordenesCompraCab = res.data;
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
  }


  blank(){
    this.formParamsFile.get('file').enable();
    this.inicializarFormularioArchivos();
    this.flagModo_EdicionDet= false;
    this.id_FileOrdenCompraGlobal = '';
    this.formParamsFile.patchValue({ "nroOc" : this.id_OrdenCompraGlobal });
   }
     
  mostrarOrdenCompraArchivos(){   
    if ( this.id_OrdenCompraGlobal == '' || this.id_OrdenCompraGlobal == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la informacion de la Orden Compra, por favor actualizar la pagina..');
      return false;
    }
    this.ordenesCompraFile = [];
    this.ordenCompraAdjuntarService.get_buscarArchivosOrdenCompra(this.id_OrdenCompraGlobal,this.opcionModal ).subscribe((res:RespuestaServer)=>{
      if (res.ok) { 
         this.ordenesCompraFile = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    }) 
  }
    
  abrirModal_Adjuntar(objOrdenCompra :any, opcionModal:string){ 
 
    // const {id_LiquidacionOT, id_OT, id_Proyectista,  OTnumero, NewLiquidacion } = objCancelacion;
    const {idOrdenCompra , nroOC} = objOrdenCompra

    this.id_OrdenCompraGlobal =  idOrdenCompra;
    this.opcionModal = opcionModal;

    this.blank();

    if (opcionModal =='cotizacion') {
      this.tituloModal = "Adjuntar Cotizaciones";
    }
    else if (opcionModal =='documento') {
      this.tituloModal = "Adjuntar Documentos";
    }
    this.mostrarOrdenCompraArchivos();

    setTimeout(()=>{ // 
      $('#modal_adjuntar').modal('show');
    },0);

  }

  cerrarModal_adjuntar(){
    $('#modal_adjuntar').modal('hide');    
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
      this.filesOrdenCompra = fileE;
      console.log(this.filesOrdenCompra)
  }

  subirArchivo(){

    if (this.flagModo_EdicionDet ==false ){  //// nuevo

      let fechaImpor = null;
      if (this.opcionModal =='documento') {
 
       if (this.formParamsFile.value.tipoDoc == '' || this.formParamsFile.value.tipoDoc == 0 || this.formParamsFile.value.tipoDoc == null)  {
         this.alertasService.Swal_alert('error', 'Seleccione el Tipo de documento.');
         return 
       } 
 
       if (this.formParamsFile.value.fecha == '' || this.formParamsFile.value.fecha == 0 || this.formParamsFile.value.fecha == null)  {
         this.alertasService.Swal_alert('error', 'Seleccione la fecha por favor.');
         return 
       }  
       fechaImpor = this.funcionGlobalServices.formatoFechaIngles(this.funcionGlobalServices.formatoFecha(this.formParamsFile.value.fecha)) 
     }
 
 
     if (!this.formParamsFile.value.file) {
       this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo que va a cargar.');
       return;
     }  
     if (this.obtnerArchivoYacargado( this.filesOrdenCompra[0].file.name ) ==true) {
       this.alertasService.Swal_alert('error', 'El archivo que intenta subir, Ya se encuentra cargado');
       return;
     }
    
     Swal.fire({
       icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
     })
     Swal.showLoading(); 

     this.adjuntarFileService.upload_fileOrdenCompra( this.id_OrdenCompraGlobal, this.formParamsFile.value.nroOc, this.formParamsFile.value.tipoDoc, this.filesOrdenCompra[0].file , this.opcionModal, this.idUserGlobal, this.formParamsFile.value.nroDoc, fechaImpor, this.formParamsFile.value.importe  ).subscribe(
       (res:RespuestaServer) =>{
         Swal.close();
         if (res.ok==true) { 
            this.alertasService.Swal_Success('Proceso de carga realizado correctamente..');
            this.blank();
            this.mostrarOrdenCompraArchivos();
         }else{
           alert(JSON.stringify(res.data)); 
         }
         },(err) => {
           Swal.close();
           alert(JSON.stringify(err.data));
         }
     );  
     
    }else{ /// editar los campos      

      if (this.id_FileOrdenCompraGlobal == '' ||   this.id_FileOrdenCompraGlobal == null)  {
        this.alertasService.Swal_alert('error', 'No se cargo correctamente el ID del documento, actualice su pagina.');
        return 
      } 

     const fechaImpor =  this.funcionGlobalServices.formatoFechaIngles(this.funcionGlobalServices.formatoFecha(this.formParamsFile.value.fecha)); ///this.funcionGlobalServices.formatoFecha(this.formParamsFile.value.fecha);  
 
      Swal.fire({
        icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
      })
      Swal.showLoading();
      this.ordenCompraAdjuntarService.set_editarFileOrdenCompra(this.id_FileOrdenCompraGlobal, this.formParamsFile.value.tipoDoc, this.formParamsFile.value.nroDoc, fechaImpor, this.formParamsFile.value.importe ).subscribe((res:RespuestaServer)=>{
        Swal.close();
        console.log(res);
        if (res.ok) { 
           this.alertasService.Swal_Success("Actualizacion realizado correctamente..");
           this.blank();
           this.mostrarOrdenCompraArchivos();
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })

    }

   }

   obtnerArchivoYacargado(nombreArchivo:string){  
    var flagRepetida=false;
    for (const obj of this.ordenesCompraFile) {
      if (  obj.Log_OCom_Nombre == nombreArchivo ) {
           flagRepetida = true;
           break;
      }
    }  
    
    return flagRepetida;
   }
      
  eliminarFileSeleccionado(item:any){    
  
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.ordenCompraAdjuntarService.set_anularFileOrdenCompra(item.id_Log_OCom_Documento).subscribe((res:RespuestaServer)=>{
      Swal.close();
      console.log(res);
      if (res.ok) { 
               this.alertasService.Swal_Success("Proceso realizado correctamente..")
               var index = this.ordenesCompraFile.indexOf( item );
               this.ordenesCompraFile.splice( index, 1 );
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
    
  descargarArchivoSeleccionado(id_Log_OCom_Documento:string){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.ordenCompraAdjuntarService.get_descargarFileOrdenCompra(id_Log_OCom_Documento, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
      console.log(res);
      if (res.ok) { 
        window.open(String(res.data),'_blank');
        // id_link.href = res.data;
        // id_link.click(); 
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  editarFileSeleccionado(objliq:any){    
    this.formParamsFile.patchValue({
        "file" : '',
        "tipoDoc" : objliq.id_TipoArchivo ,
        "nroDoc" : objliq.Log_OCom_NroDoc ,
        "fecha" : new Date(objliq.Log_OCom_FechaDoc), 
        "importe" : objliq.Log_OCom_ImporteDoc  
    });
    
    this.id_FileOrdenCompraGlobal = objliq.id_Log_OCom_Documento;
    this.flagModo_EdicionDet= true;
    this.formParamsFile.get('file').disable();
  }

}
