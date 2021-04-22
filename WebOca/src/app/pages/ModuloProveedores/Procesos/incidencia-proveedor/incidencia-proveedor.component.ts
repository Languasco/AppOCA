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
declare const $:any;


@Component({
  selector: 'app-incidencia-proveedor',
  templateUrl: './incidencia-proveedor.component.html',
  styleUrls: ['./incidencia-proveedor.component.css']
})
 
export class IncidenciaProveedorComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal : string = '' ;
  flag_modoEdicion :boolean =false;

  incidenciasCab :any[]=[]; 
  centroCostro  :any[]=[]; 
  filtrarCab = "";
 
  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private proveedorService:ProveedorService) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  //  this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idCentroCostro : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Incidencia: new FormControl('0'), 
      id_Proveedor: new FormControl('0'),
      nro_RUC : new FormControl(''),
      razonSocial : new FormControl(''),
      fechaIngreso_Incidencia: new FormControl( new Date()), 
      observaciones_Incidencia: new FormControl(''), 
      Estado : new FormControl('220'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 getCargarCombos(){ 
  this.spinner.show(); 
  combineLatest([this.registerService.get_centroCosto(this.idUserGlobal) ])
   .subscribe(([ _centroCostro ]) =>{
      this.spinner.hide(); 
        this.centroCostro =_centroCostro;
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
    this.proveedorService.get_mostrarIncidenciasCab(this.formParamsFiltro.value.idCentroCostro, fechaIni,fechaFin, this.idUserGlobal   )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.incidenciasCab = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }   
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
 }

 nuevo(){
    this.flag_modoEdicion = false;
    this.inicializarFormulario();  
    setTimeout(()=>{ // 
        $('#modal_mantenimiento').modal('show');   
        $('#txtBuscar').removeClass('disabledForm'); 
    },0); 
 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Incidencia == '' || this.formParams.value.id_Incidencia == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.id_Proveedor == '' || this.formParams.value.id_Proveedor == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el centro de costo');
    return 
  }

  if (this.formParams.value.fechaIngreso_Incidencia == '' || this.formParams.value.fechaIngreso_Incidencia == null) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha de registro');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading(); 

     this.proveedorService.set_save_incidencias(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Incidencia" : Number(res.data) });
         console.log(res.data)
         
         this.mostrarInformacion();
         this.cerrarModal();
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.proveedorService.set_edit_incidencias(this.formParams.value , this.formParams.value.id_Incidencia).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {           

         this.mostrarInformacion();
         this.cerrarModal();
         this.alertasService.Swal_Success('Se actualizó correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })

   }

 } 

 editar({ id_Incidencia, id_Proveedor, ruc, razonSocial, fechaIngreso_Incidencia, observaciones_Incidencia, Estado  }){

   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Incidencia" : id_Incidencia,  "id_Proveedor" : id_Proveedor, "nro_RUC": ruc , "razonSocial" : razonSocial  ,"fechaIngreso_Incidencia" : new Date(fechaIngreso_Incidencia), "observaciones_Incidencia" : observaciones_Incidencia, "Estado" : Estado, "usuario_creacion" : this.idUserGlobal });

   setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');   
      $('#txtBuscar').addClass('disabledForm');
    },0);  
 } 

 anular(objBD:any){

   if (objBD.Estado === '221' || objBD.Estado == '221') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.proveedorService.set_anular_incidenciasCab(objBD.id_Incidencia).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.incidenciasCab) {
             if (user.id_Incidencia == objBD.id_Incidencia ) {
                 user.Estado = '221';
                 user.descripcion_estado =  "Anulado" ;
                 break;
             }
           }
           this.alertasService.Swal_Success('Se anulo correctamente..')  

         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
        
     }
   }) 

   
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
          this.formParams.patchValue({ "id_Proveedor" : res.data[0]['id_Proveedor'], "nro_RUC": res.data[0]['nro_RUC'] , "razonSocial" :  res.data[0]['razonsocial'] });     
          console.log(this.formParams)
        }else{
          this.alertasService.Swal_alert('warning', 'Lo sentimos no hay resultados con  el Ruc ingresado, verifique.');
          this.formParams.patchValue({ "id_Proveedor" : '0', "razonSocial" :  'No se encontro Proveedor' });     
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
  
 

  descargarIncidencias( ){  
    
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

   
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.proveedorService.get_descargarIncidencias(fechaIni, fechaFin, this.idUserGlobal, this.formParamsFiltro.value.idCentroCostro).subscribe((res:RespuestaServer)=>{
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
