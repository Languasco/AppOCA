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
  selector: 'app-estado-facturas',
  templateUrl: './estado-facturas.component.html',
  styleUrls: ['./estado-facturas.component.css']
})
 
export class EstadoFacturasComponent implements OnInit {

  formParams : FormGroup;
  formParamsFiltro : FormGroup;

  idUserGlobal = '';
  idProveedor_Global = 0;
  filtrarCab = '';
  documentosCab :any [] = []; 
  estados:any [] = []; 
  centroCostro:any [] = []; 

  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,  private registroFacturasService : RegistroFacturasService, private registerService : RegisterService) { 
      
      this.idUserGlobal = this.loginService.get_idUsuario();
      this.idProveedor_Global =  this.loginService.get_idProveedor(); 

    }

  ngOnInit(): void { 
    this.getCargarCombos();
    this.inicializarFormularioFiltro(); 
  }

  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({ 
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      nroOC : new FormControl(''),
      idEstado : new FormControl('0'),
      idCentroCostro: new FormControl('0')
     }) 
  }

  getCargarCombos(){ 
    this.spinner.show(); 
    combineLatest([ this.registroFacturasService.get_estado_estadofacturacion(), this.registerService.get_centroCosto(this.idUserGlobal)])
     .subscribe(([ _estados, _centroCostro]) =>{
        this.spinner.hide(); 
          this.estados = _estados; 
          this.centroCostro =_centroCostro;
      })
  }


  mostrarInformacion_estadoProveedoresCab(){    
    if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
      return 
    } 
    if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
      return 
    } 
    if (this.formParamsFiltro.value.idEstado == '0' || this.formParamsFiltro.value.idEstado == 0 ) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Estado..');
      return 
    } 
       
    const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
    const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);

    this.spinner.show();
    this.registroFacturasService.get_estadosDocumentosCab(  fechaIni , fechaFin , this.formParamsFiltro.value.nroOC , this.formParamsFiltro.value.idEstado, this.idProveedor_Global , this.formParamsFiltro.value.idCentroCostro).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok) { 
        this.documentosCab = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }  


}