import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { RegisterService } from '../../services/register/register.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertasService } from '../../services/alertas/alertas.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { LoginService } from '../../services/login/login.service';
import { FuncionesglobalesService } from '../../services/funciones/funcionesglobales.service';
import { RespuestaServer } from '../../models/respuestaServer.models';
import Swal from 'sweetalert2';
import { InputFileI } from '../../models/inputFile.models';


declare const $:any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formParams : FormGroup;
  formParamsBanco : FormGroup;
  formParamsFiles : FormGroup;

  tabControlDetalle: string[] = ['DATOS GENERALES','CHECK LIST DE DOCUMENTOS']; 
  selectedTabControlDetalle :any;
  idUserGlobal = '';
  flag_modoEdicion =false;
  flagModo_EdicionBanco =false;

      //---volver cero ----
  idProveedor_Global = 0;

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
  
  @ViewChild('_ruc') _rucElement: ElementRef;
  @ViewChild('_razonSocial') _razonSocialElement: ElementRef;

  constructor(private router:Router, private spinner: NgxSpinnerService,
    private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService) { 

      this.idUserGlobal = this.loginService.get_idUsuario();
    }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.inicializarFormulario_Banco();
    this.inicializarFormulario_Archivos(); 
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
    this.cargarCombos();
    this.changePais(139);
    this.changeCiudad(82);

    setTimeout(()=>{ // 
      this.formParams.patchValue({"id_Ciudad": '82' });
      $('#txtRuc').removeClass('disabledForm');      
    },0);
 
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
      id_Pais : new FormControl('139'), 
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
      celular_T: new FormControl(''), 

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

  //  id_Proveedor_Archivo, id_Proveedor, id_TipoDocumento, nombreArchivo, nombreArchivo_bd, estado, usuario_creacion  

  inicializarFormulario_Archivos(){ 
    this.formParamsFiles= new FormGroup({
      id_TipoDocumento: new FormControl('0'),
      nombreArchivo: new FormControl('') , 
      file: new FormControl('')
     })
   }

  cargarCombos(){
    this.spinner.show();
    combineLatest([ this.registerService.get_paises(),this.registerService.get_tipoDocumentos() ,this.registerService.get_bancos(),this.registerService.get_monedas() ,this.registerService.get_tipoArchivos() , ])
    .subscribe(([_paises,_tipoDocumentos,_bancos,_monedas, _tipoArchivos  ])=>{
      this.spinner.hide();
      this.paises = _paises;
      this.tipoDocumentos = _tipoDocumentos;
      this.bancos = _bancos;
      this.monedas = _monedas;
      this.tipoArchivos = _tipoArchivos;
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
    this.spinner.show();
    const IdPais = this.formParams.value.id_Pais;
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
      setTimeout(()=>{ // enfocando
        this._rucElement.nativeElement.focus();
      },0); 
      return 
    }   


    let nro_ruc = String(this.formParams.value.nro_RUC);
    console.log(nro_ruc.length);
    if (nro_ruc.length == 11) {
      if ( this.flag_modoEdicion==false) { //// nuevo 
        this.verificacionRuc();  
      }
    }else {
      this.alertasService.Swal_alert('error','Debe de ingresar los 11 digitos del Nro. de RUC');
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
    // if (this.formParams.value.id_Departamento == '' || this.formParams.value.id_Departamento == 0) {
    //   this.alertasService.Swal_alert('error','Por favor ingrese la descripcion del perfil');
    //   return 
    // }
  
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
  
    // if (this.formParams.value.personalContacto_T == '' || this.formParams.value.personalContacto_T == null) {
    //     this.alertasService.Swal_alert('error','Por favor ingrese los datos del personal de tesoreria');
    //     return 
    // }    
    // if (this.formParams.value.cargo_T == '' || this.formParams.value.cargo_T == null) {
    //   this.alertasService.Swal_alert('error','Por favor ingrese  el cargo de la tesoreria');
    //   return 
    // }  
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
  
  
    // if (this.formParams.value.nroCuentaDetraccion == '' || this.formParams.value.nroCuentaDetraccion == null) {
    //   this.alertasService.Swal_alert('error','Por favor ingrese la cuenta de detraccion de Informacion bancaria');
    //   return 
    // } 
  
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
    let  checkOther = (this.formParams.value.vtaotros == true) ? 1:0;
  
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

            this.alertasService.Swal_Success('Registro Guardado con Exito. Favor ingresar la información Bancaria');
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
             this.getProveedorBancos();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })

    }else{/// editar

        this.registerService.set_edit_registroBancos(this.formParamsBanco.value,this.formParamsBanco.value.id_Proveedor_Banco).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   
            this.getProveedorBancos();
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

  getProveedorBancos(){
    this.registerService.get_proveedorBancos(this.idProveedor_Global).subscribe((res:RespuestaServer)=>{
      console.log(res);
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

 
  onEnterRuc(){

    if(this.formParams.value.nro_RUC == '' || this.formParams.value.nro_RUC == null ){
      this.alertasService.Swal_alert('error','Es obligatorio ingresar el Nro. de RUC');
      setTimeout(()=>{ // enfocando
        this._rucElement.nativeElement.focus();
      },0); 
    }else{

      let nro_ruc = String(this.formParams.value.nro_RUC);
      if (nro_ruc.length == 11) {
        this.verificacionRuc(); 
      }else {
        this.alertasService.Swal_alert('error','Debe de ingresar los 11 digitos del Nro. de RUC');
      } 

    }
  }

  keyPress(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros(event)  ;
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
   
     }else{
      setTimeout(()=>{ // enfocando
        this._razonSocialElement.nativeElement.focus();
      },0); 
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

 

}

