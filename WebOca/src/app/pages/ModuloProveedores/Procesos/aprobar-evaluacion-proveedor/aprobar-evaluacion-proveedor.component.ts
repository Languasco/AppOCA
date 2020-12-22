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
 
declare const $:any;

@Component({
  selector: 'app-aprobar-evaluacion-proveedor',
  templateUrl: './aprobar-evaluacion-proveedor.component.html',
  styleUrls: ['./aprobar-evaluacion-proveedor.component.css']
})


export class AprobarEvaluacionProveedorComponent implements OnInit {

  formParams : FormGroup;
 
  formParamsFiltro2 : FormGroup;
  formParamsRuc : FormGroup;

  idUserGlobal = '';
  idEvaluacionCab_Global = 0;
  idEvaluacionDet_Global = 0;

  idEstadoCab_Global = '215';
  descripcionEstadoGlobal = 'Generado'

  flag_modoEdicion = false;
  checkeadoAll= false;

  estados:any[] =[];
 
  evaluacionesCab:any[] =[];

  filtrarCab = '';
  filtrarList = '';

  centroCostro:any[] =[];
  tipoResultado:any[] =[];

  evaluacionProveedorCab:any = {};
  evaluacionProveedorDet:any[] =[];

  tabControlDetalle: string[] = ['EVALUACION DE PROVEEDORES',' LISTA DE EVALUACIONES']; 
  selectedTabControlDetalle :any;  
  flagBloquearEvaluacionDet = true;

  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private uploadService : UploadService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }

  ngOnInit(): void {
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
    this.getCargarCombos();
    this.inicializarFormularioFiltro2();     
    this.inicializarFormularioRuc();
  }
  
 

  inicializarFormularioFiltro2(){ 
    this.formParamsFiltro2= new FormGroup({ 
      idCentroCostro : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('215'),
     }) 
  }


  inicializarFormularioRuc(){ 
    this.formParamsRuc= new FormGroup({ 
      id_Proveedor : new FormControl('0'),
      nro_RUC : new FormControl(''),
      razonsocial :new FormControl('')
     }) 
  }
  
  getCargarCombos(){ 
    this.spinner.show(); 
    combineLatest([ this.registroFacturasService.get_estado_evaluacion(), this.registerService.get_centroCosto() ])
     .subscribe(([ _estados, _centroCostro ]) =>{
        this.spinner.hide(); 
          this.estados = _estados; 
          this.centroCostro =_centroCostro;
      })
  }

 
 

  getColorEstado(flagColorear:string){ 

    switch (flagColorear) {
      case '0':
        return 'white';
      case '1':
        return 'orange'; 
    } 
   }
 
 

  cerrarModal_registro(){
    setTimeout(()=>{ // 
      $('#modal_registro').modal('hide');  
    },0); 
  }


  calculosPuntuacionTotal(){

    let totalProveedor = 0; 

    for (const item of this.evaluacionProveedorDet ) {

      totalProveedor = 0;
      totalProveedor = Number(item.precio) + Number(item.calidad) + Number(item.tEntrega) + Number(item.credito) + Number(item.garantia);        
      item.puntuacion = totalProveedor

      item.status = 'Fuera de los margenes'
      if (totalProveedor == 12  ||  totalProveedor == 13 || totalProveedor == 14) {
        item.status = 'PROVEEDOR (A)';
      }
      if (totalProveedor == 9  ||  totalProveedor == 10 || totalProveedor == 11) {
        item.status = 'PROVEEDOR (B)';
      }
      if (totalProveedor < 9) {
        item.status = 'PROVEEDOR (C)';
      }

    }

  }

  obtenerDatosEvaluacionCabDet(idEvaluacion_Cab : number,opcion:string ){

    this.spinner.show();
      this.registerService.get_evaluacionProveedorCabDet( idEvaluacion_Cab, this.idUserGlobal  ).subscribe((res :RespuestaServer)=>{ 
        this.spinner.hide(); 
 
         if (res.ok) {
          this.evaluacionProveedorCab = res.data['evaluacionCab'][0];
          this.evaluacionProveedorDet = res.data['evaluacionDet'];
          setTimeout(()=>{ //
            
            this.calculosPuntuacionTotal();

            $('#modal_registro').modal('show');  
             console.log(this.idEstadoCab_Global );
            if (opcion == 'E') { 

              if (this.idEstadoCab_Global != '215') {
                $('#formDetalle').addClass('disabledForm');  
              }else{
                 $('#formDetalle').removeClass('disabledForm');  
              }

            }else{
              $('#formDetalle').removeClass('disabledForm');  
            }

          },0);    
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

  buscarRuc(nroRuc:any){

    if (!nroRuc){
        return;
    }      

    this.spinner.show();
    this.registerService.get_consultarRucProveedor( String(nroRuc).trim()  , this.idUserGlobal ).subscribe((res :RespuestaServer)=>{ 
      this.spinner.hide(); 

       if (res.ok) {
        if (res.data.length > 0) {
          this.formParamsRuc.patchValue({ "id_Proveedor" : res.data[0]['id_Proveedor'], "nro_RUC": res.data[0]['nro_RUC'] , "razonsocial" :  res.data[0]['razonsocial'] });     
        }else{
          this.alertasService.Swal_alert('warning', 'Lo sentimos no hay resultados con  el Ruc ingresado, verifique.');
          this.formParamsRuc.patchValue({ "id_Proveedor" : '0', "razonsocial" :  'No se encontro Proveedor' });     
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
 
  verificarRucYacargado(nro_RUC: number){  
    var flagRepetida=false;
    for (const obj of this.evaluacionProveedorDet) {
      if (  obj.ruc == nro_RUC ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  eliminar_evaluacionProveedorDet(item:any){  

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de eliminar el registro ?')
    .then((result)=>{
      if(result.value){

        Swal.fire({
          icon: 'info', allowOutsideClick: false,allowEscapeKey: false, text: 'Espere por favor'
        })
        Swal.showLoading();
        this.registerService.set_eliminarEvaluacionDet(item.id_Evaluacion_Det , this.idUserGlobal).subscribe((res:RespuestaServer)=>{
          Swal.close();
          if (res.ok) { 
              var index = this.evaluacionProveedorDet.indexOf( item );
              this.evaluacionProveedorDet.splice( index, 1 ); 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
         
      }
    }) 

  }
  
  
  actualizarDetalleAprobacion(opcionCampo :any,  valor:any, objDocumentoDet :any, idInput :number){
 
    if (!valor) {
      this.alertasService.Swal_alert('error','Es necesario ingresar una cantidad');
      return;
    }
    if ( Number(valor) <=0 ) {
      this.alertasService.Swal_alert('error','Tiene que ingresar un valor positivo');
      return;
    }
    if ( Number(valor) >5 ) {
      this.alertasService.Swal_alert('error','Puntuacion maxima 5, Excede la puntuacion verifique ..');
      return;
    }


    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, Espere por favor'
    })
    Swal.showLoading();
    this.registerService.set_editarValorEvaluacionDet( opcionCampo, valor, objDocumentoDet.id_Evaluacion_Det, this.idUserGlobal  ).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
        this.alertasService.Swal_alert('success','Se actualizó la cantidad correctamente..');
        this.calculosPuntuacionIndividual(objDocumentoDet.id_Evaluacion_Det);

        if (opcionCampo == 'precio'){
          const doc = document.getElementById('id_calidad_' + idInput );
          doc.focus();
        }
        else if (opcionCampo == 'calidad'){
          const doc = document.getElementById('id_tEntrega_' + idInput );
          doc.focus();
        }
        else if (opcionCampo == 'tentrega'){
          const doc = document.getElementById('id_credito_' + idInput );
          doc.focus();
        }
        else if (opcionCampo == 'credito'){
          const doc = document.getElementById('id_garantia_' + idInput );
          doc.focus();
        }
        else if (opcionCampo == 'garantia'){

          const totalRegi = this.evaluacionProveedorDet.length - 1 ;
          const idEnfoque = (idInput+1);

          if (totalRegi  != idInput) {
            const doc = document.getElementById('id_precio_' + idEnfoque );
            doc.focus();
          }

        }

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })

  }
  calculosPuntuacionIndividual(idEvaluacion_Det : number){

    let totalProveedor = 0; 

    for (const item of this.evaluacionProveedorDet ) {


      if (item.id_Evaluacion_Det ==  idEvaluacion_Det ) {
        totalProveedor = 0;
        totalProveedor = Number(item.precio) + Number(item.calidad) + Number(item.tEntrega) + Number(item.credito) + Number(item.garantia);        
        item.puntuacion = totalProveedor
  
        item.status = 'Fuera de los margenes'
        if (totalProveedor == 12  ||  totalProveedor == 13 || totalProveedor == 14) {
          item.status = 'PROVEEDOR (A)';
        }
        if (totalProveedor == 9  ||  totalProveedor == 10 || totalProveedor == 11) {
          item.status = 'PROVEEDOR (B)';
        }
        if (totalProveedor < 9) {
          item.status = 'PROVEEDOR (C)';
        }
        break
      }



    }

  }


  keyPress(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros(event)  ;
   }

   onlyDecimalNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
 }

 
 ///// SEGUNDA FICHA LISTA DE EVALUACIONES


 mostrarInformacion_listaEvaluaciones(){

  if (this.formParamsFiltro2.value.fecha_ini == '' || this.formParamsFiltro2.value.fecha_ini == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
    return 
  } 
  if (this.formParamsFiltro2.value.fecha_fin == '' || this.formParamsFiltro2.value.fecha_fin == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
    return 
  } 

  if (this.formParamsFiltro2.value.idEstado == '0' || this.formParamsFiltro2.value.idEstado == 0 ) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Estado..');
    return 
  } 

  const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro2.value.fecha_ini);
  const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro2.value.fecha_fin);

  this.spinner.show();
  this.registerService.get_listaEvaluacionesCab( this.formParamsFiltro2.value.idCentroCostro, fechaIni, fechaFin, this.formParamsFiltro2.value.idEstado , this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
    this.spinner.hide();
    if (res.ok) { 
      this.evaluacionesCab = res.data;
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })
}

 editar_evaluacionCab({id_Evaluacion_Cab, idEstado, descripcionEstado}){

  this.idEvaluacionCab_Global = Number(id_Evaluacion_Cab);
  this.idEstadoCab_Global = idEstado;
  this.descripcionEstadoGlobal = descripcionEstado;
  this.obtenerDatosEvaluacionCabDet( this.idEvaluacionCab_Global,'E');

 }


 
 async aprobarRechazarEvaluacion(opcion:string){ 

  if (this.idEvaluacionCab_Global == null || this.idEvaluacionCab_Global == 0) {
    this.alertasService.Swal_alert('error','No se cargo el ID, por favor actualice la pagina..');
    return 
  }
  let mens = (opcion =='A') ? 'Esta seguro de Aprobar ?' : 'Esta seguro de Rechazar ?';

  if (opcion =='A') {
    mens = 'Esta seguro de Aprobar ?';
  }
  if (opcion =='R') {
    mens = 'Esta seguro de Rechazar ?';
  }
  if (opcion =='O') {
    mens = 'Esta seguro de Observar ?';
  }
 
  this.alertasService.Swal_Question('Sistemas', mens)
  .then((result)=>{
    if(result.value){

      Swal.fire({
        icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Aprobando, Espere por favor'
      })
      this.registerService.set_AprobarRechazarEvaluacionCab( this.idEvaluacionCab_Global,  opcion, this.idUserGlobal ).subscribe(
        (res:RespuestaServer) =>{
         Swal.close();
          if (res.ok==true) {     
            this.alertasService.Swal_Success('Proceso realizado correctamente..');
            this.cerrarModal_registro();     
            this.mostrarInformacion_listaEvaluaciones(); 
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

 

}

