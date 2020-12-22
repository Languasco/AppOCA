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
export class CombosService {


  URL = environment.URL_API;
  tiposOrdenCompra :any[]= [];
  estados :any[]= [];
  tiposDocumento :any[]= [];

  constructor(private http:HttpClient) { }


  get_tipoOrdenCompra(){
    if (this.tiposOrdenCompra.length > 0) {
      return of( this.tiposOrdenCompra )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'OrdenCompraAdjuntar' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tiposOrdenCompra = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_estado(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'OrdenCompraAdjuntar' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_tipoDocumento(){
    if (this.tiposDocumento.length > 0) {
      return of( this.tiposDocumento )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'OrdenCompraAdjuntar' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tiposDocumento = res.data;
                       return res.data;
                  }) );
    }
  } 


}
