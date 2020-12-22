import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
 


export class LoginService {

  usuarioLogeado:boolean=false;
  dataLogeado= [];
  isLogginUser$ = new Subject<any>();
  moduloSeleccionado$ = new Subject<number>();
  homeSeleccionado$ = new Subject<boolean>();

  idModulo=0;

   URL = environment.URL_API;
   constructor(private http:HttpClient) {
 
  }
         //-----creando el observable --

  updateLoginNameStatus(status: boolean, objMenu: any ) {
    var objSesion = {
      'status':status,
      'menu':objMenu
    }
    this.isLogginUser$.next(objSesion);
  }  

  get_iniciarSesion(nombreUsuario:string , contrasenia:string){    
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', nombreUsuario + '|' + contrasenia );

    return this.http.get( this.URL + 'Login' , {params: parametros})
               .pipe(map((res:any)=>{       
                    if (res.ok ==true || res.ok == 'true' ) {        
               
                      let infoUser = {
                        id_usuario:res.data.id_usuario,                        
                        nombre_usuario : res.data.nombre_usuario,
                        id_proveedor:res.data.id_proveedor,
                        // id_perfil:res.data.id_perfil,
                         menu_permisos : res.data.menuPermisos,
                        // menu_eventos : res.data.menuEventos
                      }                      
                      this.guardarSesion(infoUser);

                      return res;
                    }else{
                      return res;
                    }
               }));               
  }

  public guardarSesion(data:any){
    this.usuarioLogeado =true;
    localStorage.setItem('data_OCA_usuario', JSON.stringify(data));
    this.updateLoginNameStatus(true,data.menu_permisos); 
  }

  leerSesion(){    
   // si es que existe una  variable creada en el local storage, leemos su valor
    if (localStorage.getItem('data_OCA_usuario')) { 
      this.usuarioLogeado =true;
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_OCA_usuario"));
      // xxthis.updateLoginNameStatus(true,this.dataLogeado['menu_permisos'] );
    }else{  
      this.usuarioLogeado =false;
      this.dataLogeado = [];
      ///xx this.updateLoginNameStatus(false,'');
    }
  } 

  logOut(){
    this.usuarioLogeado= false;
    localStorage.removeItem('data_OCA_usuario');
    localStorage.removeItem('Oca_idModulo');
  }

  getSession(){
    if (localStorage.getItem('data_OCA_usuario')) { 
      return true;
    }else{
      return false;
    }
  }
  getSessionNombre(){
    if (localStorage.getItem('data_OCA_usuario')) { 
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_OCA_usuario"));
      return this.dataLogeado['nombre_usuario'];
    }else{
      return "Sin-nombre";
    }
  }

  getSessionMenu(){
    if (localStorage.getItem('data_OCA_usuario')) { 
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_OCA_usuario"));
      return this.dataLogeado['menu_permisos'];
    }else{
      return null;
    }
  }
 
  estadoAutentificado(){
    this.leerSesion();
    return  this.usuarioLogeado;
  }

  get_idUsuario():string{
    if (localStorage.getItem('data_OCA_usuario')) { 
       this.dataLogeado =  JSON.parse(localStorage.getItem("data_OCA_usuario"));
      return this.dataLogeado['id_usuario'];
    }else{
      return '';
    }
  }

  get_idPerfil():number{
    if (localStorage.getItem('data_OCA_usuario')) { 
       this.dataLogeado =  JSON.parse(localStorage.getItem("data_OCA_usuario"));
      return this.dataLogeado['id_perfil'];
    }else{
      return 0;
    }
  }

  getEventosMenu(modulo:number){ 
    if (localStorage.getItem('data_OCA_usuario')) { 
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_OCA_usuario"));
      const listEventos = this.dataLogeado['menu_eventos'].filter(evento => evento.id_opcion == modulo);
      return listEventos
    }else{
      return null;
    }
  }

  getModulos(){ 
    if (localStorage.getItem('data_OCA_usuario')) { 
      const listModulos = this.dataLogeado['menu_permisos'].map(modulo =>{
          return  { id_opcion : modulo.id_opcion, nombre_principal:  modulo.nombre_principal , urlmagene_principal : modulo.urlmagene_principal}
      });
      return listModulos ;
    }else{
      return null;
    }
  }

  getMenu_Modulos(idModulo){ 
    if (localStorage.getItem('data_OCA_usuario')) {  
      
      //-----almacenando el idModulo elegido ---
      localStorage.setItem('Oca_idModulo', idModulo );
      //----- Fin almacenando el idModulo elegido ---
    
      const listMenus =  this.dataLogeado['menu_permisos'].filter(modulo => modulo.id_opcion == idModulo).map( menuItem => menuItem['listMenu'] )    ;
      return listMenus ;

    }else{

      this.idModulo = 0;
      return null;
      
    }
  }

  getIdModulo(){
    if (localStorage.getItem('Oca_idModulo')) {  
      this.idModulo = JSON.parse(localStorage.getItem("Oca_idModulo"));
      return this.idModulo ;
    }else{
      this.idModulo = 0;
      return this.idModulo ;
    }
  }

  get_idProveedor():number{
    if (localStorage.getItem('data_OCA_usuario')) { 
       this.dataLogeado =  JSON.parse(localStorage.getItem("data_OCA_usuario"));
      return this.dataLogeado['id_proveedor'];
    }else{
      return 0;
    }
  }

}
