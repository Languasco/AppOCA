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
import { AprobarContabilidadService } from '../../../../services/Proveedor/Procesos/aprobar-contabilidad.service';
declare const $:any;

@Component({
  selector: 'app-aprobar-contabilidad',
  templateUrl: './aprobar-contabilidad.component.html',
  styleUrls: ['./aprobar-contabilidad.component.css']
})
 
export class AprobarContabilidadComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsContabilidad  : FormGroup;
  formParamsAgregar : FormGroup;

  idUserGlobal : string = '' ;
  filtrarCab  : string = '' ;
 
  centroCostro :any [] =[];
  estados :any [] =[];
  documentosCab :any [] =[];
  checkeadoAll = false;
  descripcionBoton = '1. Seleccionar Doc.';

  cuentaContableGastos:any[]= [];
  cuentaContableIGV:any[]= [];
  cuentaContablePagar:any[]= [];

  idFacturaCab_Global =0;

  
  detalleCuentaContables  :any[]=[];
  tipoCuentaContable = ''; 
  flagModo_EdicionDet = false;
  cuentaContableDetraccion :any[]=[];
  objFacturacionGlobal:any ={};

  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService, private aprobarContabilidadService : AprobarContabilidadService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormularioContabilidad();
   this.inicializarFormularioAgregar();
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
    id_Glosa : new FormControl('0'),
    id_Documento : new FormControl('0'),
    importeDocumento : new FormControl(''),
    Glosa : new FormControl(''),
    CtaGastos : new FormControl('0'),
    CtaIGV : new FormControl('0'),
    CtaDetraccion: new FormControl('0'),
    CtaxPagar : new FormControl('0'),
    Estado : new FormControl('1'),
    usuario_creacion : new FormControl(''),
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
  combineLatest([this.registerService.get_centroCosto(this.idUserGlobal), this.aprobarContabilidadService.get_estadosContabilidad() ,  this.registerService.get_cuentaContable_gastos(), this.registerService.get_cuentaContable_igv(), this.registerService.get_cuentaContable_pagar(), this.registerService.get_cuentaContable_detraccion() ])
   .subscribe(([ _centroCostro, _estados ,  _cuentaContableGastos, _cuentaContableIGV, _cuentaContablePagar, _cuentaContableDetraccion ]) =>{
      this.spinner.hide(); 
        this.centroCostro =_centroCostro;
        this.estados = _estados; 
        this.cuentaContableGastos = _cuentaContableGastos;
        this.cuentaContableIGV = _cuentaContableIGV;
        this.cuentaContablePagar = _cuentaContablePagar; 
        this.cuentaContableDetraccion = _cuentaContableDetraccion;
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
  this.checkeadoAll = false;

    this.spinner.show();
    this.aprobarContabilidadService.get_documentos_aprobarContabilidad(this.formParamsFiltro.value.idCentroCostro, fechaIni,fechaFin, this.formParamsFiltro.value.idEstado, this.idUserGlobal   )
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

  changeEstado(estado:any){ 
    if (estado == '0') {
      this.descripcionBoton = '1. Seleccionar Doc.';
    }
    if (estado == '1') {
      this.descripcionBoton = 'Quitar Seleccion Doc.';
    }
    this.mostrarInformacion();
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

  seleccionarDocumentos(){  

    if (this.validacionCheckMarcado()==false){
      return;
    } 

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de proceder ?')
    .then((result)=>{
      if(result.value){

        const codigosIdFact = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.documentosCab,'idDocumentoCab'); 
    
        this.spinner.show();
        this.aprobarContabilidadService.set_seleccionarDocumentos( codigosIdFact,  this.idUserGlobal, this.formParamsFiltro.value.idEstado   )
            .subscribe((res:RespuestaServer)=>{  
                this.spinner.hide();
                if (res.ok==true) {        
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


  descargarExcel_sisCont(){  

    if (this.validacionCheckMarcado()==false){
      return;
    } 

    const codigosIdFact = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.documentosCab,'idDocumentoCab'); 

    if (this.formParamsFiltro.value.idEstado == 1) { /// ---- cambio de estado + Excel

      this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Generar Excel SisCont ?')
      .then((result)=>{
        if(result.value){
  

          this.formParamsFiltro.patchValue({"idEstado": 2 });
      
          this.spinner.show();
          this.aprobarContabilidadService.set_seleccionarDocumentos( codigosIdFact,  this.idUserGlobal, this.formParamsFiltro.value.idEstado   )
              .subscribe((res:RespuestaServer)=>{  
                  this.spinner.hide();
                  if (res.ok==true) {
                    
                    ///----- generando el archivo excel ---
                    this.generarArchivo_excelSiscont(codigosIdFact)
                    
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
    if (this.formParamsFiltro.value.idEstado == 2) {  ////-- -solo Excel
       ///----- generando el archivo excel ---
       this.generarArchivo_excelSiscont(codigosIdFact)
    } 
  }

  generarArchivo_excelSiscont(id_Documentos :any){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.aprobarContabilidadService.get_generar_excelSisCont(id_Documentos, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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

  cerrarModal_cuentaContables(){
    setTimeout(()=>{ // 
      $('#modal_cuentasContables').modal('hide');  
    },0); 
  } 
    
  keyPress(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros(event); 
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
                  this.formParamsContabilidad.patchValue({  "importeDocumento" : (!this.objFacturacionGlobal.total) ? '0' : this.objFacturacionGlobal.total , 
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


  abrir_modalCuentasContables(obj:any){

    this.idFacturaCab_Global =  obj.idDocumentoCab;
    this.objFacturacionGlobal = obj; 
    console.log(  this.objFacturacionGlobal)

 
    if ( this.idFacturaCab_Global > 0) {
      this.mostrar_datosContables();
    }
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
  this.registroFacturasService.set_save_cuentaContable(this.formParamsAgregar.value.valorCuentaContable, this.tipoCuentaContable, this.idUserGlobal, this.formParamsAgregar.value.descripcionCuentaContable).subscribe((res:RespuestaServer)=>{
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

