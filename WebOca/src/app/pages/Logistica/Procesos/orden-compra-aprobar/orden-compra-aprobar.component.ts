 

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { BsLocaleService, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
 import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FuncionesglobalesService } from '../../../../services/funciones/funcionesglobales.service'; 
import { AlertasService } from '../../../../services/alertas/alertas.service'; 
import { LoginService } from '../../../../services/login/login.service';
 
import { RespuestaServer } from '../../../../models/respuestaServer.models';
import { OrdenCompraAprobarService } from '../../../../services/Logistica/Procesos/orden-compra-aprobar.service';

declare var $:any;
@Component({
  selector: 'app-orden-compra-aprobar',
  templateUrl: './orden-compra-aprobar.component.html',
  styleUrls: ['./orden-compra-aprobar.component.css']
})
  
export class OrdenCompraAprobarComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParamsFile : FormGroup;
  
  idUserGlobal : string=''; 
  NroOcGlobal: string=''; 
  flagImportar=false;
  ordenesCompraCab:any [] = [];
  ordenesCompraDet:any [] = [];
  filtrarOrdenCompra: string=''; 

  idOrdenCompra_Global : string=''; 
  idtipoOC_Global = 0; 
  observacionOrdenCompra: string=''; 

  objCabecera:any; 
 
  constructor(private alertasService : AlertasService, private localeService: BsLocaleService, private spinner: NgxSpinnerService, private loginService: LoginService,
              private funcionGlobalServices : FuncionesglobalesService, private ordenCompraAprobarService: OrdenCompraAprobarService)   {
            this.idUserGlobal = this.loginService.get_idUsuario(); 
  }
 
  ngOnInit(): void { 
   this.inicializarFormularioFiltro(); 

   }

  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      // tipoOc: new FormControl('0'), 
      // fecha_ini : new FormControl(new Date()),
      // fecha_fin : new FormControl(new Date()), 
      // estado : new FormControl('0'), 
      nroOc : new FormControl(''), 
     }) 
  } 

mostrarInformacion(){   
    this.spinner.show();
    this.ordenesCompraCab = [];
    this.ordenesCompraDet = [];
    this.idOrdenCompra_Global = '';

    this.ordenCompraAprobarService.get_mostrarOrdenesCompra_AprobarCab( this.formParamsFiltro.value.nroOc, this.idUserGlobal  ).subscribe((res:RespuestaServer)=>{            
      this.spinner.hide();
      if (res.ok==true) {         
        this.ordenesCompraCab = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  getMostrandoDetalle( objOrdenCompra){  

    this.objCabecera = objOrdenCompra;
    this.idOrdenCompra_Global = objOrdenCompra.idOrdenCompra;
    this.NroOcGlobal  = objOrdenCompra.nroOC;

    if (   this.idOrdenCompra_Global == '' ||   this.idOrdenCompra_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la informacion de la Orden Compra, por favor actualizar la pagina..');  
      return;
    } 

    Swal.fire({
      icon: 'info', allowOutsideClick: false,  allowEscapeKey: false,  text: 'Espere por favor'
    })
    Swal.showLoading();
    this.ordenCompraAprobarService.get_mostrarOrdenesCompra_AprobarDet(  this.idOrdenCompra_Global, this.idUserGlobal ).subscribe((res)=>{            
      Swal.close()
      if (res.ok==true) {         
        this.ordenesCompraDet = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
  
  cerrarModal_Aprobar(){
    setTimeout(()=>{ // 
      $('#modalRechazar').modal('hide');    
    },0);
  }

  abrirModal_Aprobar(){
    this.observacionOrdenCompra = '';
    setTimeout(()=>{ // 
      $('#modalRechazar').modal('show');
    },0);
  }
 
  aprobarRechazarOrdenCompra(opcion:string){
  

    if ( this.idOrdenCompra_Global == '' ||     this.idOrdenCompra_Global == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la informacion de la Orden Compra, por favor actualizar la pagina..');  
      return;
    } 

    const estadoOrdenCompra = (opcion =='A') ?  "036" :  "45";
    let mensajeTitulo = '';
    if (opcion =='A') {  ////-aprobar
      mensajeTitulo =  'Esta seguro de aprobar';
    }
    if (opcion =='R') {  ////-rechazar
      mensajeTitulo = 'Esta seguro de rechazar';
    }

    this.alertasService.Swal_Question('Sistemas', mensajeTitulo)
        .then((res)=>{
            if (res.value) {

              Swal.fire({
                icon: 'info', allowOutsideClick: false,  allowEscapeKey: false,  text: 'Espere por favor'
              })
              Swal.showLoading();
              this.ordenCompraAprobarService.set_aprobarRechazarOrdenCompra( this.idOrdenCompra_Global,  this.observacionOrdenCompra, estadoOrdenCompra, this.idUserGlobal ).subscribe((res)=>{            
                Swal.close()
                if (res.ok==true) {         
                  this.alertasService.Swal_Success("Proceso realizado correctamente..")

                  if (opcion =='R') {  ////-rechazar
                    setTimeout(()=>{ // 
                      $('#modalRechazar').modal('hide');    
                    },0);
                  }

                  this.ordenesCompraDet = [];
                  this.idOrdenCompra_Global = '';
                  this.NroOcGlobal = '';
                  var index = this.ordenesCompraCab.indexOf( this.objCabecera );
                  this.ordenesCompraCab.splice( index, 1 );

                }else{
                  this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                  alert(JSON.stringify(res.data));
                }
              })

            }else{

            }
        })


    
  }





}
