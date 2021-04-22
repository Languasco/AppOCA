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
  selector: 'app-evaluacion-proveedor',
  templateUrl: './evaluacion-proveedor.component.html',
  styleUrls: ['./evaluacion-proveedor.component.css']
})
export class EvaluacionProveedorComponent implements OnInit {

  formParams : FormGroup;
  formParamsFiltro : FormGroup;
  formParamsFiltro2 : FormGroup;
  formParamsRuc : FormGroup;

  idUserGlobal = '';
  idEvaluacionCab_Global = 0;
  idEvaluacionDet_Global = 0;

  idEstadoCab_Global = '215';

  flag_modoEdicion = false;
  checkeadoAll= false;

  estados:any[] =[];
  proveedoresCab:any[] =[];
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
  flagExpandirComprimir = false;

  cursos=[];
  selectionStart:any;
  selectionEnd =0;
  scrollTop =0;

  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private uploadService : UploadService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }

  ngOnInit(): void {
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
    this.getCargarCombos();
    this.inicializarFormularioFiltro(); 
    this.inicializarFormularioFiltro2();     
    this.inicializarFormularioRuc();
 

  }
  
  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({ 
      idCentroCostro : new FormControl('0'),
      idTipoResultado : new FormControl('1'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      porcEvaluacion : new FormControl('')
     }) 
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
    combineLatest([ this.registroFacturasService.get_estado_evaluacion(), this.registerService.get_centroCosto(   this.idUserGlobal),this.registerService.get_tipoResultado(this.idUserGlobal) ])
     .subscribe(([ _estados, _centroCostro, _tipoResultado ]) =>{
        this.spinner.hide(); 
          this.estados = _estados;        
          this.centroCostro =_centroCostro;
          this.tipoResultado = _tipoResultado;
      })
  }

  
  mostrarInformacion_preliminar(){

    if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
      return 
    } 
    if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
      return 
    } 

    if (this.formParamsFiltro.value.idTipoResultado == '0' || this.formParamsFiltro.value.idTipoResultado == 0 ) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Resultado..');
      return 
    } 
  
    const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
    const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);

    this.spinner.show();
    this.registerService.get_informacion_evaluacionProveedores( this.formParamsFiltro.value.idCentroCostro,  this.formParamsFiltro.value.idTipoResultado,  fechaIni, fechaFin, this.formParamsFiltro.value.porcEvaluacion , this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok) { 
        this.proveedoresCab = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  marcarTodos(){
    if (this.proveedoresCab.length<=0) {
      return;
    }
    for (const obj of this.proveedoresCab) {
      if (this.checkeadoAll) {
        obj.checkeado = false;
      }else{
        obj.checkeado = true;
      }
    }
  }

  getColorEstado(flagColorear:string){ 

    switch (flagColorear) {
      case '0':
        return 'white';
      case '1':
        return 'orange'; 
    } 
   }
 
   generarEvaluacion(){
    let flagMarcado = false;

    this.idEstadoCab_Global = '215'
    flagMarcado = this.funcionGlobalServices.verificarCheck_marcado(this.proveedoresCab);

    if (flagMarcado == false) {
      this.alertasService.Swal_alert('error','Por favor debe marcar un elemento de la Tabla');
      return ;
    } 
    
    // if (this.formParamsFiltro.value.idCentroCostro == '0' || this.formParamsFiltro.value.idCentroCostro == 0 ) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un centro de costo');
    //   return 
    // } 

    // if (this.formParamsFiltro.value.idTipoResultado == '0' || this.formParamsFiltro.value.idTipoResultado == 0 ) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un tipo de resultado');
    //   return 
    // } 


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


    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Generar la Evaluacion ?')
    .then((result)=>{
      if(result.value){
        const codigos = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.proveedoresCab,'idProveedor');

        Swal.fire({ icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Generando al evaluacion, espere por favor' })
        Swal.showLoading();
        this.registerService.set_generarEvaluacionProveedor( this.formParamsFiltro.value.idCentroCostro,  this.formParamsFiltro.value.idTipoResultado,  fechaIni, fechaFin, codigos.join()  , this.idUserGlobal
         ).subscribe((res :RespuestaServer)=>{    
          Swal.close(); 
 
           if (res.ok) {
            this.idEvaluacionCab_Global = Number(res.data);
            this.idEstadoCab_Global = '215'
            this.alertasService.Swal_Success("Generacion de Evaluacion realizada correctamente..");

            this.obtenerDatosEvaluacionCabDet( this.idEvaluacionCab_Global,'N');
          }else{
            Swal.close(); 
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }  
        },((error)=>{
          Swal.close(); 
          this.alertasService.Swal_alert('error', JSON.stringify(error));
          alert(JSON.stringify(error));
        }))
         
      }
    })
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

  guardarNuevoProveedor(){

    if (this.formParamsRuc.value.nro_RUC == '' || this.formParamsRuc.value.nro_RUC == null ) {
      this.alertasService.Swal_alert('error', 'Por favor ingrese el nro de Ruc ..');
      return;
    }

    if (!this.formParamsRuc.value.id_Proveedor) {
      return;
    }

    if (this.formParamsRuc.value.id_Proveedor == '0' || this.formParamsRuc.value.id_Proveedor == '' || this.formParamsRuc.value.id_Proveedor == null) {
      return; 
    }

    if (this.verificarRucYacargado( this.formParamsRuc.value.nro_RUC ) ==true) {
      this.alertasService.Swal_alert('error', 'El nro Ruc ya se cargo, verifique ..');
      return;
    }

    const objEvaluacionDet = {
      id_Evaluacion_Cab : this.idEvaluacionCab_Global  ,  
      id_Proveedor : this.formParamsRuc.value.id_Proveedor ,
      usuario_creacion : this.idUserGlobal
    }

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();

    this.registroFacturasService.set_save_detalleEvaluacionProveedor(objEvaluacionDet).subscribe((res:RespuestaServer)=>{
      Swal.close();    
      if (res.ok ==true) {   

        this.alertasService.Swal_Success('Se agregó el proveedor correctamente..');
        this.inicializarFormularioRuc();

        for (const evaluaDet of res.data['evaluacionDet']) {
          this.evaluacionProveedorDet.push(evaluaDet);    
        }  
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })



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

 enviarAprobar(){

    if (this.evaluacionProveedorDet.length ==0) {
      this.alertasService.Swal_alert('error','Lo sentimos no hay detalle de la evaluacion..');
      return false;
    }
  
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de enviar a Aprobar ?')
    .then((result)=>{
      if(result.value){
  
        Swal.fire({
          icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Aprobando, Espere por favor'
        })
        this.registerService.set_enviarAprobarEvaluacionCab( this.idEvaluacionCab_Global,  this.idUserGlobal ).subscribe(
          (res:RespuestaServer) =>{
           Swal.close();
            if (res.ok==true) {     
              this.alertasService.Swal_Success('Enviar a Aprobar realizado correctamente..');
              this.cerrarModal_registro();      
              this.selectedTabControlDetalle = this.tabControlDetalle[1];
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

 editar_evaluacionCab({id_Evaluacion_Cab, idEstado}){

  this.idEvaluacionCab_Global = Number(id_Evaluacion_Cab);
  this.idEstadoCab_Global = idEstado;
  this.obtenerDatosEvaluacionCabDet( this.idEvaluacionCab_Global,'E');
   
 }

 anular_evaluacionCab(item:any){   

  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Anular la Evaluacion ?')
  .then((result)=>{
    if(result.value){
 
      Swal.fire({
        icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
      })
      Swal.showLoading();
      this.registerService.set_anularEvaluacionesCab(item.id_Evaluacion_Cab, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
        Swal.close();
        console.log(res);
        if (res.ok) { 
    
          this.alertasService.Swal_alert('success', 'El registro se anulo correctamente');
          
          for (const iterator of this.evaluacionesCab) {
            if (iterator.id_Evaluacion_Cab == item.id_Evaluacion_Cab) {
              iterator.idEstado = 218;
              iterator.descripcionEstado = 'Anulado';
            }          
          }
    
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
       
    }
  })
 }

 

 descargarEvaluacion({id_Evaluacion_Cab}){    
 
  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
  })
  Swal.showLoading();
  this.registerService.get_descargarEvaluacionProveedor(id_Evaluacion_Cab, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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

 
  // dragOver(e){ 
  //   e.preventDefault();
  // }
    
  // drop(e){
  //   e.preventDefault();

  //   const textoUsuario = $("#txtMensaje").val();

  //   this.selectionStart = $('#txtMensaje')[0].selectionStart;
  //   this.selectionEnd = $('#txtMensaje')[0].selectionEnd;
  //   this.scrollTop =  $("#txtMensaje").scrollTop();

  //   let textoDinamico = e.dataTransfer.getData("opcionDinamico");
    
  //   if ( (this.selectionStart)  || this.selectionStart == '0' ) { 
         
  //     var startPos = this.selectionStart;
  //     var endPos = this.selectionEnd;

  //     $("#txtMensaje").val(textoUsuario.substring(0, startPos) + textoDinamico + textoUsuario.substring(endPos, textoUsuario.length));
  //     $("#txtMensaje").focus();
  //   } else {
  //     $("#txtMensaje").val( textoUsuario + ' ' + textoDinamico);
  //     $("#txtMensaje").focus();
  //   }  
 
  // }

  // drag(e){
  //   e.dataTransfer.setData("opcionDinamico", e.target.id);
  // }

  // submit(){ 
  //   var input = $('txtMensaje').val();
  //   this.cursos.push(input);
  //   var data= this.cursos.join(" ,");
  //   if(input !=""){
  //     document.getElementById('result').innerHTML = data;
  //     $("#txtMensaje").val('');
  //     document.getElementById('btn_reset').style.display="inline";
  //   }else{
  //     alert("Please drag something first!");
  //   }
  // }

  // reset(){
  //   document.getElementById('result').innerHTML = "";
  //   document.getElementById('btn_reset').style.display="none";
  // }

  
 
  
 

}

