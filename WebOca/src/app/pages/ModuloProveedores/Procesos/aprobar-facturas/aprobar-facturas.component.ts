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
 
declare const $:any;


@Component({
  selector: 'app-aprobar-facturas',
  templateUrl: './aprobar-facturas.component.html',
  styleUrls: ['./aprobar-facturas.component.css']
})
 
export class AprobarFacturasComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsContabilidad: FormGroup;
  formParamsCentroCosto: FormGroup;
  formParamsAgregar: FormGroup;

  idUserGlobal : string = '' ;
  flag_modoEdicion :boolean =false;

  documentosCab :any[]=[]; 
  formaPagos  :any[]=[]; 
  estados  :any[]=[]; 
  filtrarCab = "";
  objFacturacionGlobal:any ={};

  idFacturaCab_Global = 0;
  idEstado_Global = 0;

  checkeadoAll = false;
    //-TAB control
    tabControlDetalle: string[] = ['LISTA ITEMS','LISTA DOCUMENTOS ADJUNTOS', 'CUENTAS CONTABLES', 'DISTRIBUCION DE CENTRO DE COSTO']; 
    selectedTabControlDetalle :any;

  listaItems :any[]=[]; 
  listaDocumentos :any[]=[]; 
  facturaCancelada = false;
 
  cuentaContableGastos:any[]= [];
  cuentaContableIGV:any[]= [];
  cuentaContablePagar:any[]= [];
  cuentaContableDetraccion:any[]= [];
  centroCostos:any[]= [];
  centroCostro:any[]= [];

  flagCuentaContable= false;
  detalleCuentaContables  :any[]=[]; 
  flagModo_EdicionDet = false;

  detalleCentroCosto  :any[]=[]; 
  flagModo_EdicionDet_CC = false;
  tipoCuentaContable = '';
 
  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0]; 
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormularioContabilidad();
   this.inicializarFormularioCentroCosto();
   this.inicializarFormularioAgregar();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      nroFactura : new FormControl(''),
      nroOC : new FormControl(''),
      Proveedor : new FormControl(''),
      idFormaPago : new FormControl('0'),
      idEstado : new FormControl('0'),
      idCentroCostro: new FormControl('0'),
     }) 
 }  

 inicializarFormularioContabilidad(){ 
  this.formParamsContabilidad= new FormGroup({
    id_Glosa : new FormControl('0'),
    id_Documento : new FormControl('0'),
    importeDocumento : new FormControl(''),
    Glosa : new FormControl(''),
    CtaGastos : new FormControl('0'),
    CtaIGV : new FormControl('0'),
    CtaxPagar : new FormControl('0'),
    CtaDetraccion: new FormControl('0'),
    Estado : new FormControl('1'),
    usuario_creacion : new FormControl(''),
   }) 
 }  

 inicializarFormularioCentroCosto(){ 
  this.formParamsCentroCosto= new FormGroup({
    id_documento_cc : new FormControl('0'),
    id_documento : new FormControl('0'),
    idCentroCosto : new FormControl('0'),
    total_importe : new FormControl('0'),
    porcentaje : new FormControl('0'),
    total : new FormControl('0'),
    estado : new FormControl('1'),
    usuario_creacion : new FormControl('0'),
 
   }) 
 }  

 inicializarFormularioAgregar(){ 
  this.formParamsAgregar= new FormGroup({
    valorCuentaContable : new FormControl(''), 
    descripcionCuentaContable : new FormControl(''), 
   }) 
 }

 getCargarCombos(){ 
  this.spinner.show(); 
  combineLatest([this.registerService.get_formaPagos() , this.registerService.get_estadosAprobarFacturas(), this.registerService.get_cuentaContable_gastos(), this.registerService.get_cuentaContable_igv(), this.registerService.get_cuentaContable_pagar() ,this.registerService.get_cuentaContable_detraccion(), this.registerService.get_centroCostoDistribucion(this.idUserGlobal),this.registerService.get_centroCosto(this.idUserGlobal)    ])
   .subscribe(([ _formaPagos, _estados, _cuentaContableGastos, _cuentaContableIGV, _cuentaContablePagar, _cuentaContableDetraccion, _centroCostos, _centroCostro ]) =>{
      this.spinner.hide(); 
        this.formaPagos = _formaPagos;
        this.estados = _estados;
        this.cuentaContableGastos = _cuentaContableGastos;
        this.cuentaContableIGV = _cuentaContableIGV;
        this.cuentaContablePagar = _cuentaContablePagar; 
        this.cuentaContableDetraccion = _cuentaContableDetraccion;
        this.centroCostos = _centroCostos;
        this.centroCostro =_centroCostro;
    })
}

 mostrarInformacion(){ 

  if (this.formParamsFiltro.value.idEstado == '0' || this.formParamsFiltro.value.idEstado == 0 ) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Estado..');
    return 
  } 
  
    this.spinner.show();
    this.checkeadoAll = false;
    this.registroFacturasService.get_aprobacionFacturasCab( this.formParamsFiltro.value, this.idUserGlobal   )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.documentosCab = res.data; 
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

   verFactura(obj:any){

      this.flag_modoEdicion = false;
      this.idFacturaCab_Global =  obj.idFacturaCab;
      this.idEstado_Global = obj.idEstado;
      
      if ( this.idFacturaCab_Global > 0) {
        this.selectedTabControlDetalle = this.tabControlDetalle[0]; 
        this.obtenerDetalleFacturacion();
        this.mostrarListaItems();
        this.mostrarListaDocumentosAdjuntos();
        this.mostrar_datosContables();
        this.mostrar_detallesDistribucion_centroCosto();
      }
   } 

 
   marcarTodos(){
    if (this.documentosCab.length<=0) {
      return;
    }
    for (const obj of this.documentosCab) {
      if (this.checkeadoAll) {
        obj.checkeado = false;
      }else{
        obj.checkeado = true;
      }
    }
  }

  validacionCheckMarcado(){    
      let CheckMarcado = false;
      CheckMarcado = this.funcionGlobalServices.verificarCheck_marcado(this.documentosCab);
    
      if (CheckMarcado ==false) {
        this.alertasService.Swal_alert('error','Por favor debe marcar un elemento de la Tabla');
        return false;
      }else{
        return true;
      }
  }

  aprobarMasivo(){

    if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
      return 
    }

    if (this.validacionCheckMarcado()==false){
      return;
    } 
    const codigosIdFact = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.documentosCab,'idFacturaCab'); 
 
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de aprobar los registros marcados. ?')
    .then((result)=>{
      if(result.value){
 
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.registroFacturasService.get_aprobacionFacturas_masivo(codigosIdFact.join() , this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) {               
            //-----listando la informacion  
            this.mostrarInformacion();  
            this.alertasService.Swal_Success('Proceso de Aprobación realizado correctamente..');   
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
         
      }
    }) 

  }

  obtenerDetalleFacturacion(){     
    this.spinner.show();
    this.registroFacturasService.get_detalleFacturaCab( this.idFacturaCab_Global )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        

              if (res.data.length > 0) {
                this.objFacturacionGlobal = res.data[0]; 
                this.facturaCancelada =  (this.objFacturacionGlobal.facturaCancelada == 0) ? false :true   ;
                setTimeout(()=>{ // 
                    $('#modal_aprobacion').modal('show');           
                },0); 

              }else{
                this.alertasService.Swal_alert('error','No hay informacion para mostrar con el ID');
                this.objFacturacionGlobal ={};
              }

            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }  

 aprobarDevolver(opcionProceso: number){

  if (this.idFacturaCab_Global == 0) {
    this.alertasService.Swal_alert('error','No se cargo el ID del documento actualice su pagina por favor');
    return 
  } 

  // if (this.detalleCuentaContables.length == 0) {
  //   this.alertasService.Swal_alert('error','Para Aprobar una Factura se debe primero registrar las Cuentas Contables.');
  //   return 
  // }
 
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
      this.registroFacturasService.get_aprobarDevolverFactura( this.idFacturaCab_Global , opcionProceso , this.idUserGlobal ,  (this.facturaCancelada == true ) ? 1 : 0   ).subscribe((res:RespuestaServer)=>{
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

 mostrarListaItems(){ 
  this.spinner.show();
  this.checkeadoAll = false;
  this.registroFacturasService.get_listadoItems( this.idFacturaCab_Global , this.idUserGlobal   )
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {        
              this.listaItems = res.data; 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 }   

 mostrarListaDocumentosAdjuntos(){ 
  this.spinner.show();
  this.checkeadoAll = false;
  this.registroFacturasService.get_listadoDocumentosAdjuntos( this.idFacturaCab_Global , this.idUserGlobal   )
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {        
              this.listaDocumentos = res.data; 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 } 

   
 descargarArchivo(id_Documento_Archivo:number){    
  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
  })
  Swal.showLoading();
  this.registroFacturasService.get_descargarFileAdicionales(id_Documento_Archivo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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

 almacenarCuentasContables(){     

  // if (this.formParamsContabilidad.value.id_Glosa == 0 ) {
  //   this.alertasService.Swal_alert('error','No se cargo el ID del documento actualice su pagina por favor');
  //   return 
  // }

  if (this.idFacturaCab_Global == 0) {
    this.alertasService.Swal_alert('error','No se cargo el ID del documento actualice su pagina por favor');
    return 
  }

  if (this.formParamsContabilidad.value.importeDocumento == '' || this.formParamsContabilidad.value.importeDocumento == null || this.formParamsContabilidad.value.importeDocumento == undefined ) {
    this.alertasService.Swal_alert('error','Por favor ingrese el importe del documento..');
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


  if (this.objFacturacionGlobal.moneda.toUpperCase() == 'SOLES') {
    if (this.formParamsContabilidad.value.CtaxPagar != 27 ) {
      this.alertasService.Swal_alert('error','La Cuenta Contable de Pago no corresponde a la moneda, verifique por favor.');
      return 
    }
  }
 
  this.formParamsContabilidad.patchValue({ "id_Documento" : Number(this.idFacturaCab_Global)  , "usuario_creacion" : this.idUserGlobal  });
  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
  })
  Swal.showLoading();
  this.registroFacturasService.set_saveUpdate_cuentasContables(this.formParamsContabilidad.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
    Swal.close();
 
    if (res.ok) { 
      this.mostrarInformacion();  
      this.mostrar_datosContables();
      this.alertasService.Swal_Success('Proceso realizado correctamente..');   
 
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })
 }

   
  keyPress(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros(event); 
  }

  blank_DetalleCuentasContables(){
    this.flagModo_EdicionDet= false;
    this.inicializarFormularioContabilidad();
   }


  mostrar_datosContables(){
    if (this.idFacturaCab_Global == 0) {
      this.alertasService.Swal_alert('error','No se cargo el ID del documento actualice su pagina por favor');
      return 
    }

    this.spinner.show();
    this.checkeadoAll = false;
 
    this.registroFacturasService.get_datosContables( this.idFacturaCab_Global , this.idUserGlobal   )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide(); 
            if (res.ok==true) {    

              this.detalleCuentaContables =  res.data;
              this.blank_DetalleCuentasContables()    
              
              if (res.data.length == 0) {
                this.flagCuentaContable = false;
                setTimeout(()=>{  
                  this.formParamsContabilidad.patchValue({  "importeDocumento" : (!this.objFacturacionGlobal.subTotalFactura) ? '0' : this.objFacturacionGlobal.subTotalFactura , 
                                                            "CtaIGV" : '25',
                                                            "CtaxPagar" : (this.objFacturacionGlobal.moneda.toUpperCase() == 'SOLES') ? '27' : '26'    }); 
                },1000);   
              }
            }else{
              this.flagCuentaContable = false;
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

  modificarRegistroCuentaContable({id_Glosa, id_Documento, importeDocumento, Glosa, CtaGastos, CtaIGV, CtaxPagar, CtaDetraccion }){    

    this.formParamsContabilidad.patchValue({ "id_Glosa" : Number(id_Glosa),  "id_Documento" : Number(this.idFacturaCab_Global), "importeDocumento" : importeDocumento ,"Glosa" : Glosa ,"CtaGastos" : CtaGastos, "CtaIGV" : CtaIGV , "CtaxPagar" : CtaxPagar , "CtaDetraccion" : CtaDetraccion });   

    this.flagModo_EdicionDet= true;
  }


  
  blank_DetalleDistribucionCCentro(){
    this.flagModo_EdicionDet_CC= false;
    this.inicializarFormularioCentroCosto();
   }

  mostrar_detallesDistribucion_centroCosto(){
    if (this.idFacturaCab_Global == 0) {
      this.alertasService.Swal_alert('error','No se cargo el ID del documento actualice su pagina por favor');
      return 
    }

    this.spinner.show();
    this.checkeadoAll = false;
 
    this.registroFacturasService.get_detalleDistribucion_CCosto( this.idFacturaCab_Global , this.idUserGlobal   )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide(); 
            if (res.ok==true) {    
              this.detalleCentroCosto =  res.data;
              this.blank_DetalleDistribucionCCentro();                 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }
  
  almacenarDistribucion_centroCosto(){     
    if (this.idFacturaCab_Global == 0) {
      this.alertasService.Swal_alert('error','No se cargo el ID del documento actualice su pagina por favor');
      return 
    }
    if (this.formParamsCentroCosto.value.idCentroCosto == '0' || this.formParamsCentroCosto.value.idCentroCosto == 0 || this.formParamsCentroCosto.value.idCentroCosto == undefined ) {
      this.alertasService.Swal_alert('error','Por favor seleccione el centro de costo..');
      return 
    }
  
    if (this.formParamsCentroCosto.value.porcentaje == '' || this.formParamsCentroCosto.value.porcentaje == null || this.formParamsCentroCosto.value.porcentaje == undefined || this.formParamsCentroCosto.value.porcentaje == '0' ) {
      this.alertasService.Swal_alert('error','Por favor ingrese el porcentaje de Distribucion');
      return 
    }
  
    if ( Number(this.formParamsCentroCosto.value.porcentaje) > 100 ) {
      this.alertasService.Swal_alert('error','El porcentaje maximo es 100 %');
      return 
    }

    let porc= Number(this.formParamsCentroCosto.value.porcentaje);
    let sumPorc =0;
    
    if ( this.flagModo_EdicionDet_CC == false) { /// nuevo registro ..

      sumPorc =0;
      this.detalleCentroCosto.forEach( (centroCosto)=>{
        sumPorc += (!centroCosto.porcentaje)? 0: Number(centroCosto.porcentaje);
      })      

    }else{  //--- edicion

      const idDistribucion = this.formParamsCentroCosto.value.id_documento_cc;

      sumPorc =0;
      this.detalleCentroCosto.forEach( (centroCosto)=>{
         if (centroCosto.id_documento_cc != idDistribucion) {
          sumPorc += (!centroCosto.porcentaje)? 0: Number(centroCosto.porcentaje);
         }
      })
    }

    const porcAcumulado = (porc + sumPorc); 
  
    if ( porcAcumulado > 100  ) {
      this.alertasService.Swal_alert('error','El porcentaje Acumulado máximo es  100 %, verifique la sumatoria lo que ya agregó ');
      return;
    } 
 
    if (this.formParamsCentroCosto.value.total_importe == '' || this.formParamsCentroCosto.value.total_importe == null || this.formParamsCentroCosto.value.total_importe == undefined ) {
      this.alertasService.Swal_alert('error','Por favor ingrese el importe ..');
      return 
    }
   
    
    this.formParamsCentroCosto.patchValue({ "id_documento" : Number(this.idFacturaCab_Global) , "usuario_creacion" : this.idUserGlobal  });
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.set_saveUpdate_distribucionCentroCosto(this.formParamsCentroCosto.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
   
      if (res.ok) { 
        this.mostrarInformacion();  
        this.mostrar_detallesDistribucion_centroCosto();
        this.alertasService.Swal_Success('Proceso realizado correctamente..');   
 
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  modificarRegistro_distribucion_CCosto({id_documento_cc, id_documento, idCentroCosto, total_importe, porcentaje, total, estado }){    

    this.formParamsCentroCosto.patchValue({ "id_documento_cc" : Number(id_documento_cc),  "id_Documento" : Number(this.idFacturaCab_Global), "idCentroCosto" : idCentroCosto ,"total_importe" : total_importe ,"porcentaje" : porcentaje});   

    this.flagModo_EdicionDet_CC= true;
  }

  keyPress2(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros_sinPunto(event);
  }

  abrir_modalAgregarCuentaContable(nombreCuentaContable:string){

    this.tipoCuentaContable = nombreCuentaContable;
    this.inicializarFormularioAgregar();
    setTimeout(()=>{ // 
      $('#modal_agregar').modal('show');
    },0);
  }

   verificarCuentaContable_registrada(valorCuentaContable: number, tipoCuentaContable:string ){  
    var flagRepetida=false;

    if (tipoCuentaContable == 'GASTOS') {
      for (const obj of this.cuentaContableGastos) {
        if (  obj.descripcionCuenta == valorCuentaContable ) {
             flagRepetida = true;
             break;
        }
      }
    }

    if (tipoCuentaContable == 'IGV') {
      for (const obj of this.cuentaContableIGV) {
        if (  obj.codigo_detalleTabla == valorCuentaContable ) {
             flagRepetida = true;
             break;
        }
      }
    }

    if (tipoCuentaContable == 'PAGAR') {
      for (const obj of this.cuentaContablePagar) {
        if (  obj.codigo_detalleTabla == valorCuentaContable ) {
             flagRepetida = true;
             break;
        }
      }
    }

    if (tipoCuentaContable == 'DETRACCION') {
      for (const obj of this.cuentaContableDetraccion) {
        if (  obj.codigo_detalleTabla == valorCuentaContable ) {
             flagRepetida = true;
             break;
        }
      }
    }



    return flagRepetida;
  }

  guardarCuentaContable(){

    if (this.formParamsAgregar.value.valorCuentaContable == '' || this.formParamsAgregar.value.valorCuentaContable == null || this.formParamsAgregar.value.valorCuentaContable == undefined ) {
      this.alertasService.Swal_alert('error','Por favor ingrese el valor de la cuenta ..');
      return 
    }
    if (this.formParamsAgregar.value.descripcionCuentaContable == '' || this.formParamsAgregar.value.descripcionCuentaContable == null || this.formParamsAgregar.value.descripcionCuentaContable == undefined ) {
      this.alertasService.Swal_alert('error','Por favor ingrese la descripcion de la Cuenta Corriente ..');
      return 
    }

    if (this.verificarCuentaContable_registrada( this.formParamsAgregar.value.valorCuentaContable, this.tipoCuentaContable ) ==true) {
      this.alertasService.Swal_alert('error', 'La cuenta contable  ya se cargo, verifique ..');
      return;
    } 
 
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.set_save_cuentaContable(this.formParamsAgregar.value.valorCuentaContable, this.tipoCuentaContable, this.idUserGlobal,this.formParamsAgregar.value.descripcionCuentaContable ).subscribe((res:RespuestaServer)=>{
      Swal.close();
   
      this.inicializarFormularioAgregar();
      if (res.ok) { 
        this.alertasService.Swal_Success('Cuenta Contable agreagada correctamente..');  
 
          if (this.tipoCuentaContable == 'GASTOS') {
             this.registerService.get_cuentaContable_gastos(true).subscribe((res)=>{
              this.cuentaContableGastos = res;
            });
          }
          if (this.tipoCuentaContable == 'IGV') {
            this.registerService.get_cuentaContable_igv(true).subscribe((res)=>{
              this.cuentaContableIGV = res;
            });
          }
          if (this.tipoCuentaContable == 'PAGAR') {
            this.registerService.get_cuentaContable_pagar(true).subscribe((res)=>{
              this.cuentaContablePagar = res;
            });
          }
          if (this.tipoCuentaContable == 'DETRACCION') {
            this.registerService.get_cuentaContable_detraccion(true).subscribe((res)=>{
              this.cuentaContableDetraccion = res;
            });
          }        

        this.cerrarModal_agregarCuentaContable() ;
        
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })

  }
   
  cerrarModal_agregarCuentaContable(){
    setTimeout(()=>{ // 
      $('#modal_agregar').modal('hide');  
    },0); 
 }

 onBlurPorcentaje(){
   if (Number(this.formParamsCentroCosto.value.porcentaje) > 100) {
      this.alertasService.Swal_alert('error','El porcentaje máximo es 100 %');
      this.formParamsCentroCosto.patchValue({ "total_importe" : 0  });
      return;
   }

   const subtotal = this.objFacturacionGlobal.subTotalFactura;
   const totalImporte = (subtotal * Number(this.formParamsCentroCosto.value.porcentaje) / 100)


   this.formParamsCentroCosto.patchValue({ "total_importe" : totalImporte  });       

 }
 

  eliminarRegistroCuentaContable(item:any){  
    Swal.fire({
      icon: 'info', allowOutsideClick: false,allowEscapeKey: false, text: 'Eliminando, Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.set_eliminarRegistroCuentaContable(item.id_Glosa , this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
          var index = this.detalleCuentaContables.indexOf( item );
          this.detalleCuentaContables.splice( index, 1 );
          this.blank_DetalleCuentasContables();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }




}
