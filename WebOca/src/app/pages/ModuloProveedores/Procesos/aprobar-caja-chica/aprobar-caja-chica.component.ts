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
@Component({
  selector: 'app-aprobar-caja-chica',
  templateUrl: './aprobar-caja-chica.component.html',
  styleUrls: ['./aprobar-caja-chica.component.css']
})
 

export class AprobarCajaChicaComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsManual: FormGroup;
  formParamsFile: FormGroup;
  formParamsDoc : FormGroup;
  formParamsContabilidad  : FormGroup;

  idUserGlobal : string = '' ;
  flag_modoEdicion :boolean =false;
  flagModo_EdicionDet  :boolean =false;

  liquidacionCajaCab :any[]=[]; 
  centroCostro  :any[]=[]; 
  estados :any[]=[]; 
  tiposDocumentosFiles :any[]=[]; 
  
  objLiquidacionesCab:any = {};
  liquidacionesDet :any[]=[]; 
  liquidacionesArchivos :any[]=[]; 


  filtrarCab = "";
  filtrarDet = "";

  idLiquidacionCaja_Cab_Global = 0;
  idLiquidacionCaja_Det_Global = 0;
  flagComprobante = 1;
  idEstado_Global = 0;

  filesExcel:InputFileI[] = [];

  documentosCajaChica :any[]=[];
  filesDoc:InputFileI[] = []; 
  
  flagExpandirComprimir = false;
  idLiquidacionCab_Global =0;
  objLiquidacionGlobal:any ={};

  noAfectoGlobal = 0;
  igvGlobal = 0;
  percepcionesGlobal = 0;
  otrosCargosGlobal = 0;
  totalGlobal = 0;

  cuentaContableGastos:any[]= [];
  cuentaContableIGV:any[]= [];
  cuentaContablePagar:any[]= [];

  files : InputFileI[] = [];
 
  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private proveedorService:ProveedorService , private cajaChicaService : CajaChicaService, private uploadService : UploadService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormularioContabilidad();
   this.inicializarFormularioFile(); 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idCentroCostro : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('0'),
     }) 
 } 

 inicializarFormularioContabilidad(){ 
  this.formParamsContabilidad= new FormGroup({
    id_LiquidacionCaja_Det : new FormControl('0'), 
    importeDocumento : new FormControl(''),
    Glosa : new FormControl(''),
    CtaGastos : new FormControl('0'),
    CtaIGV : new FormControl('0'),
    CtaxPagar : new FormControl('0'),
    Estado : new FormControl('1'),
    usuario_creacion : new FormControl(''),
   }) 
 }  

 inicializarFormularioFile(){ 
  this.formParamsFile = new FormGroup({
    file : new FormControl(''),  
   }) 
 }  


 getCargarCombos(){ 
  this.spinner.show(); 
  combineLatest([this.registerService.get_centroCosto(this.idUserGlobal), this.registroFacturasService.get_estado_cajaChica(), this.registroFacturasService.get_tipoDocumentoFile(), this.registerService.get_cuentaContable_gastos(), this.registerService.get_cuentaContable_igv(), this.registerService.get_cuentaContable_pagar()   ])
   .subscribe(([ _centroCostro, _estados, _tiposDocumentosFiles, _cuentaContableGastos, _cuentaContableIGV, _cuentaContablePagar ]) =>{
      this.spinner.hide(); 
        this.centroCostro =_centroCostro;
        this.estados = _estados; 
        this.tiposDocumentosFiles =_tiposDocumentosFiles;

        this.cuentaContableGastos = _cuentaContableGastos;
        this.cuentaContableIGV = _cuentaContableIGV;
        this.cuentaContablePagar = _cuentaContablePagar; 
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
    this.cajaChicaService.get_mostrar_aprobacionCajaChicaCab(this.formParamsFiltro.value.idCentroCostro, fechaIni,fechaFin, this.formParamsFiltro.value.idEstado, this.idUserGlobal   )
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

 

 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_aprobacion').modal('hide');  
    },0); 
  }

abrirModal_liquidacion(objLiq:any){

  this.idLiquidacionCab_Global = objLiq.id_LiquidacionCaja_Cab;
  this.objLiquidacionGlobal = objLiq;

  this.mostrarDetalleLiquidaciones();
  setTimeout(()=>{ // 
    $('#modal_aprobacion').modal('show');          
  },0); 
  this.mostrarDetalleLiquidaciones_archivos();
}


aprobarDevolver(opcionProceso: number){

  if (this.idLiquidacionCab_Global == 0) {
    this.alertasService.Swal_alert('error','No se cargo el ID del documento actualice su pagina por favor');
    return 
  }

  let mensaje = '';
  if (opcionProceso == 1 ) {
    mensaje = 'Esta seguro de Aprobar ?';
  }
  if (opcionProceso == 2 ) {
    mensaje = 'Esta seguro de Devolver ?';
  }

  this.alertasService.Swal_Question('Sistemas', mensaje)
  .then((result)=>{
    if(result.value){

      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
      Swal.showLoading();
      this.registroFacturasService.get_aprobarDevolverFactura( this.idLiquidacionCab_Global , opcionProceso , this.idUserGlobal,0 ).subscribe((res:RespuestaServer)=>{
        Swal.close();        
        if (res.ok ==true) {               
          //-----listando la informacion  
          this.mostrarInformacion();  
          this.alertasService.Swal_Success('Proceso realizado correctamente..');   
          this.cerrarModal();
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
       
    }
  }) 

 }

 mostrarDetalleLiquidaciones(){ 

    this.spinner.show();
    this.cajaChicaService.get_mostrar_detalleCajaChica( this.idLiquidacionCab_Global,  this.idUserGlobal   )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.liquidacionesDet = res.data;     
                this.calculoTotalesDetalle();
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 } 

 mostrarDetalleLiquidaciones_archivos(){ 

  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando detalle de Archivos, espere por favor'  })
  Swal.showLoading();
  this.cajaChicaService.get_mostrar_detalleCajaChica_archivos( this.idLiquidacionCab_Global,  this.idUserGlobal   )
      .subscribe((res:RespuestaServer)=>{  
          Swal.close();    
          if (res.ok==true) {        
              this.liquidacionesArchivos = res.data;     
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
}

 calculoTotalesDetalle(){
    let noAfecto = 0 ;
    let igv = 0 ;
    let percepciones = 0;
    let otrosCargos = 0;
    let total = 0;
  
    for (const cajaDet of this.liquidacionesDet) {
      noAfecto += (cajaDet.noAfecto == '') ? 0 : Number(cajaDet.noAfecto);                  
      igv += (cajaDet.igv == '') ? 0 : Number(cajaDet.igv);   
      percepciones += (cajaDet.percepciones == '') ? 0 : Number(cajaDet.percepciones);  
      otrosCargos += (cajaDet.otrosCargos == '') ? 0 : Number(cajaDet.otrosCargos);   
      total += (cajaDet.total == '') ? 0 : Number(cajaDet.total);   
    }
  
    this.noAfectoGlobal =  noAfecto;
    this.igvGlobal =  igv;
    this.percepcionesGlobal =  percepciones;
    this.otrosCargosGlobal =  otrosCargos;
    this.totalGlobal =  total;
 }

 eliminarArchivo_cajaChica(item:any){     
  this.spinner.show();
   this.cajaChicaService.delete_detalleArchivo_cajaChica(item.id_Liquidacion_Archivo).subscribe((res:RespuestaServer)=>{
    this.spinner.hide();
    if (res.ok) { 
        var index = this.liquidacionesArchivos.indexOf( item );
        this.liquidacionesArchivos.splice( index, 1 );
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })
 }


 abrirModal_cuentaContables(obj:any){

  const { id_LiquidacionCaja_Det, Glosa, CtaGastos, CtaIGV, CtaxPagar } = obj;

  this.formParamsContabilidad.patchValue({ "id_LiquidacionCaja_Det" : Number(id_LiquidacionCaja_Det), "Glosa" : Glosa ,"CtaGastos" : CtaGastos, "CtaIGV" : CtaIGV , "CtaxPagar" : CtaxPagar });  

  setTimeout(()=>{ // 
    $('#modal_cuentasContables').modal('show'); 
  },0); 
 }

 cerrarModal_cuentaContables(){
  setTimeout(()=>{ // 
    $('#modal_cuentasContables').modal('hide');  
  },0); 
 }

    
 keyPress(event: any) {
  this.funcionGlobalServices.verificar_soloNumeros(event); 
 }

 
 almacenarCuentasContables_cajaChica(){    

  if (this.formParamsContabilidad.value.id_LiquidacionCaja_Det == '' || this.formParamsContabilidad.value.id_LiquidacionCaja_Det == null || this.formParamsContabilidad.value.id_LiquidacionCaja_Det == undefined ) {
    this.alertasService.Swal_alert('error','No se cargó el ID correctamente..');
    return 
  }

  if (this.formParamsContabilidad.value.CtaGastos == '0' || this.formParamsContabilidad.value.CtaGastos == 0 || this.formParamsContabilidad.value.CtaGastos == undefined ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la Cuenta de Gastos..');
    return 
  }

  if (this.formParamsContabilidad.value.CtaIGV == '0' || this.formParamsContabilidad.value.CtaIGV == 0 || this.formParamsContabilidad.value.CtaIGV == undefined ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la Cuenta de IGV..');
    return 
  }

  if (this.formParamsContabilidad.value.CtaxPagar == '0' || this.formParamsContabilidad.value.CtaxPagar == 0 || this.formParamsContabilidad.value.CtaxPagar == undefined ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la Cuenta por Pagar..');
    return 
  }

  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
  })
  Swal.showLoading();
  this.registroFacturasService.set_saveUpdate_cuentasContables_cajaChica(this.formParamsContabilidad.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
    Swal.close();
 
    if (res.ok) { 
      this.mostrarDetalleLiquidaciones ()
      this.alertasService.Swal_Success('Proceso realizado correctamente..');   
      this.cerrarModal_cuentaContables();
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })
 } 

   
 blank_file(){
   this.inicializarFormularioFile();
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
     this.files = fileE;
  }
  
 
  exportar_formatoLiquidacion(){ 
    this.spinner.show();
    this.cajaChicaService.get_descargar_formatoLiquidacion( this.idLiquidacionCab_Global,  this.idUserGlobal   )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
              window.open(String(res.data),'_blank');
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }

 subirArchivo(){

   if (!this.formParamsFile.value.file) {
     this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo que va a cargar.');
     return;
   }  
   Swal.fire({
     icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
   })
   Swal.showLoading(); 

   this.cajaChicaService.upload_file_liquidaciones( this.idLiquidacionCab_Global,  this.files[0].file , this.idUserGlobal  ).subscribe(
     (res:RespuestaServer) =>{
       Swal.close();
       if (res.ok==true) { 
          this.alertasService.Swal_Success('Proceso de Actualizacion realizado correctamente..');
          this.blank_file();
          this.mostrarDetalleLiquidaciones ();
       }else{
         alert(JSON.stringify(res.data)); 
       }
       },(err) => {
         Swal.close();
         alert(JSON.stringify(err.data));
       }
   );  
   
 }


 


}

