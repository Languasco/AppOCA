import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import  {map } from 'rxjs/operators'
import { of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})

export class BandejaAtencionService {

  URL = environment.URL_API;

  locales :any[]= [];
  centrocostos :any[]= [];
 
  estados :any[]= [];
  inspectores :any[]= [];
  supervisores :any[]= [];
  baremos :any[]= [];
  actividades :any[]= [];
  almacenes :any[]= [];
 
 
  constructor(private http:HttpClient) { }

  get_locales( idUsuario: string){
    if (this.locales.length > 0) {
      return of( this.locales )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', idUsuario);
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.locales = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_centroCosto( idUsuario: string){
    if (this.centrocostos.length > 0) {
      return of( this.centrocostos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', idUsuario);
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.centrocostos = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_jefeCuadrilla(idcentroCosto:string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', idcentroCosto);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  } 

  get_estado(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_bandejaAtencion_Cab(idLocal:string, nroObra:string, idCuadrilla:string,  idEstado:string ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', idLocal + '|' + nroObra  + '|' + idCuadrilla + '|' + idEstado);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }


  get_inspector(){
    if (this.inspectores.length > 0) {
      return of( this.inspectores )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.inspectores = res.data;
                       return res.data;
                  }) );
    }
  } 


  get_supervisor(){
    if (this.supervisores.length > 0) {
      return of( this.supervisores )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.supervisores = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_baremos(){
    if (this.baremos.length > 0) {
      return of( this.baremos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '10');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.baremos = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_actividades(){
    if (this.actividades.length > 0) {
      return of( this.actividades )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '11');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.actividades = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_almacenes(idUsuario:string){
    if (this.almacenes.length > 0) {
      return of( this.almacenes )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '16');
      parametros = parametros.append('filtro', idUsuario);
  
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.almacenes = res.data;
                       return res.data;
                  }) );
    }
  } 

  set_ActualizarParteDiario( idParteDiario:string,inspector :string, supervisor : string, observacion : string , fechaLiquidacion:string,  idUsuario :string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', idParteDiario + '|' + inspector  + '|' + supervisor  + '|' + observacion  + '|' + fechaLiquidacion + '|' + idUsuario);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }
  
  
  set_cerrarParteDiario( idParteDiario:string, idUsuario :string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', idParteDiario  + '|' + idUsuario);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }

  set_save_ParteDiario_Baremo(idParteDiario :string, objParteDiario_Baremo:any,  idUsuario :string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', idParteDiario + '|' + objParteDiario_Baremo.idActividad  + '|' + objParteDiario_Baremo.idBaremo  + '|' + objParteDiario_Baremo.cantidadAprobada  + '|' + objParteDiario_Baremo.precioBaremo  + '|' + objParteDiario_Baremo.importe + '|' + idUsuario);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }

  set_update_ParteDiario_Baremo( objParteDiario_Baremo:any,  idUsuario :string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro', objParteDiario_Baremo.idParteDiario_baremo + '|' + objParteDiario_Baremo.cantidadAprobada  + '|' + objParteDiario_Baremo.precioBaremo  + '|' + objParteDiario_Baremo.importe + '|' + idUsuario);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }


  get_parteDiario_baremos(idObraParteDiario:string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '14');
    parametros = parametros.append('filtro', idObraParteDiario );
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }

  set_delete_ParteDiario_Baremo( idParteDiario_baremo:any,  idUsuario :string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', idParteDiario_baremo + '|' + idUsuario);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }



    // ------------------------------
  //  ------ MATERIAL DE RECUPERO
  // ------------------------------

  get_parteDiario_material(idObraParteDiario:string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '17');
    parametros = parametros.append('filtro', idObraParteDiario );
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }

  set_update_ParteDiario_Material( idParteDiario_articulo:string, cantidad:number,  idUsuario :string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '18');
    parametros = parametros.append('filtro',  idParteDiario_articulo  + '|' + cantidad + '|' + idUsuario);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }

  set_delete_ParteDiario_Material( idParteDiario_material :any,  idUsuario :string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '19');
    parametros = parametros.append('filtro', idParteDiario_material + '|' + idUsuario);
      return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }

    // ------------------------------
  //  ------ FOTOS DE PARTE DIARIO
  // ------------------------------


  get_parteDiario_fotos(idObraParteDiario:string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '20');
    parametros = parametros.append('filtro', idObraParteDiario );

    return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros})
  }

  get_descargarZip_parteDiario_fotos( idFotos:string , idUser :string){

    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '21');
    parametros = parametros.append('filtro',   idFotos + '|'+ idUser);

    return this.http.get( this.URL + 'BandejaAtencion' , {params: parametros});
  }


}
