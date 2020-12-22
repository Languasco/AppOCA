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
      usuario_creacion : new FormControl('')

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

      console.log( this.estados)
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
      const { id_Proveedor, id_TipoProveedor, id_TipoPersona, nro_RUC, razonsocial, nombreComercial, vtaProductos, vtaServicios, vtaotros, vtaotrosDetalle,  direcion, id_Pais, id_Ciudad, id_Departamento, telefonoFijo, celular, fax, personalContacto_IG, cargo_IG, email_IG, personalContacto_T, cargo_T, email_T, personalContacto_RLC, cargo_RLC, id_TipoDoc_RLC, nro_RLC, email_RLC, nroCuentaDetraccion, check1_UDP, check2_UDP, estado  } :any = res.data[0] ;

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
            "estado": estado 
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
    this.registerService.get_Informacion_nuevosProveedoresCab( this.formParamsFiles.value).subscribe((res:RespuestaServer)=>{ 
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

      const imgLogo = 'data:image/jpeg;base64,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';
      
      doc.addImage(imgLogo, 'JPEG', 10, 6, 60, 25);
      
      doc.setFontSize(15);
      doc.setFont("courier");
      doc.setTextColor("#17202A");    
      doc.text('PROCESO SIG',75, altura + 5, );

      doc.setTextColor("#000000"); //// ---negrita      
      doc.setFontSize(8);

      doc.text('FECHA EMISIÓN : ' + String(obj.fechaEmisionFicha)  ,150, altura, );   
      altura = altura + 6;
      doc.text('FECHA REVISIÓN : ' + String(obj.fechaRevisionFicha)  ,150, altura, );   
      altura = altura + 6;
      doc.text('NRO REVISIÓN : ' + String(obj.nroRevisionFicha)  ,150, altura, );   
      altura = altura + 6;
      doc.text('CÓDIGO : ' + String(obj.codigoFicha)  ,150, altura, );   
      altura = altura + 6;
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

      altura = 20;


      doc.addImage(imgLogo, 'JPEG', 10, 6, 60, 25);


      doc.setFontSize(13);
      doc.setFont("courier");
      doc.setTextColor("#17202A");    
      doc.text('SERVICIOS GENERALES',72, altura + 3, );

      doc.setTextColor("#000000"); //// ---negrita      
      doc.setFontSize(8);

      doc.text('FECHA EMISIÓN :  ' + String(obj.fechaEmisionFormato),150, altura, );   
      altura = altura + 6;
      doc.text('FECHA REVISIÓN :  ' + String(obj.fechaRevisionFormato) ,150, altura, );   
      altura = altura + 6;
      doc.text('NRO REVISIÓN : ' + String(obj.nroRevisionFormato),150, altura, );   
      altura = altura + 6;
      doc.text('PÁGINAS : 2 DE 2',150, altura, );   
      altura = altura + 8;
    
      doc.setFontSize(13);
      doc.setFont("courier");
      doc.setTextColor("#17202A");    
      doc.text('FORMATO DE REGISTRO DE PROVEEDOR',50, 33, );
      doc.text('PROVEEDOR',80, 37, );

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

      splitTitle = doc.splitTextToSize(String(  'Autorizo a la empresa Oca Calidad Medio Ambiente y Seguridad del Perú SAC (Oca Global) el uso de mis datos personales con la finalidad de que me hagan llegar los servicios que requieren y sean de interés. Oca Global respeta la privacidad de la información personal de las personas y garantiza la confidencialidad y el tratamiento seguro de los datos de carácter personal que se solicitan a través de este formato de acuerdo a lo establecido en la Ley 29733 Ley de Protección de Datos Personales.' ), 170);

      doc.text(splitTitle,35, altura, );  
      altura = altura + 20;

      doc.rect(25, altura - 3, 5, 5);  // rectangulo
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

