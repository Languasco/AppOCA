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
 


declare const $:any;

@Component({
  selector: 'app-estado-evaluacion',
  templateUrl: './estado-evaluacion.component.html',
  styleUrls: ['./estado-evaluacion.component.css']
})
  
export class EstadoEvaluacionComponent implements OnInit {

  formParams : FormGroup;
  idUserGlobal = '';
  idProveedor_Global = 0;
  filtrarCab = '';
  estadoProveedoresCab :any [] = []; 

  constructor(private router:Router, private spinner: NgxSpinnerService, private alertasService : AlertasService, private localeService: BsLocaleService, private loginService: LoginService, private funcionGlobalServices : FuncionesglobalesService,private registerService : RegisterService) { 
      
      this.idUserGlobal = this.loginService.get_idUsuario();
      this.idProveedor_Global =  this.loginService.get_idProveedor(); 

    }

  ngOnInit(): void {
    this.mostrarInformacion_estadoProveedoresCab();
  }

  mostrarInformacion_estadoProveedoresCab(){
    this.spinner.show();
    this.registerService.get_Informacion_estadoProveedoresCab(this.idProveedor_Global,this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok) { 
        this.estadoProveedoresCab = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }  


}