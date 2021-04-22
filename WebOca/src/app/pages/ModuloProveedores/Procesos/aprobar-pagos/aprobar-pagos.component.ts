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
import { AprobarPagosService } from '../../../../services/Proveedor/Procesos/aprobar-pagos.service';
declare const $:any;


@Component({
  selector: 'app-aprobar-pagos',
  templateUrl: './aprobar-pagos.component.html',
  styleUrls: ['./aprobar-pagos.component.css']
})
 

export class AprobarPagosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsContabilidad  : FormGroup;
  formParamsAgregar : FormGroup;

  idUserGlobal : string = '' ;
  flag_modoEdicion :boolean =false;

  documentosCab :any[]=[]; 
  estados  :any[]=[]; 
  documentosIdentidades :any [] =[];
  tiposDocumentos :any [] =[];
  monedas :any [] =[];
  docVencidos :any [] =[];
 

  filtrarCab = "";
  objFacturacionGlobal:any ={};

  idFacturaCab_Global = 0;

  checkeadoAll = false;
    //-TAB control
    tabControlDetalle: string[] = ['LISTA ITEMS','LISTA DOCUMENTOS ADJUNTOS',]; 
    selectedTabControlDetalle :any;

  listaItems :any[]=[]; 
  listaDocumentos :any[]=[]; 

  cuentaContableGastos:any[]= [];
  cuentaContableIGV:any[]= [];
  cuentaContablePagar:any[]= [];
  cuentaContableDetraccion:any[]= [];

  centroCostro  :any[]=[]; 
  descripcionBoton = '';
  estadoGlobal = 0;

  detalleCuentaContables  :any[]=[];
  tipoCuentaContable = ''; 
  flagModo_EdicionDet = false;
 
 
  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private aprobarPagosService : AprobarPagosService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0]; 
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormularioContabilidad();
   this.inicializarFormularioAgregar();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      docIdentidad : new FormControl('0'),
      tipoDocumento : new FormControl('0'),
      centroCosto : new FormControl('0'),
      moneda : new FormControl('0'),
      facturaCancelada : new FormControl(true),
      Estado : new FormControl('0'), 
      docVencido : new FormControl(false), 
      fechaCorte : new FormControl(new Date()), 
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

 inicializarFormularioAgregar(){ 
  this.formParamsAgregar= new FormGroup({
    valorCuentaContable : new FormControl(''), 
   }) 
 }

 getCargarCombos(){ 
  this.spinner.show(); 

  combineLatest([  this.registerService.get_centroCosto(this.idUserGlobal)  , this.aprobarPagosService.get_documentoIDentidad(), this.aprobarPagosService.get_tipoDocumento(), this.aprobarPagosService.get_moneda(), this.aprobarPagosService.get_estado(),   ])
   .subscribe(([_centroCostro, _documentosIdentidades, _tiposDocumentos,_monedas, _estados,  ]) =>{
        this.spinner.hide();   
        this.centroCostro =_centroCostro;
        this.documentosIdentidades = _documentosIdentidades;
        this.tiposDocumentos = _tiposDocumentos;
        this.monedas = _monedas; 
        this.estados = _estados; 
    })


    combineLatest([ this.registerService.get_cuentaContable_gastos(), this.registerService.get_cuentaContable_igv(), this.registerService.get_cuentaContable_pagar() ,this.registerService.get_documentosVencidos(), this.registerService.get_cuentaContable_detraccion()   ])
    .subscribe(([   _cuentaContableGastos, _cuentaContableIGV, _cuentaContablePagar, _docVencidos,_cuentaContableDetraccion ]) =>{
        this.cuentaContableGastos = _cuentaContableGastos;
        this.cuentaContableIGV = _cuentaContableIGV;
        this.cuentaContablePagar = _cuentaContablePagar;  
        this.docVencidos = _docVencidos;
        this.cuentaContableDetraccion = _cuentaContableDetraccion;
 
     })
}

   mostrarInformacion(){ 

      if (this.formParamsFiltro.value.fechaCorte == '' || this.formParamsFiltro.value.fechaCorte == 0 || this.formParamsFiltro.value.fechaCorte == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione o ingrese la Fecha de Corte');
        return 
      }

      
   const fechaCorte = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fechaCorte);

      this.spinner.show();
      this.checkeadoAll = false;
      this.aprobarPagosService.get_mostrarAprobacionPagos( this.formParamsFiltro.value, this.idUserGlobal , fechaCorte  )
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
    const codigosIdFact = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.documentosCab,'idDocumentoCab'); 
 
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de aprobar los registros marcados. ?')
    .then((result)=>{
      if(result.value){
 
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.aprobarPagosService.set_grabar_aprobacionPagosMasivos(codigosIdFact, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
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

 

   abrir_modalCuentasContables(obj:any){

    this.idFacturaCab_Global =  obj.idDocumentoCab;
    this.objFacturacionGlobal = obj; 

    console.log(  this.objFacturacionGlobal)

    if ( this.idFacturaCab_Global > 0) {
      this.mostrar_datosContables();
    }
    
  } 

  cerrarModal_cuentaContables(){
    setTimeout(()=>{ // 
      $('#modal_cuentasContables').modal('hide');  
    },0); 
  } 
    
  keyPress(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros(event); 
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

              setTimeout(()=>{ // 
                 $('#modal_cuentasContables').modal('show');           
              },0); 
              
              if (res.data.length == 0) {
                setTimeout(()=>{  
                  this.formParamsContabilidad.patchValue({  "importeDocumento" : (!this.objFacturacionGlobal.totalPagar) ? '0' : this.objFacturacionGlobal.totalPagar , 
                                                            "CtaIGV" : '25',
                                                            "CtaxPagar" : (this.objFacturacionGlobal.moneda.toUpperCase() == 'SOLES') ? '27' : '26'    }); 
                },1000);   
              }
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

 
  almacenarCuentasContables(){    

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
 
  actualizandoFlag_pago(opcion:number){  
    if (this.validacionCheckMarcado()==false){
      return;
    } 

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro, de realizar la accion ?')
    .then((result)=>{
      if(result.value){

        if (opcion==4) {

          this.estadoGlobal = this.formParamsFiltro.value.Estado;
          this.formParamsFiltro.patchValue({"Estado": -1 });   
        }

        const codigosIdFact = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.documentosCab,'idDocumentoCab'); 
        this.spinner.show();
        this.aprobarPagosService.set_actualizando_flagPagos( codigosIdFact,  this.idUserGlobal, this.formParamsFiltro.value.Estado   )
            .subscribe((res:RespuestaServer)=>{  
                this.spinner.hide();
                if (res.ok==true) {     
                  this.formParamsFiltro.patchValue({"Estado": this.estadoGlobal });     
                  this.mostrarInformacion();  
                  this.alertasService.Swal_Success('Proceso realizado correctamente..');   
                }else{
                  this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                  alert(JSON.stringify(res.data));
                }
        })
         
      }
    }) 
  }

  changeEstado(estado:any){ 
    this.mostrarInformacion();
  }


  exportar_detalleMacro(){

    if (this.validacionCheckMarcado()==false){
      return;
    } 
    if (this.formParamsFiltro.value.Estado == 2) {

      this.alertasService.Swal_Question('Sistemas', 'Esta seguro, de realizar la accion ?')
      .then((result)=>{
        if(result.value){
  
          const codigosIdFact = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.documentosCab,'idDocumentoCab');  
  
          this.spinner.show();
          this.aprobarPagosService.set_actualizando_flagPagos( codigosIdFact,  this.idUserGlobal, this.formParamsFiltro.value.Estado   )
              .subscribe((res:RespuestaServer)=>{  
                  this.spinner.hide();
                  if (res.ok==true) {        
                    this.descargarDetalle_macro();
                    this.mostrarInformacion();  
                    this.alertasService.Swal_Success('Proceso realizado correctamente..');   
                  }else{
                    this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                    alert(JSON.stringify(res.data));
                  }
          })
           
        }
      }) 
    }
    if (this.formParamsFiltro.value.Estado == 3) {  ////-- -solo Excel
      this.descargarDetalle_macro();
    }
  }

  descargarDetalle_macro(){    
      Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.aprobarPagosService.get_descargarDetalleMacro(  this.formParamsFiltro.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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
  
  descargarDetalle_grilla(){     
    Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
  })
  Swal.showLoading();
  this.aprobarPagosService.get_descargarDetalle_aprobarPagos(  this.formParamsFiltro.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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

  abrir_modalAgregarCuentaContable(nombreCuentaContable:string){
  
    this.tipoCuentaContable = nombreCuentaContable;
    this.inicializarFormularioAgregar();
    setTimeout(()=>{ // 
      $('#modal_agregar').modal('show');
    },0);
  }

  
  blank_DetalleCuentasContables(){
    this.flagModo_EdicionDet= false;
    this.inicializarFormularioContabilidad();
  }

  modificarRegistroCuentaContable({id_Glosa, id_Documento, importeDocumento, Glosa, CtaGastos, CtaIGV, CtaxPagar, CtaDetraccion }){    

    this.formParamsContabilidad.patchValue({ "id_Glosa" : Number(id_Glosa),  "id_Documento" : Number(this.idFacturaCab_Global), "importeDocumento" : importeDocumento ,"Glosa" : Glosa ,"CtaGastos" : CtaGastos, "CtaIGV" : CtaIGV , "CtaxPagar" : CtaxPagar , "CtaDetraccion" : CtaDetraccion });   

    this.flagModo_EdicionDet= true;
  }

  cerrarModal_agregarCuentaContable(){
    setTimeout(()=>{ // 
      $('#modal_agregar').modal('hide');  
    },0); 
 }

   keyPress2(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros_sinPunto(event);
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
  
    if (this.verificarCuentaContable_registrada( this.formParamsAgregar.value.valorCuentaContable, this.tipoCuentaContable ) ==true) {
      this.alertasService.Swal_alert('error', 'La cuenta contable  ya se cargo, verifique ..');
      return;
    } 

 
  
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.registroFacturasService.set_save_cuentaContable(this.formParamsAgregar.value.valorCuentaContable, this.tipoCuentaContable, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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
  


  

}

