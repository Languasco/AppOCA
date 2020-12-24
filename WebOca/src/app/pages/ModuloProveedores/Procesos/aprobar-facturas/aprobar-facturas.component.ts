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
import { ProveedorService } from '../../../../services/Proveedor/Procesos/proveedor.service';
declare const $:any;


@Component({
  selector: 'app-aprobar-facturas',
  templateUrl: './aprobar-facturas.component.html',
  styleUrls: ['./aprobar-facturas.component.css']
})
 
export class AprobarFacturasComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal : string = '' ;
  flag_modoEdicion :boolean =false;

  documentosCab :any[]=[]; 
  formaPagos  :any[]=[]; 
  estados  :any[]=[]; 
  filtrarCab = "";
  objFacturacionGlobal:any ={};

  idFacturaCab_Global = 0;

  checkeadoAll = false;
    //-TAB control
    tabControlDetalle: string[] = ['LISTA ITEMS','LISTA DOCUMENTOS ADJUNTOS',]; 
    selectedTabControlDetalle :any;

  listaItems :any[]=[]; 
  listaDocumentos :any[]=[]; 
 
  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService, private registroFacturasService : RegistroFacturasService ) { 
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0]; 
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      nroFactura : new FormControl(''),
      nroOC : new FormControl(''),
      Proveedor : new FormControl(''),
      idFormaPago : new FormControl('0'),
      idEstado : new FormControl('0'),
 
     }) 
 }  

 getCargarCombos(){ 
  this.spinner.show(); 
  combineLatest([this.registerService.get_formaPagos() , this.registerService.get_estadosAprobarFacturas()])
   .subscribe(([ _formaPagos, _estados ]) =>{
      this.spinner.hide(); 
        this.formaPagos = _formaPagos;
        this.estados = _estados;
    })
}

 mostrarInformacion(){ 
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

      if ( this.idFacturaCab_Global > 0) {
        this.obtenerDetalleFacturacion();
        this.mostrarListaItems();
        this.mostrarListaDocumentosAdjuntos();
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

            console.log(res);
            if (res.ok==true) {        

              if (res.data.length > 0) {
                this.objFacturacionGlobal = res.data[0]; 
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
      this.registroFacturasService.get_aprobarDevolverFactura( this.idFacturaCab_Global , opcionProceso , this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
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





}
