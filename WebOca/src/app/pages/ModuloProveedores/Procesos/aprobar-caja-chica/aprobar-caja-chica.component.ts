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

  idUserGlobal : string = '' ;
  flag_modoEdicion :boolean =false;
  flagModo_EdicionDet  :boolean =false;

  liquidacionCajaCab :any[]=[]; 
  centroCostro  :any[]=[]; 
  estados :any[]=[]; 
  tiposDocumentosFiles :any[]=[]; 
  
  objLiquidacionesCab:any = {};
  liquidacionesDet :any[]=[]; 


  filtrarCab = "";
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
 
  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private proveedorService:ProveedorService , private cajaChicaService : CajaChicaService, private uploadService : UploadService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idCentroCostro : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('0'),
     }) 
 } 

 getCargarCombos(){ 
  this.spinner.show(); 
  combineLatest([this.registerService.get_centroCosto(), this.registroFacturasService.get_estado_cajaChica(), this.registroFacturasService.get_tipoDocumentoFile() ])
   .subscribe(([ _centroCostro, _estados, _tiposDocumentosFiles ]) =>{
      this.spinner.hide(); 
        this.centroCostro =_centroCostro;
        this.estados = _estados; 
        this.tiposDocumentosFiles =_tiposDocumentosFiles;
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

  setTimeout(()=>{ // 
    $('#modal_aprobacion').modal('show');          
  },0); 

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
      this.registroFacturasService.get_aprobarDevolverFactura( this.idLiquidacionCab_Global , opcionProceso , this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
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


 

 


}

