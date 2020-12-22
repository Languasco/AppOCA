 
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
 
import  {map } from 'rxjs/operators'
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})

export class ProveedorService {

  URL = environment.URL_API;
 
  constructor(private http:HttpClient) { } 
 
  get_mostrarIncidenciasCab(idcentroCosto: string, fechaIni : string, fechaFin : string, idUsuario : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro',  idcentroCosto + '|'+ fechaIni + '|'+ fechaFin  + '|'+ idUsuario  );

    return this.http.get( this.URL + 'tblProveedor_Incidencia' , {params: parametros});
  }


  set_save_incidencias(objIncidencia:any){
    return this.http.post(this.URL + 'tblProveedor_Incidencia', JSON.stringify(objIncidencia), httpOptions);
  }

  set_edit_incidencias(objIncidencia :any, id_Incidencia :number){
    return this.http.put(this.URL + 'tblProveedor_Incidencia/' + id_Incidencia , JSON.stringify(objIncidencia), httpOptions);
  }

  set_anular_incidenciasCab(id_Incidencia : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Incidencia));

    return this.http.get( this.URL + 'tblProveedor_Incidencia' , {params: parametros});
  }

  get_descargarIncidencias( fechaIni : string, fechaFin : string, idUsuario : string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '29');
    parametros = parametros.append('filtro',  String(fechaIni)  + '|' +  String(fechaFin) + '|' +  String(idUsuario) );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

 

}

