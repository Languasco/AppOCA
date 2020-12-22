import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
 
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  modulos:any [] =[];
  constructor(private  loginService :LoginService, private router:Router) {       
  }
  ngOnInit(): void {   
    this.loginService.homeSeleccionado$.next(true);
    this.modulos =  this.loginService.getModulos();
  }

  mostrando_MenuModulo(modulo:any){
    this.loginService.moduloSeleccionado$.next(modulo.id_opcion);
    this.router.navigateByUrl('/inicio');
  }

}
