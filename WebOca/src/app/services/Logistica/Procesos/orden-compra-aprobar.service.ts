import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RespuestaServer } from '../../../models/respuestaServer.models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
@Injectable({
  providedIn: 'root'
})
 


export class OrdenCompraAprobarService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }


  get_mostrarOrdenesCompra_AprobarCab(  nroOc:string, idUsuario :string) { 
     let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(nroOc) + '|' + idUsuario);
    return this.http.get( this.URL + 'OrdenCompraAprobar' , {params: parametros});
  }

  get_mostrarOrdenesCompra_AprobarDet(  idOrdenCompra:string, idUsuario :string) { 
    let parametros = new HttpParams();
   parametros = parametros.append('opcion', '2');
   parametros = parametros.append('filtro', String(idOrdenCompra) + '|' + idUsuario);
   return this.http.get<RespuestaServer>( this.URL + 'OrdenCompraAprobar' , {params: parametros});
 }

 
 set_aprobarRechazarOrdenCompra( idOrdenCompra:string, observacion :string, estadoOrdenCompra :string, idUsuario :string) { 
  let parametros = new HttpParams();
   parametros = parametros.append('opcion', '3');
   parametros = parametros.append('filtro', String(idOrdenCompra) + '|' + observacion + '|' + estadoOrdenCompra  + '|' + idUsuario);
   return this.http.get<RespuestaServer>( this.URL + 'OrdenCompraAprobar' , {params: parametros});
}
 
 

}