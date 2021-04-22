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
import { InputFileI } from '../.././../../models/inputFile.models';
import { RegistroFacturasService } from '../../../../services/Proveedor/Procesos/registro-facturas.service';
import { jsPDF } from "jspdf";

declare const $:any;

@Component({
  selector: 'app-bandeja-proveedores',
  templateUrl: './bandeja-proveedores.component.html',
  styleUrls: ['./bandeja-proveedores.component.css']
})
 
export class BandejaProveedoresComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams : FormGroup;
  formParamsBanco : FormGroup;
  formParamsFiles : FormGroup;
  formParamsAprobar : FormGroup;

  tabControlDetalle: string[] = ['DATOS GENERALES','CHECK LIST DE DOCUMENTOS']; 
  // tabControlDetalle: string[] = ['DATOS GENERALES' ]; 
  selectedTabControlDetalle :any;
  idUserGlobal = '';
  flag_modoEdicion =false;
  flagModo_EdicionBanco =false;

      //---volver cero ----
  idProveedor_Global = 0;
  idEstado_Global = 0;

  estados :any[]= [];
  paises :any[]= [];
  ciudades :any[]= [];
  departamentos :any[]= [];
  tipoDocumentos:any[]= [];

  bancos:any[]= [];
  monedas:any[]= [];
  tipoArchivos:any[]= [];

  detalleBancos:any[]= [];

  detalleProveedorArchivos :any[] =[]  
  filesProveedor:InputFileI[] = [];

  filtrarCab ="";
  proveedoresNuevosCab :any[] =[]  
 

  constructor(private router:Router, private spinner: NgxSpinnerService,
    private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService :RegistroFacturasService) { 
      this.idUserGlobal = this.loginService.get_idUsuario();
      this.flag_modoEdicion = true;
    }

  ngOnInit(): void {
    this.cargarCombos(); 
    this.inicializarFormularioFiltro();
    this.inicializarFormulario();
    this.inicializarFormulario_Banco();
    this.inicializarFormulario_Archivos(); 
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
    this.inicializarFormularioAprobar();
  }

  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({ 
      nroObra : new FormControl(''), 
      idCentroCostro : new FormControl('0'), 
      idEstado : new FormControl('0')
     }) 
  }

  inicializarFormularioAprobar(){ 
    this.formParamsAprobar = new FormGroup({ 
      motivo : new FormControl(''), 
     }) 
  }


  inicializarFormulario(){ 
    this.formParams= new FormGroup({
      xxxxx : new FormControl(''), 

      id_Proveedor : new FormControl(''), 
      id_TipoProveedor : new FormControl('1'), 
      id_TipoPersona : new FormControl(''), 
      nro_RUC : new FormControl(''), 
      razonsocial : new FormControl(''), 
      nombreComercial : new FormControl(''), 

      vtaProductos : new FormControl(false), 
      vtaServicios : new FormControl(false), 
      vtaotros : new FormControl(false), 
      vtaotrosDetalle : new FormControl(''), 

      direcion : new FormControl(''), 
      id_Pais : new FormControl('0'), 
      id_Ciudad : new FormControl('0'), 
      id_Departamento : new FormControl('0'), 
      telefonoFijo : new FormControl(''), 
      celular : new FormControl(''), 
      fax : new FormControl(''), 
      personalContacto_IG : new FormControl(''), 
      cargo_IG : new FormControl(''), 
      email_IG  : new FormControl('' , [ Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]), 

      personalContacto_T : new FormControl(''), 
      cargo_T : new FormControl(''), 
      email_T : new FormControl('' , [ Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]), 

      personalContacto_RLC : new FormControl(''), 
      cargo_RLC : new FormControl(''), 
      id_TipoDoc_RLC : new FormControl('0'), 
      nro_RLC : new FormControl(''), 
      email_RLC  : new FormControl('' , [ Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]), 

      nroCuentaDetraccion : new FormControl(''), 
      check1_UDP : new FormControl(''), 
      check2_UDP : new FormControl(''), 
      estado : new FormControl('203'), 
      usuario_creacion : new FormControl(''),
      celular_T: new FormControl(''), 

     }) 
  } 

  inicializarFormulario_Banco(){ 
    this.formParamsBanco= new FormGroup({  
      id_Proveedor_Banco : new FormControl('0'), 
      id_Proveedor : new FormControl('0'), 
      id_Banco : new FormControl('0'), 
      Pub_Mone_Codigo : new FormControl('01'), 
      id_TipoCuenta : new FormControl('A'), 
      nroCuenta : new FormControl(''), 
      nroCCI : new FormControl(''), 
      estado : new FormControl('1'), 
      usuario_creacion : new FormControl('')
     }) 
  } 

  inicializarFormulario_Archivos(){ 
    this.formParamsFiles= new FormGroup({
      id_TipoDocumento: new FormControl('0'),
      nombreArchivo: new FormControl('') , 
      file: new FormControl('')
     })
   }

  cargarCombos(){
    this.spinner.show();
    combineLatest([ this.registerService.get_paises(),this.registerService.get_tipoDocumentos() ,this.registerService.get_bancos(),this.registerService.get_monedas() ,this.registerService.get_tipoArchivos() ,this.registerService.get_estadosProveedorNuevo() ])
    .subscribe(([_paises,_tipoDocumentos,_bancos,_monedas, _tipoArchivos, _estados  ])=>{
      this.spinner.hide();
      this.paises = _paises;
      this.tipoDocumentos = _tipoDocumentos;
      this.bancos = _bancos;
      this.monedas = _monedas;
      this.tipoArchivos = _tipoArchivos;
      this.estados = _estados; 

    })
  }

  regresarListado(){
    this.router.navigateByUrl('/login');
  }

  
  changeProyectista(){
     console.log(this.formParams.value)
  }

  
  changePais(idpais:any){   
    if ( idpais == 0 || idpais == '0' ) {
      this.formParams.patchValue({"id_Ciudad": '0' , "id_Departamento": '0'});
      this.ciudades =[];
      this.departamentos =[];
      return
    }
    this.get_ciudades(idpais);
  }

  get_ciudades(idpais){
    this.spinner.show();
    this.registerService.get_ciudades(idpais).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok) { 
          this.ciudades = res.data;
          this.departamentos =[];
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  changeCiudad(idCiudad:any){   
    if ( idCiudad == 0 || idCiudad == '0' ) {
      this.formParams.patchValue({"id_Departamento": '0'});
      this.departamentos =[];
      return
    }
    const IdPais = this.formParams.value.id_Pais;
    this.get_departamentos(IdPais,idCiudad);

  }

  get_departamentos(IdPais,idCiudad){
    this.spinner.show();

    this.registerService.get_departamentos(IdPais,idCiudad).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok) { 
          this.departamentos = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
    
  async saveUpdate(){  

    if (this.formParams.value.id_TipoProveedor == '' || this.formParams.value.id_TipoProveedor == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Proveedor');
      return 
    } 
    if (this.formParams.value.nro_RUC == '' || this.formParams.value.nro_RUC == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el ruc');
      return 
    }   
    if (this.formParams.value.razonsocial == '' || this.formParams.value.razonsocial == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese la razon social');
      return 
    }
    if (this.formParams.value.nombreComercial == '' || this.formParams.value.nombreComercial == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el nombre comercial');
      return 
    }
  
  
    let flagActividad = false;
  
    if (this.formParams.value.vtaProductos == '1' || this.formParams.value.vtaProductos == true ) {
        flagActividad = true;
    } 
    if (flagActividad == false) {
      if (this.formParams.value.vtaServicios == '1' || this.formParams.value.vtaServicios == true ) {
        flagActividad = true; 
      } 
      if (flagActividad == false) {
        if (this.formParams.value.vtaotros == '1' || this.formParams.value.vtaotros == true ) {
          flagActividad = true;
        } 
      } 
    } 
    
    if (flagActividad == false) {
      this.alertasService.Swal_alert('error','debe de marcar al menos una Actividad Economica');
      return 
    } 
  
    if (this.formParams.value.direcion == '' || this.formParams.value.direcion == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese la direccion');
      return 
    }
    if (this.formParams.value.id_Pais == '' || this.formParams.value.id_Pais == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Pais');
      return 
    }
    if (this.formParams.value.id_Ciudad == '' || this.formParams.value.id_Ciudad == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione la ciudad');
      return 
    }
   
    if (this.formParams.value.telefonoFijo == '' || this.formParams.value.telefonoFijo == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el telefono fijo de la empresa');
      return 
    }
    if (this.formParams.value.celular == '' || this.formParams.value.celular == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el nro Celular de la empresa');
      return 
    }
    if (this.formParams.value.personalContacto_IG == '' || this.formParams.value.personalContacto_IG == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el personal de contacto comercial');
      return 
    }
    if (this.formParams.value.cargo_IG == '' || this.formParams.value.cargo_IG == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el cargo de la Empresa');
      return 
    }
    if (this.formParams.value.email_IG == '' || this.formParams.value.email_IG == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el correo comercial de la Empresa');
      return 
    }

    if (this.formParams.controls['email_IG'].valid == false ) {
      this.alertasService.Swal_alert('error','El correo comercial de la Empresa, no es un correo válido');
      return 
    }
    if (this.formParams.value.email_T != '' || this.formParams.value.email_T != null) {
      if (this.formParams.controls['email_T'].valid == false ) {
        this.alertasService.Swal_alert('error','El correo de la Tesoreria, no es un correo válido');
        return 
      }
    }      
  
    if (this.formParams.value.personalContacto_RLC == '' || this.formParams.value.personalContacto_RLC == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese los datos personales del representante legal');
      return 
    }  
    if (this.formParams.value.cargo_RLC == '' || this.formParams.value.cargo_RLC == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el cargo del representante legal');
      return 
    }  
    if (this.formParams.value.id_TipoDoc_RLC == '' || this.formParams.value.id_TipoDoc_RLC == 0) {
      this.alertasService.Swal_alert('error','Por favor ingrese el Tipo Documento del representante legal');
      return 
    }
    if (this.formParams.value.nro_RLC == '' || this.formParams.value.nro_RLC == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el nro de documento del representante legal');
      return 
    } 
    if (this.formParams.value.email_RLC == '' || this.formParams.value.email_RLC == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese el correo del representante legal');
      return 
    } 
    if (this.formParams.controls['email_RLC'].valid == false ) {
      this.alertasService.Swal_alert('error','El correo del Representante legal, no es un correo válido');
      return 
    }
  
  
    if (this.formParams.value.nroCuentaDetraccion == '' || this.formParams.value.nroCuentaDetraccion == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese la cuenta de detraccion de Informacion bancaria');
      return 
    } 
  
    if (this.formParams.value.check1_UDP == '0' || this.formParams.value.check1_UDP == false) {
      this.alertasService.Swal_alert('error','Por favor marque el Uso de sus datos personales');
      return 
    } 
  
    if (this.formParams.value.check2_UDP == '0' || this.formParams.value.check2_UDP == false) {
      this.alertasService.Swal_alert('error','Por favor marque el Uso de sus datos personales');
      return 
    } 
  
    this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });
  
  
    let  checkProduct = (this.formParams.value.vtaProductos == true) ? 1:0;
    let  checkServices = (this.formParams.value.vtaServicios == true) ? 1:0;
    let  checkOther = (this.formParams.value.vtaProductos == true) ? 1:0;
  
    let  checkAcept1 = (this.formParams.value.check1_UDP == true) ? 1:0;
    let  checkAcept2 = (this.formParams.value.check2_UDP == true) ? 1:0;
  
    this.formParams.patchValue({ "vtaProductos" : checkProduct, "vtaServicios" : checkServices, "vtaotros" : checkOther, });
    this.formParams.patchValue({ "check1_UDP" : checkAcept1, "check2_UDP" : checkAcept2 });
  
  
    if ( this.flag_modoEdicion==false) { //// nuevo  
  
       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
  
       this.registerService.set_save_registroProveedor(this.formParams.value).subscribe((res:RespuestaServer)=>{
         Swal.close();    
         if (res.ok ==true) {     
            this.flag_modoEdicion = true;
            this.formParams.patchValue({ "id_Proveedor" : Number(res.data) });
            this.idProveedor_Global =  Number(res.data);
       
            this.formParams.patchValue({ "vtaProductos" : (checkProduct==1)? true : false , "vtaServicios" : (checkServices==1)? true : false , "vtaotros" : (checkOther==1)? true : false , });
            this.formParams.patchValue({ "check1_UDP" : (checkAcept1 ==1 )? true : false , "check2_UDP" : (checkAcept2 ==1)? true : false  });

            setTimeout(()=>{ // 
              $('#txtRuc').addClass('disabledForm');      
            },0);

            this.alertasService.Swal_Success('Proveedor registrado correctamente..');
            this.blank_bancos();
         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
       
     }else{ /// editar
  
       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
       Swal.showLoading();
       this.registerService.set_edit_registroProveedor(this.formParams.value , this.formParams.value.id_Proveedor).subscribe((res:RespuestaServer)=>{
         Swal.close(); 
         if (res.ok ==true) {          
   
          this.formParams.patchValue({ "vtaProductos" : (checkProduct==1)? true : false , "vtaServicios" : (checkServices==1)? true : false , "vtaotros" : (checkOther==1)? true : false , });
          this.formParams.patchValue({ "check1_UDP" : (checkAcept1 ==1 )? true : false , "check2_UDP" : (checkAcept2 ==1)? true : false  });
          this.alertasService.Swal_Success('Se actualizó correctamente..');  
  
         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
  
     }
  
  } 
 
  blank_bancos(){
    this.flagModo_EdicionBanco= false;    
    this.inicializarFormulario_Banco();
  }

  saveUpdate_bancos(){

    if ( this.idProveedor_Global == 0 || this.idProveedor_Global == null)  {
      this.alertasService.Swal_alert('error', 'Debe de grabar primero el Proveedor');
      return 
    }

    if (this.formParamsBanco.value.id_Banco == '' || this.formParamsBanco.value.id_Banco == 0 || this.formParamsBanco.value.id_Banco == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione el Banco por favor.');
      return 
    }
    if (this.formParamsBanco.value.Pub_Mone_Codigo == '' || this.formParamsBanco.value.Pub_Mone_Codigo == 0 || this.formParamsBanco.value.Pub_Mone_Codigo == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione la moneda por favor.');
      return 
    }
    if (this.formParamsBanco.value.id_TipoCuenta == '' || this.formParamsBanco.value.id_TipoCuenta == 0 || this.formParamsBanco.value.id_TipoCuenta == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione el  tipo de cuenta.');
      return 
    }
    if (this.formParamsBanco.value.nroCuenta == '' || this.formParamsBanco.value.nroCuenta == 0 || this.formParamsBanco.value.nroCuenta == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese el numero de cuenta por favor.');
      return 
    }
    if (this.formParamsBanco.value.nroCCI == '' || this.formParamsBanco.value.nroCCI == 0 || this.formParamsBanco.value.nroCCI == null)  {
      this.alertasService.Swal_alert('error', 'Ingrese el numero de cuenta interbancaria.');
      return 
    }
 

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();

    this.formParamsBanco.patchValue({ "id_Proveedor" : this.idProveedor_Global, "usuario_creacion" :this.idUserGlobal });

    if (this.flagModo_EdicionBanco ==false) { /// nuevo

        if (this.verificarNroCuenta( this.formParamsBanco.value.nroCuenta ) ==true) {
          this.alertasService.Swal_alert('error', 'El nro de cuenta ya se cargo, verifique ..');
          return;
        }

        this.registerService.set_save_registroBancos(this.formParamsBanco.value).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   
             this.formParamsBanco.patchValue({"id_Proveedor_Banco": res.data});
             this.mostrar_detalleBancosProveedor();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })

    }else{/// editar

        this.registerService.set_edit_registroBancos(this.formParamsBanco.value,this.formParamsBanco.value.id_Proveedor_Banco).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   
            this.mostrar_detalleBancosProveedor();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })      
    }
  }

  verificarNroCuenta(nroCuenta: string){  
    var flagRepetida=false;
    for (const obj of this.detalleBancos) {
      if (  obj.nroCuenta == nroCuenta ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  mostrar_detalleBancosProveedor(){
    this.registerService.get_proveedorBancos(this.idProveedor_Global).subscribe((res:RespuestaServer)=>{
     if (res.ok) {            
       this.detalleBancos = res.data; 
       this.blank_bancos();
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_bancos();
     }   
    })        
  }

  modificarBanco({id_Proveedor_Banco, id_Proveedor, id_Banco, Pub_Mone_Codigo, id_TipoCuenta, nroCuenta, nroCCI, estado}){    
    this.formParamsBanco.patchValue({
        "id_Proveedor_Banco"  : id_Proveedor_Banco  ,
        "id_Proveedor"  : this.idProveedor_Global,
        "id_Banco"  : id_Banco ,     
        "Pub_Mone_Codigo" : Pub_Mone_Codigo ,
        "id_TipoCuenta" : id_TipoCuenta , 
        "nroCuenta" : nroCuenta ,
        "nroCCI"  : nroCCI,
        "estado"  : estado ,
    }); 
    this.flagModo_EdicionBanco= true;
   }

   anularBanco(item:any){    

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
      })
    Swal.showLoading();
    this.registerService.get_anularProveedorBancos(item.id_Proveedor_Banco).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
 
        this.alertasService.Swal_alert('success', 'El registro se anulo correctamente');
        for (const iterator of this.detalleBancos) {
          if (iterator.id_Proveedor_Banco == item.id_Proveedor_Banco) {
            iterator.estado = 0;
          }          
        }
          this.blank_bancos();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }


  // ADJUNTANDO ARCHIVOS DEL PROVEEDOR

  
  blank_file(){
    this.inicializarFormulario_Archivos();
    this.detalleProveedorArchivos = [];
   }
   
  onFileChange(event:any, opcion:number) {   

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
      this.filesProveedor = fileE;

      console.log(this.filesProveedor)
  }

  mostrar_detalleArchivosProveedor(){   
    if ( this.idProveedor_Global == 0 || this.idProveedor_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la informacion del Proveedor.');
      return false;
    }
    this.spinner.show();
      this.registerService.get_buscarDetalleArchivos_proveedor( this.idProveedor_Global ).subscribe((res:RespuestaServer)=>{
        this.spinner.hide();
      if (res.ok) { 
         this.detalleProveedorArchivos = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })

  }
   
  async subirArchivo_new(){

    if (!this.formParamsFiles.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo que va a cargar.');
      return;
    }  

    if (this.formParamsFiles.value.id_TipoDocumento == '0' || this.formParamsFiles.value.id_TipoDocumento == null ) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione un Tipo de Archivo');
      return;
    }  
    if (this.formParamsFiles.value.nombreArchivo == '' || this.formParamsFiles.value.nombreArchivo == null  ) {
      this.alertasService.Swal_alert('error', 'Por favor agregue el nombre del documento');
      return;
    }
    
    //--- funcion recursiva

    let cantFile = this.filesProveedor.length;

    const saveFile = async (index:number)=>{

      if (index == cantFile ) {
        Swal.close(); 
        this.blank_file();
        this.alertasService.Swal_Success('Proceso de carga realizado correctamente..');
        this.mostrar_detalleArchivosProveedor();
        return;
      }

        //-----almacenando cada archivo en la base de datos -----
        if (this.obtnerArchivoYacargado(this.filesProveedor[index].file.name ) ==true) {
          // this.alertasService.Swal_alert('error', 'El archivo que intenta subir, Ya se encuentra cargado');
          saveFile(index + 1);
        }else{ 

          const respServer :any = await this.registerService.upload_fileProveedorArchivos(this.idProveedor_Global,  this.filesProveedor[index].file , this.formParamsFiles.value.id_TipoDocumento , this.formParamsFiles.value.nombreArchivo , this.idUserGlobal);
          if (respServer.ok==true) { 
            // this.alertasService.Swal_Success('Proceso de carga realizado correctamente..');
            saveFile(index + 1);
          }else{
            alert(JSON.stringify(respServer.data)); 
            saveFile(index + 1);
          }

        }
    }

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Subiendo archivos, Espere por favor'
    })
    Swal.showLoading(); 
    saveFile(0);

  }

  obtnerArchivoYacargado(nombreArchivo:string){  
    var flagRepetida=false;
    for (const obj of this.detalleProveedorArchivos) {
      if (  obj.nombreArchivo == nombreArchivo ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }
     
  eliminarArchivo_proveedor(item:any){     
    this.spinner.show();
     this.registerService.delete_detalleArchivo_proveedor(item.id_Proveedor_Archivo).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok) { 
          var index = this.detalleProveedorArchivos.indexOf( item );
          this.detalleProveedorArchivos.splice( index, 1 );
          // this.blank_file();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
    
  async enviarInformacion(){ 

    if (this.idProveedor_Global == 0) {
      this.alertasService.Swal_alert('error','Por favor Guarde primero el Proveedor');
      return  
    }

    if (this.detalleBancos.length ==0) {
      this.alertasService.Swal_alert('error','Por favor agregue al menos un item en Informacion Bancaria');
      return 
    }
    if (this.detalleProveedorArchivos.length ==0) {
      this.alertasService.Swal_alert('error','Por favor agregue al menos un Archivo en Check List Documentos');
      this.selectedTabControlDetalle = this.tabControlDetalle[1];
      return 
    }   
  
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();

    this.registerService.set_enviandoInfomacionProveedor(this.idProveedor_Global, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();    
      if (res.ok ==true) {     
 
        this.alertasService.Swal_Success('Los datos fueron enviados correctamente, se le envio un correo con el login y constraseña del sistema..');
        this.router.navigateByUrl('/login');

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  
  } 

  onBlurRuc(){
    if(this.formParams.value.nro_RUC == '' || this.formParams.value.nro_RUC == null ){
     return;
    }
    this.verificacionRuc(); 
  }

  async verificacionRuc(){
    const  codRol  = await this.registerService.get_verificar_nroRuc(this.formParams.value.nro_RUC);
     if (codRol) {
      Swal.close();
      this.alertasService.Swal_Question('Sistemas', 'Usted ya tiene un registro Pendiente desea modificarlo ?')
      .then((result)=>{
        if(result.value){
   
          Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
          Swal.showLoading();
          this.registerService.set_verificacionRuc_envioCorreo(this.formParams.value.nro_RUC, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
            Swal.close();        
            if (res.ok ==true) { 
              
              this.alertasService.Swal_Success('se le envio un correo con el login y constraseña del sistema..');
              this.router.navigateByUrl('/login');
   
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
          })
           
        }else{
          this.alertasService.Swal_Success('el nro de ruc ya esta registrada, solo ingrese al sistema con sus credenciales');
          this.router.navigateByUrl('/login');
        }
      }) 
   
     }    
  }
  
  descargarArchivo_proveedor(id_Proveedor_Archivo:number){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.registerService.get_descargarFileProveedor(id_Proveedor_Archivo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
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

  mostrar_detalleProveedor(){    
 
    this.registerService.get_detalleProveedor(this.idProveedor_Global).subscribe((res:RespuestaServer)=>{
 
     if (res.ok) {               
      const { id_Proveedor, id_TipoProveedor, id_TipoPersona, nro_RUC, razonsocial, nombreComercial, vtaProductos, vtaServicios, vtaotros, vtaotrosDetalle,  direcion, id_Pais, id_Ciudad, id_Departamento, telefonoFijo, celular, fax, personalContacto_IG, cargo_IG, email_IG, personalContacto_T, cargo_T, email_T, personalContacto_RLC, cargo_RLC, id_TipoDoc_RLC, nro_RLC, email_RLC, nroCuentaDetraccion, check1_UDP, check2_UDP, estado, celular_T  } :any = res.data[0] ;

      this.formParams.patchValue({ 
            "id_Proveedor": id_Proveedor , 
            "id_TipoProveedor": String(id_TipoProveedor) , 
            "id_TipoPersona": id_TipoPersona , 
            "nro_RUC": nro_RUC , 
            "razonsocial": razonsocial , 
            "nombreComercial": nombreComercial , 

            "vtaProductos": (vtaProductos == 1)? true:false , 
            "vtaServicios": (vtaServicios == 1)? true:false , 
            "vtaotros": (vtaotros  == 1)? true:false , 
            "vtaotrosDetalle": vtaotrosDetalle , 

            "direcion": direcion , 
            "id_Pais": id_Pais , 
            "id_Ciudad": id_Ciudad , 
            "id_Departamento": id_Departamento , 
            "telefonoFijo": telefonoFijo , 
            "celular": celular , 
            "fax": fax , 
            "personalContacto_IG": personalContacto_IG , 
            "cargo_IG": cargo_IG , 
            "email_IG": email_IG , 

            "personalContacto_T": personalContacto_T , 
            "cargo_T": cargo_T , 
            "email_T": email_T , 

            "personalContacto_RLC": personalContacto_RLC , 
            "cargo_RLC": cargo_RLC , 
            "id_TipoDoc_RLC": id_TipoDoc_RLC , 
            "nro_RLC": nro_RLC , 
            "email_RLC": email_RLC , 

            "nroCuentaDetraccion": nroCuentaDetraccion , 
            "check1_UDP": (check1_UDP == 1)? true:false ,  
            "check2_UDP": (check2_UDP == 1)? true:false ,  
            "estado": estado ,
            "celular_T": celular_T 
      });

      this.get_ciudades(id_Pais);
      this.get_departamentos(id_Pais, id_Ciudad);
 
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_bancos();
     }   
    })        
  }

  cerrarModal_documentos(){
    setTimeout(()=>{ // 
      $('#modal_proveedor').modal('hide');  
    },0); 
  }



    ///-----------------------------------------------------
  //  -------------- BANDEJA DE NUEVOS PROVEEDORES ------
  ///-----------------------------------------------------
  

  mostrar_proveedoresNuevosCab(){    
    this.spinner.show(); 
    this.registerService.get_Informacion_nuevosProveedoresCab( this.formParamsFiltro.value).subscribe((res:RespuestaServer)=>{ 
      this.spinner.hide(); 
      if (res.ok) {               
      this.proveedoresNuevosCab = res.data;
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_bancos();
     }   
    })        
  }


  
    ///-----------------------------------------------------
  //  --------------FIN  BANDEJA DE NUEVOS PROVEEDORES ------
  ///-----------------------------------------------------


  abrir_modalProveedor({id_Proveedor, idEstado}, proceso:any){

    this.idProveedor_Global = id_Proveedor;
    this.idEstado_Global = idEstado;

    setTimeout(()=>{ // 
      $('#modal_proveedor').modal('show');
    },0);

    if (proceso =='2') {
      this.selectedTabControlDetalle = this.tabControlDetalle[0];
    }
    else if (proceso =='3') {
      this.selectedTabControlDetalle = this.tabControlDetalle[1];
    }



    if ( this.idProveedor_Global > 0) {
      this.mostrar_detalleProveedor();
      this.mostrar_detalleBancosProveedor();
      this.mostrar_detalleArchivosProveedor();
    }


    this.inicializarFormularioAprobar();

  }

  cerrarModal_aprobar(){
    setTimeout(()=>{ // 
      $('#modal_aprobacion').modal('hide');  
    },0); 
  }

  abrir_modalAprobar(opcion:string){
     if (opcion == 'A') {
      this.aprobarRechazarProveedor('A')
     }else{

      this.formParamsAprobar.patchValue({"motivo": '' });
      setTimeout(()=>{ // 
        $('#modal_aprobacion').modal('show');  
      },0); 
     }
  }

  
  async aprobarRechazarProveedor(opcion:string){ 

    if ( this.idProveedor_Global == null || this.idProveedor_Global ==0) {
      this.alertasService.Swal_alert('error','No se cargo el ID, por favor actualice la pagina..');
      return 
    }

    if (opcion =='R') {
        if (this.formParamsAprobar.value.motivo == '' || this.formParamsAprobar.value.motivo == null) {
          this.alertasService.Swal_alert('error','Por favor ingrese el motivo del rechazo..');
          return 
        }
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
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
        Swal.showLoading();
        this.registerService.set_aprobarRechazarProveedoresNuevos( this.idProveedor_Global, ((opcion =='A') ? '' : this.formParamsAprobar.value.motivo )  , opcion, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close(); 
          if (res.ok ==true) {  
            this.mostrar_proveedoresNuevosCab();
            this.alertasService.Swal_Success('Proceso realizado correctamente..');  
            this.cerrarModal_aprobar();
            this.cerrarModal_documentos();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
      }
    })  

  } 


  imprimirProveedor({id_Proveedor}){

    this.spinner.show(); 
    this.registerService.get_nuevosProveedores_pdf( id_Proveedor ).subscribe((res:RespuestaServer)=>{ 
      this.spinner.hide(); 
      if (res.ok) {  

        if (res.data.length > 0) {
          this.imprimirProveedorPDF(res.data[0], id_Proveedor);
        }else {
          this.alertasService.Swal_alert('error', 'No hay informacion para mostrar');
        } 
 
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_bancos();
     }   
    })   

  }

  imprimirProveedorPDF(obj:any, idProveedor: number ){
    
    console.log(obj);
    try {
      const doc = new jsPDF(); 
      let altura = 20;
      const codigoAle = Math.floor(Math.random() * 1000000);  

      const imgLogo = 'data:image/png;base64,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';
      
      doc.addImage(imgLogo, 'JPEG', 10, 6, 60, 25);
      
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setTextColor("#17202A");    
      doc.text('PROCESO SIG',75, altura + 5, );

      doc.setTextColor("#000000"); //// ---negrita      
      doc.setFontSize(8);

      doc.text('FECHA EMISIÓN : ' + String(obj.fechaEmisionFicha)  ,150, altura, );   
      altura = altura + 4;
      doc.text('FECHA REVISIÓN : ' + String(obj.fechaRevisionFicha)  ,150, altura, );   
      altura = altura + 4;
      doc.text('NRO REVISIÓN : ' + String(obj.nroRevisionFicha)  ,150, altura, );   
      altura = altura + 4;
      doc.text('CÓDIGO : ' + String(obj.codigoFicha)  ,150, altura, );   
      altura = altura + 4;
      doc.text('PÁGINAS : 1 DE 2',150, altura, );   
      altura = altura + 8;
    
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setTextColor("#17202A");    
      doc.text('FICHA DE DATOS DE PROVEEDOR',50, 35, );
    
      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita
      doc.text('1.- INFORMACIÓN BÁSICA: ',10, altura, );   
      altura = altura + 6;

      doc.rect(8, altura - 4, 195, 22);  // rectangulo
      doc.setFontSize(8);
      doc.text('Razón Social (en el caso de Persona Jurídica) / Nombres y Apellidos (en el caso de Persona Natural):',10, altura, );  
      altura = altura + 4;
      doc.text( String(obj.razonSocial)  ,10, altura, );  
      altura = altura + 8;

      doc.rect(8, altura - 5, 91, 11);  // rectangulo
      doc.rect(99, altura - 5, 104, 11);  // rectangulo

      doc.setFontSize(8);
      doc.text('Nombre Comercial:',10, altura, );   doc.text('Código de Identificación Tributario (RUC/RUT/NIT/CPNJ/otros):',100, altura, );  
      altura = altura + 4;
      doc.text(String(obj.nombreComercial),10, altura, );  doc.text(String(obj.codigoIdentificacion),100, altura, );  
      altura = altura + 15;

         
      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita
      doc.text('2.- ACTIVIDAD ECONÓMICA: ',10, altura, );   
      altura = altura + 8;

      doc.rect(8, altura - 6, 195, 10 );  // rectangulo
      doc.setFontSize(8);
      doc.text('VENTA DE PRODUCTOS',15, altura, )   ; doc.rect(48, altura - 3, 5, 5);     doc.text(String(obj.ventaProductos),49.5, altura, )     
      doc.text('VENTA DE SERVICIOS',85, altura, ); doc.rect(118, altura - 3, 5, 5);    doc.text(String(obj.ventaServicios),119.5, altura, )    
      doc.text('OTROS (detalle)',150, altura, );  
      altura = altura + 8;

      doc.rect(8, altura - 4, 195, 22);  // rectangulo
      doc.text('Detalle:',10, altura, );  
      altura = altura + 4;
      let splitTitle = doc.splitTextToSize( String(obj.otrosDetalle) , 170);

      doc.text(splitTitle,10, altura, );  
      altura = altura + 25;

      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita
      doc.text('3.- INFORMACIÓN GENERAL: ',10, altura, );   
      altura = altura + 8;

      doc.rect(8, altura - 4, 25, 52);  // rectangulo pequeno
      doc.rect(8, altura - 4, 195, 52);  // rectangulo grande
      doc.setFontSize(9);
      doc.text('EMPRESA ',13, altura + 20, );  
      doc.setFontSize(8);

      doc.text('Dirección:',35, altura, );  
      altura = altura + 4;
      doc.text( String(obj.direccion) ,35, altura, );  
      doc.line(33, altura + 2, 203, altura + 2); // horizontal line

      altura = altura + 6;
      doc.text('Ciudad:',35, altura, );             doc.text('Departamento:',100, altura, );    doc.text('Pais:',170, altura, );  
      altura = altura + 4;
      doc.text( String(obj.ciudad) ,35, altura, );   doc.text( String(obj.departamento) ,100, altura, );  doc.text( String(obj.pais) ,170, altura, );  
      doc.line(33, altura + 2, 203, altura + 2); // horizontal line

      altura = altura + 6;
      doc.text('Teléfono fijo:',35, altura, );             doc.text('Teléfono celular:',100, altura, );    doc.text('Fax:',170, altura, );  
      altura = altura + 4;
      doc.text(String(obj.telefonoFijo),35, altura, );   doc.text(String(obj.telefonoCelular),100, altura, );  doc.text(String(obj.fax),170, altura, );  
      doc.line(33, altura + 2, 203, altura + 2); // horizontal line

      altura = altura + 6;
      doc.text('Persona de contacto comercial:',35, altura, );      doc.text('Cargo:',150, altura, );  
      altura = altura + 4;
      doc.text(String(obj.personaContactoComercial),35, altura, );     doc.text(String(obj.cargo),150, altura, ); 
      doc.line(33, altura + 2, 203, altura + 2); // horizontal line

      altura = altura + 6;
      doc.text('Correo electrónico comercial:',35, altura, );  
      altura = altura + 4;
      doc.text(String(obj.correoElectronico),35, altura, );     
      doc.line(33, altura + 4, 203, altura + 4); // horizontal line


      doc.setFontSize(9);
      doc.text('TESORERIA ',12, altura + 15, );  
      doc.setFontSize(8);
      altura = altura + 10;

      
      doc.rect(8, altura - 6, 25, 24);  // rectangulo pequeno
      doc.rect(8, altura - 6, 195, 24);  // rectangulo grande

      doc.text('Nombres y Apellidos:',35, altura, );      doc.text('Cargo:',150, altura, );  
      altura = altura + 4;
      doc.text(String(obj.nombreApellidoTesoreria),35, altura, );     doc.text(String(obj.cargoTesoreria),150, altura, ); 
      doc.line(33, altura + 2, 203, altura + 2); // horizontal line

      altura = altura + 6;
      doc.text('Teléfono celular:',35, altura, );      doc.text('Correo electrónico:',100, altura, );  
      altura = altura + 4;
      doc.text(String(obj.telefonoCelularTesoreria),35, altura, );     doc.text(String(obj.correoElectronicoTesoreria),100, altura, ); 



      doc.setFontSize(8);
      doc.text('REPRESENTANTE ',10, altura + 12, );  
      doc.text('LEGAL DE ',13, altura + 16, ); 
      doc.text('CONTACTO ',13, altura + 20, );   

      doc.setFontSize(8);
      altura = altura + 10;
      doc.rect(8, altura - 6, 25, 24);  // rectangulo pequeno
      doc.rect(8, altura - 6, 195, 24);  // rectangulo grande


      doc.text('Nombres y Apellidos:',35, altura, );      doc.text('Cargo:',150, altura, );  
      altura = altura + 4;
      doc.text(String(obj.nombreApellidoRepresentante),35, altura, );     doc.text(String(obj.cargoRepresentante),150, altura, ); 
      doc.line(33, altura + 2, 203, altura + 2); // horizontal line

      altura = altura + 6;
      doc.text('Tipo y N° Documento:',35, altura, );      doc.text('Correo electrónico:',100, altura, );  
      altura = altura + 4;
      doc.text(String(obj.tipoNroDocRepresentante),35, altura, );     doc.text(String(obj.correoElectronicoRepresentante),100, altura, ); 


      doc.addPage();

      altura = 22;


      doc.addImage(imgLogo, 'JPEG', 10, 6, 60, 25);


      doc.setFontSize(13);
      doc.setFont("courier");
      doc.setTextColor("#17202A");    
      doc.text('SERVICIOS GENERALES',72, altura + 3, );

      doc.setTextColor("#000000"); //// ---negrita      
      doc.setFontSize(8);

      doc.text('FECHA EMISIÓN :  ' + String(obj.fechaEmisionFormato),150, altura, );   
      altura = altura + 4;
      doc.text('FECHA REVISIÓN :  ' + String(obj.fechaRevisionFormato) ,150, altura, );   
      altura = altura + 4;
      doc.text('NRO REVISIÓN : ' + String(obj.nroRevisionFormato),150, altura, );   
      altura = altura + 4;
      doc.text('PÁGINAS : 2 DE 2',150, altura, );   
      altura = altura + 20;
    
      doc.setFontSize(13);
      doc.setFont("courier");
      doc.setTextColor("#17202A");    
      doc.text('FORMATO DE REGISTRO DE PROVEEDOR',50, 35, );
      // doc.text('PROVEEDOR',80, 37, );

      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita
      doc.text('4.- INFORMACIÓN BANCARIA ',10, altura, );   
      altura = altura + 6;

      doc.rect(6, altura - 3, 195, 10 );  // rectangulo
      doc.line(44, altura - 2, 44 , 67); // vertical moneda
      doc.line(57, altura - 2, 57 , 67); // vertical nroCuenta
      doc.line(95, altura - 2, 95 , 67); // vertical CCI
      doc.line(157, altura - 2, 157 , 67); // Ahorro

      doc.line(177, altura + 7, 177 , 67); // Corriente


      doc.setFontSize(8);
      doc.text('Nombre del',13, altura, ); doc.text('Moneda',45, altura + 2, );  doc.text('Número de Cuenta Interbancaria',100, altura, ); doc.text('Tipo de Cuenta',167, altura, );   
      altura = altura + 4;
      doc.text('Banco',16, altura, );  doc.text('Número de Cuenta',60, altura -2 , ); doc.text(' (CCI)',120, altura, ); doc.text('Ahorro',160, altura, ); doc.text('Corriente',180, altura, ); 

      altura = altura + 8;
      doc.rect(6, altura - 5, 195, 8 );  // rectangulo
      doc.text(String(obj.nombreBanco),8, altura, ); doc.text(String(obj.moneda),47, altura, );  doc.text(String(obj.numeroCuenta),61, altura, );  doc.text(String(obj.numeroCuentaInterbancaria),103, altura, );  doc.text(String(obj.tipoCuentaAhorro),163, altura, );  doc.text(String(obj.tipoCuentaCorriente),183, altura, ); 
      
      altura = altura + 8;
      doc.setFontSize(7);
      doc.text('Nota: La información suministrada será para pago vía transferencia. La cuenta indicada deberá pertenecer a la Razón Social.',8, altura, ); 
      altura = altura + 10;


      doc.rect(7, altura - 5, 195, 12 );  // rectangulo
      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita
      doc.text('CUENTA DETRACCIÓN: ',10, altura, );   
      altura = altura + 4;

      doc.setFontSize(8);
      doc.text('Número de cuenta del Banco de la Nación',10, altura, );   doc.text(String(obj.numeroCuentaBancoNacion),100, altura, );  
 
      altura = altura + 10;


      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita
      doc.text('5.- USO DE DATOS PERSONALES ',10, altura, );   
      altura = altura + 8;

      doc.setFontSize(8);
      doc.rect(25, altura, 5, 5);  // rectangulo
      doc.text(String(obj.checkAutorizoDatos),26.5, altura + 3.5, ) ;

      

      splitTitle = doc.splitTextToSize(String(  'Autorizo a la empresa Oca Calidad Medio Ambiente y Seguridad del Perú SAC (Oca Global) el uso de mis datos personales con la finalidad de que me hagan llegar los servicios que requieren y sean de interés. Oca Global respeta la privacidad de la información personal de las personas y garantiza la confidencialidad y el tratamiento seguro de los datos de carácter personal que se solicitan a través de este formato de acuerdo a lo establecido en la Ley 29733 Ley de Protección de Datos Personales.' ), 170);

      doc.text(splitTitle,35, altura, );  
      altura = altura + 20;

      doc.rect(25, altura - 3, 5, 5);  // rectangulo
      doc.text(String(obj.check_No_AutorizoDatosPersonales),26.5, altura  , ) 

      doc.text('No autorizo el uso de mis datos personales',35, altura, );  
      altura = altura + 10;


      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita
      doc.text('6.- AUTORIZACIONES Y DECLARACIONES ESPECIALES ',10, altura, );   
      altura = altura + 6;
      doc.rect(10, altura - 4, 190, 20);  // rectangulo
      doc.setFontSize(8);
      doc.text('AUTORIZACIONES Y DECLARACIONES ESPECIALES',55, altura, ) 
      doc.line(10, altura + 2, 200, altura + 2); // horizontal line

      altura = altura + 6; 
      doc.setFontSize(6.5);
      splitTitle = doc.splitTextToSize(String(  'Declaro que la información consignada en este formulario es veraz y admito que cualquier omisión o inexactitud en estos documentos podrá ocasionar el rechazo de esta solicitud y la devolución de la documentación, como también la cancelación de mi inscripción y/o finalización de la relación pre o post contractual. Me comprometo a actualizar la información aquí consignada en los tiempos determinados por la Compañía.' ), 180);

      doc.text(splitTitle,13, altura, );  
      altura = altura + 20;

      doc.setFontSize(9);
      doc.rect(90, altura, 85, 40);  // rectangulo
      doc.text('DATOS DEL REPRESENTANTE LEGAL: ',20, altura, );   
      altura = altura + 4;
      doc.setFontSize(8);
      doc.text('Nombre: '  + String(obj.nombreRepresentanteLegal),20, altura, ); 
      altura = altura + 4;
      doc.text('DNI / Carné Extranjería: ' + String(obj.dniRepresentanteLegal),20, altura, ); 

      // doc.output('dataurlnewwindow');
      doc.save( 'FormatoFichaDatosProveedor_'+ idProveedor +'_' + codigoAle +'.pdf');
  
    } catch (error) {
      console.error(error);
    }
  



  }





}

