 

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { BsLocaleService, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
 import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FuncionesglobalesService } from '../../../../services/funciones/funcionesglobales.service'; 
import { AlertasService } from '../../../../services/alertas/alertas.service'; 
import { LoginService } from '../../../../services/login/login.service'; 
import { RespuestaServer } from '../../../../models/respuestaServer.models';
import { combineLatest } from 'rxjs';
import { CombosService } from '../../../../services/Logistica/Procesos/combos.service';
import { BandejaAtencionService } from '../../../../services/ControlObras/Procesos/bandeja-atencion.service';
 

declare var $:any;

@Component({
  selector: 'app-bandeja-atencion',
  templateUrl: './bandeja-atencion.component.html',
  styleUrls: ['./bandeja-atencion.component.css']
})
 
export class BandejaAtencionComponent implements OnInit, AfterViewInit {

  formParamsFiltro : FormGroup;
  formParamsDatosG : FormGroup;  
  formParamsActividadesDet : FormGroup;  
  formParamsMaterialDet : FormGroup;  

  idUserGlobal : string=''; 
  idObraParteDiario_Global  : string='';
  nroObraParteDiario_Global  : string='';

  idParteDiario_baremo_Global : string='';
  idParteDiario_articulo_Global : string='';
 
  bandejaAtencionCab:any [] = [];
 
  locales:any [] = [];
  centroCostos:any [] = [];
  jefeCuadrillas:any [] = [];
  estados:any [] = [];
  inspectores :any[]= [];
  supervisores :any[]= [];  
  actividades:any[]= [];
  almacenes:any[]= [];


  listBaremos:any[]= [];
 
  ActividadesDetalle:any[]= [];
  MaterialDetalle:any[]= [];

  filtrarBandejaCab='';
  datepiekerConfig:Partial<BsDatepickerConfig>;

  /// configuracion google maps
  @ViewChild('mapa', {static: false}) mapaElement: ElementRef;
  map : google.maps.Map;
  marker :google.maps.Marker;

  //-TAB control
  tabControlDetalle: string[] = ['DATOS GENERALES','ACTIVIDADES','MATERIAL DE CAMPO', 'FOTOS']; 
  selectedTabControlDetalle :any;

  flagModo_EdicionDet = false;
  flagModo_EdicionDet_material = false;
  objParteDiario_Global;
 
  @ViewChild('_cant') _cantElement: ElementRef;
  @ViewChild('_cantMat') _cantMatElement: ElementRef;
  
  checkeadoAll=false;
  detallefotos :any [] = [];

  constructor(private alertasService : AlertasService, private localeService: BsLocaleService, private spinner: NgxSpinnerService, private loginService: LoginService,
              private funcionGlobalServices : FuncionesglobalesService, private bandejaAtencionService : BandejaAtencionService)   {
            this.idUserGlobal = this.loginService.get_idUsuario(); 
  }
 
  ngOnInit(): void { 
   this.getCargarCombos();
   this.inicializarFormularioFiltro(); 
   this.inicializarFormularioDatosG();
   this.inicializarFormulario_actividadesDet();
   this.inicializarFormulario_materialDet();
   this.selectedTabControlDetalle = this.tabControlDetalle[0];
   }

   ngAfterViewInit() {
    this.InicializarMapa()
  }   

  InicializarMapa() {
    const latLng = new google.maps.LatLng(-12.046374, -77.0427934 );
    const  mapaOption : google.maps.MapOptions = {
      center : latLng,
      zoom : 13,
      mapTypeControl: true,
    }
    this.map = new google.maps.Map(this.mapaElement.nativeElement, mapaOption);
    this.marker = new google.maps.Marker({
      position: latLng
    });
    this.marker.setMap(this.map);
   };

  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idLocal : new FormControl('00000'), 
      nroObra : new FormControl(''), 
      idCentroCosto : new FormControl('0'), 
      idCuadrilla : new FormControl('0'), 
      idEstado : new FormControl('0')
     }) 
  } 

  inicializarFormularioDatosG(){ 
    let timeIni = this.horalFormat(24,0);

    this.formParamsDatosG= new FormGroup({
      fechaEjecucion : new FormControl(new Date()), 
      horaInicio : new FormControl(''),
      inspector : new FormControl('0'),
      supervisor : new FormControl('0'),
      observacion : new FormControl(''),
      fechaLiquidacion : new FormControl(new Date()),
     }) 
  } 

  inicializarFormulario_actividadesDet(){
    this.formParamsActividadesDet= new FormGroup({
        idParteDiario_baremo  : new FormControl(''),
        idActividad :  new FormControl('0'),
        idBaremo :  new FormControl('0'),
        unidadBaremo : new FormControl(''),
        cantidadMovil :  new FormControl(''),
        cantidadAprobada : new FormControl(''),
        precioBaremo  : new FormControl(''),
        importe : new FormControl(''),
      });
   }

   inicializarFormulario_materialDet(){
    this.formParamsMaterialDet= new FormGroup({
        idParteDiario_material  : new FormControl(''),
        idAlmacen :  new FormControl('0'),
        folio : new FormControl(''),
        material : new FormControl(''),
        unidadMedida : new FormControl(''),
        guiaIngreso : new FormControl(''),
        guiaSalida : new FormControl(''),
        cantidadMovil : new FormControl(''),
        cantidadAprobada : new FormControl('')
 
      });
   }


  horalFormat(ini:number, fin:number){
    const timeIni = new Date();
    timeIni.setHours(ini);
    timeIni.setMinutes(fin);
    return timeIni;
   } 

  getCargarCombos(){ 
    this.spinner.show(); 
    //---- combineLatest : combina varios observables, en un array ---
    //--- la devolucion del subcribe , obtenemos el por medio de la desustructuracion de array

    combineLatest([this.bandejaAtencionService.get_locales( this.idUserGlobal),  this.bandejaAtencionService.get_centroCosto( this.idUserGlobal), this.bandejaAtencionService.get_estado() ,  this.bandejaAtencionService.get_inspector(),  this.bandejaAtencionService.get_supervisor(), this.bandejaAtencionService.get_baremos(), this.bandejaAtencionService.get_actividades(), this.bandejaAtencionService.get_almacenes(this.idUserGlobal) ])
   .subscribe(([_locales, _centrocostos, _estados, _inspectores, _supervisores, _baremos, _actividades, _almacenes]) =>{
      this.spinner.hide(); 

      this.locales = _locales; 
      this.centroCostos = _centrocostos;
      this.estados = _estados;
      this.inspectores = _inspectores;
      this.supervisores = _supervisores;
      this.listBaremos =_baremos;
      this.actividades = _actividades;
      this.almacenes = _almacenes;
    })
  }

  changeCentroCosto(opcion:any){  

    if ( opcion.target.value == 0 || opcion.target.value == '0' ) {
        this.formParamsFiltro.patchValue({"idCuadrilla": '0'});
        this.jefeCuadrillas = [];
        return;
      } 

    this.bandejaAtencionService.get_jefeCuadrilla( this.formParamsFiltro.value.idCentroCosto  ).subscribe((res:RespuestaServer)=>{            
      this.spinner.hide();
      if (res.ok==true) {         
        this.jefeCuadrillas = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })

  }

  mostrarInformacion_cabecera(){   

    // if ( this.formParamsFiltro.value.idCuadrilla == '0' || this.formParamsFiltro.value.idCuadrilla == '' || this.formParamsFiltro.value.idCuadrilla == null)  {
    //   this.alertasService.Swal_alert('error', 'Por favor seleccione una Cuadrilla');
    //   return false;
    // }
    this.spinner.show();
     this.bandejaAtencionService.get_bandejaAtencion_Cab( this.formParamsFiltro.value.idLocal ,  this.formParamsFiltro.value.nroObra,  this.formParamsFiltro.value.idCuadrilla,  this.formParamsFiltro.value.idEstado  ).subscribe((res:RespuestaServer)=>{            
      this.spinner.hide();
      if (res.ok==true) {         
        this.bandejaAtencionCab = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  abrirModalMapa(latitud:string, longitud :string){
    if (latitud.length ==0) {
      return;
    }

    const lat = Number(latitud);
    const lng = Number(longitud);
    const latLng = new google.maps.LatLng(lat, lng );

    $('#modalMapa').modal('show');
    
    //// limpiando el anterior marker
    this.marker.setMap(null);
 
    /// asignando el nuevo markeral mapa
    this.marker = new google.maps.Marker({
      position: latLng
    });
    this.marker.setMap(this.map);

    $("#location-map").css("width", "100%");
    $("#id_mapa").css("width", "100%");

    google.maps.event.trigger(this.map, "resize");
    this.map.setCenter(latLng);
  }
 
  abrirModal_ParteDiario(objParteDiario :any){ 

    //----- parte diario CABECERA -----
    this.objParteDiario_Global = objParteDiario;
    const { Id_ParteDiario, ParteDiario_ObraTD, fechaEjecucion, horaInicio, idInspectorCliente, idSupervisor, observacion, fechaLiquidacion} = objParteDiario;
    
    this.idObraParteDiario_Global = Id_ParteDiario;
    this.nroObraParteDiario_Global = ParteDiario_ObraTD;

    this.formParamsDatosG.patchValue({"fechaEjecucion": fechaEjecucion , "horaInicio": horaInicio, "inspector": idInspectorCliente, "supervisor": idSupervisor , "observacion": observacion, "fechaLiquidacion": fechaLiquidacion  });
    
    ///enfocando el primer tab -----
    this.selectedTabControlDetalle = this.tabControlDetalle[0];

    //------parte diario BAREMOS -----
    this.get_parteDiario_Baremos();

    //------parte diario MATERIAL RECUPERO -----
    this.get_parteDiario_material();


    this.get_parteDiario_fotos();

    setTimeout(()=>{ // 
      $('#modal_parteDiario').modal('show');
    },0);

  }

  cerrarModal_parteDiario(){
    setTimeout(()=>{ // 
      $('#modal_parteDiario').modal('hide');  
    },0); 
  }

  guardar_liquidacionCab(){
 
    if ( this.idObraParteDiario_Global == '' || this.idObraParteDiario_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la informacion del ID del Parte Diario, actualize su pagina.');
      return 
    }

    if ( this.formParamsDatosG.value.fechaLiquidacion == '0' || this.formParamsDatosG.value.fechaLiquidacion == '' || this.formParamsDatosG.value.fechaLiquidacion == null)  {
      this.alertasService.Swal_alert('error', 'Por favor seleccione la fecha de Liquidacion');
      return false;
    }

  // const valorFecha  = this.funcionGlobalServices.formatoFecha(this.formParamsDatosG.value.fechaLiquidacion); 
   const valorFecha = this.funcionGlobalServices.formatoFechaIngles(this.funcionGlobalServices.formatoFecha(this.formParamsDatosG.value.fechaLiquidacion)) 
 
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.bandejaAtencionService.set_ActualizarParteDiario( this.idObraParteDiario_Global, this.formParamsDatosG.value.inspector,this.formParamsDatosG.value.supervisor, this.formParamsDatosG.value.observacion, valorFecha , this.idUserGlobal).subscribe((res:RespuestaServer)=>{  
      Swal.close();
      if (res.ok) {   
          this.alertasService.Swal_Success('Parte Diario actualizada correctamente');
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }    
    })

  }

  cerrar_liquidacionCab(){

    if ( this.idObraParteDiario_Global == '' || this.idObraParteDiario_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la informacion del ID del Parte Diario, actualize su pagina.');
      return 
    }

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de cerrar la Liquidacion ?')
    .then((result)=>{
      if(result.value){

        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.bandejaAtencionService.set_cerrarParteDiario(  this.idObraParteDiario_Global,  this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) { 
            this.alertasService.Swal_Success('Liquidacion cerrada correctamente');

            //---eliminando el registro ----
            var index = this.bandejaAtencionCab.indexOf( this.objParteDiario_Global );
            this.bandejaAtencionCab.splice( index, 1 );

            setTimeout(()=>{ // 
              $('#modal_parteDiario').modal('hide');  
            },0);

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
         
      }
    }) 

  }

  changeBaremos(opcion){

    if ( opcion.target.value == 0 || opcion.target.value == '0' ) {
      this.formParamsActividadesDet.patchValue({"unidadBaremo": '', "cantidadMovil": '', "cantidadAprobada": '', "precioBaremo": '' , "importe": ''}); 
      return;
    }

    for (const baremo of this.listBaremos) {
      if (baremo.idBaremo == opcion.target.value ) {
        this.formParamsActividadesDet.patchValue({"unidadBaremo": baremo.unidadMedida, "cantidadMovil": '', "cantidadAprobada": '', "precioBaremo": baremo.precioBaremo, "importe": ''}); 
        break;
      }
    }
  }

  onBlurMethod(obj){
    if (this.formParamsActividadesDet.value.idBaremo == '' || this.formParamsActividadesDet.value.idBaremo == 0 || this.formParamsActividadesDet.value.idBaremo == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione el Baremo por favor.');
      return 
    }  
   }

  guardarDet(){

    if ( this.idObraParteDiario_Global == '0' || this.idObraParteDiario_Global == null)  {
      this.alertasService.Swal_alert('error', 'Debe de grabar primero la cabecera de la liquidacion');
      return 
    }
    if (this.formParamsActividadesDet.value.idActividad == '' || this.formParamsActividadesDet.value.idActividad == 0 || this.formParamsActividadesDet.value.idActividad == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione una Actividad por favor.');
      return 
    }

    if (this.formParamsActividadesDet.value.idBaremo == '' || this.formParamsActividadesDet.value.idBaremo == 0 || this.formParamsActividadesDet.value.idBaremo == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione el Baremo por favor.');
      return 
    }
    if (this.formParamsActividadesDet.value.cantidadAprobada == '' || this.formParamsActividadesDet.value.cantidadAprobada == 0 || this.formParamsActividadesDet.value.cantidadAprobada == null)  {
      this.alertasService.Swal_alert('error', 'Por favor ingresar la cantidad.');
      return 
    }

    if ( Number(this.formParamsActividadesDet.value.cantidadAprobada)  < 0  )  {
      this.alertasService.Swal_alert('error', 'Por favor ingresar la cantidad positiva.');
      return 
    }
    
    const cantidad = (String(this.formParamsActividadesDet.value.cantidadAprobada).length == 0)? 0: this.formParamsActividadesDet.value.cantidadAprobada ;
    const precio = (String(this.formParamsActividadesDet.value.precioBaremo).length == 0)? 0: this.formParamsActividadesDet.value.precioBaremo ;
    const total= (cantidad * precio);

    this.formParamsActividadesDet.patchValue({"importe": total}); 

    Swal.fire({
      icon: 'info',allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();

    if (this.flagModo_EdicionDet ==false) { /// nuevo

        if (this.verificarBaremoYacargado( this.formParamsActividadesDet.value.idBaremo ) ==true) {
          this.alertasService.Swal_alert('error', 'El Baremos ya se cargo, verifique ..');
          return;
        }

        this.bandejaAtencionService.set_save_ParteDiario_Baremo( this.idObraParteDiario_Global , this.formParamsActividadesDet.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   
             this.idParteDiario_baremo_Global  = String(res.data);
             this.formParamsActividadesDet.patchValue({"idParteDiario_baremo  ": res.data});
             this.get_parteDiario_Baremos();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })

    }else{/// editar

        if ( this.idParteDiario_baremo_Global == '' || this.idParteDiario_baremo_Global == '0' || this.idParteDiario_baremo_Global == null)  {
          this.alertasService.Swal_alert('error', 'No se cargo el Id del Baremo, por favor actualizar la pagina..');
          return 
        }

        this.bandejaAtencionService.set_update_ParteDiario_Baremo(this.formParamsActividadesDet.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   
       
            for (const objdetalle of this.ActividadesDetalle) {
             if (objdetalle.idParteDiario_baremo   == this.idParteDiario_baremo_Global ) {
                objdetalle.cantidad = cantidad;
                objdetalle.importe = total;
                break;
             }
           }

           this.blank_Detalle();

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })      
    }

  }

  get_parteDiario_Baremos(){
    this.bandejaAtencionService.get_parteDiario_baremos(this.idObraParteDiario_Global).subscribe((res:RespuestaServer)=>{
     if (res.ok) {            
       this.ActividadesDetalle = res.data; 
       this.blank_Detalle();
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_Detalle();
     }      
    })        
  }

  blank_Detalle(){
    this.flagModo_EdicionDet= false;
    
    /// Agregando una clase a un elemento para desabilitarlo---

    setTimeout(()=>{ // enfocando
      $('#idBaremo').removeClass('disabledForm');
    },0);
    this.inicializarFormulario_actividadesDet();

  }

  verificarBaremoYacargado(idBaremo: number){  
    var flagRepetida=false;
    for (const obj of this.ActividadesDetalle) {
      if (  obj.idBaremo == idBaremo ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }
   
  modificar_actividadDetalle({idParteDiario_baremo,idActividad, idBaremo, codigoBaremo, descripcionBaremo, unidadBaremo, cantidadMovil, cantidad, precio, importe}){  

    this.formParamsActividadesDet.patchValue({
        "idParteDiario_baremo"  : idParteDiario_baremo  ,
        "idActividad"  : idActividad,
        "idBaremo"  : idBaremo ,   
        "unidadBaremo" : unidadBaremo ,
        "cantidadMovil" : cantidadMovil , 
        "cantidadAprobada" : cantidad ,
        "precioBaremo"  : precio ,
        "importe"  : importe
    }); 

    this.idParteDiario_baremo_Global = idParteDiario_baremo;

    this.flagModo_EdicionDet= true;  
      setTimeout(()=>{ // enfocando
            /// Agregando una clase a un elemento para desabilitarlo---
          $('#idBaremo').addClass('disabledForm');
          this._cantElement.nativeElement.focus();
      },0);

  }

   
  eliminar_actividadDetalle(item:any){  
    Swal.fire({
      icon: 'info', allowOutsideClick: false,allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.bandejaAtencionService.set_delete_ParteDiario_Baremo(item.idParteDiario_baremo , this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
          var index = this.ActividadesDetalle.indexOf( item );
          this.ActividadesDetalle.splice( index, 1 );
          this.blank_Detalle();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }


  // ------------------------------
  //  ------ MATERIAL DE RECUPERO
  // ------------------------------

  get_parteDiario_material(){
    this.bandejaAtencionService.get_parteDiario_material(this.idObraParteDiario_Global).subscribe((res:RespuestaServer)=>{
     if (res.ok) {            
       this.MaterialDetalle = res.data; 
       this.blank_Detalle_Material();
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_Detalle_Material();
     }      
    })        
  }
  
  blank_Detalle_Material(){
    this.flagModo_EdicionDet_material= false;
    this.inicializarFormulario_materialDet();
  }
 
  guardarDet_material(){

    if (this.flagModo_EdicionDet_material == true) { /// editar

        if ( this.idObraParteDiario_Global == '0' || this.idObraParteDiario_Global == null)  {
          this.alertasService.Swal_alert('error', 'Debe de grabar primero la cabecera de la liquidacion');
          return 
        }
        if (this.formParamsMaterialDet.value.cantidadAprobada == '' || this.formParamsMaterialDet.value.cantidadAprobada == 0 || this.formParamsMaterialDet.value.cantidadAprobada == null)  {
          this.alertasService.Swal_alert('error', 'Por favor ingresar la cantidad.');
          return 
        }
    
        if ( Number(this.formParamsMaterialDet.value.cantidadAprobada)  < 0  )  {
          this.alertasService.Swal_alert('error', 'Por favor ingresar la cantidad positiva.');
          return 
        }
        
        const cantidad = (String(this.formParamsMaterialDet.value.cantidadAprobada).length == 0)? 0: this.formParamsMaterialDet.value.cantidadAprobada ;
    
        Swal.fire({
          icon: 'info',allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();


        if ( this.idParteDiario_articulo_Global == '' || this.idParteDiario_articulo_Global == '0' || this.idParteDiario_articulo_Global == null)  {
          this.alertasService.Swal_alert('error', 'No se cargo el Id del Baremo, por favor actualizar la pagina..');
          return 
        }

        this.bandejaAtencionService.set_update_ParteDiario_Material( this.idParteDiario_articulo_Global ,cantidad, this.idUserGlobal).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   
       
            for (const objdetalle of this.MaterialDetalle) {
             if (objdetalle.idParteDiario_material   == this.idParteDiario_articulo_Global ) {
                objdetalle.cantidadAprobada = cantidad;
                break;
             }
           }

           this.blank_Detalle_Material();

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })      
    }else{
      this.alertasService.Swal_alert('error', 'Por favor primero elija un material del listado..');
    }

  }

  modificar_materialesDetalle({ idParteDiario_material, idAlmacen, folio, material, unidadMedida, guiaIngreso, guiaSalida, cantidadMovil, cantidadAprobada }){  

    this.formParamsMaterialDet.patchValue({
        "idParteDiario_material"  : idParteDiario_material  ,
        "idAlmacen"  : idAlmacen,
        "folio"  : folio ,   
        "material" : material ,
        "unidadMedida" : unidadMedida , 
        "guiaIngreso" : guiaIngreso ,
        "guiaSalida"  : guiaSalida ,
        "cantidadMovil"  : cantidadMovil,
        "cantidadAprobada"  : cantidadAprobada
    }); 

    this.idParteDiario_articulo_Global = idParteDiario_material;
    this.flagModo_EdicionDet_material= true;  

      setTimeout(()=>{ // enfocando
          this._cantMatElement.nativeElement.focus();
      },0);

  }

  eliminar_materialDetalle(item:any){  
    Swal.fire({
      icon: 'info', allowOutsideClick: false,allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.bandejaAtencionService.set_delete_ParteDiario_Material(item.idParteDiario_material , this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
          var index = this.MaterialDetalle.indexOf( item );
          this.MaterialDetalle.splice( index, 1 );
          this.blank_Detalle_Material();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }



  // ------------------------------
  //  ------ FOTOS DE RECUPERO
  // ------------------------------


  get_parteDiario_fotos(){

    this.checkeadoAll = false;
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor' 
    })
    Swal.showLoading(); 
    this.detallefotos = [];
     this.bandejaAtencionService.get_parteDiario_fotos(this.idObraParteDiario_Global).subscribe((res:RespuestaServer)=>{
      Swal.close();
     if (res.ok) {            
          this.detallefotos = res.data;          
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }       
    })

  }



  marcarTodos(){
    if (this.detallefotos.length<=0) {
      return;
    }
    for (const obj of this.detallefotos) {
      if (this.checkeadoAll) {
        obj.checkeado = false;
      }else{
        obj.checkeado = true;
      }
    }
  }

  
  descargarFotosZip(){

    var flagMarcado =false;
    for (const obj of this.detallefotos) {
      if (obj.checkeado) {
        flagMarcado = true;
        break
      }
    }    
    if (flagMarcado ==false) {
      this.alertasService.Swal_alert('error','Por favor debe marcar al menos una Foto');
      return ;
    }
    const idFotos =  this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.detallefotos, 'idFoto');

    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Espere por favor'
    })
    Swal.showLoading(); 
    this.bandejaAtencionService.get_descargarZip_parteDiario_fotos( idFotos.join(), this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      Swal.close();
      console.log(res.data)
      if (res.ok) {           
        window.open(String(res.data),'_blank');
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }       
     }) 

  }


}


