
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
export class AprobarContabilidadService {

  URL = environment.URL_API;
  estados :any [] =[];
 
  constructor(private http:HttpClient) { } 

  get_estadosContabilidad(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'AprobarContabilidad' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_documentos_aprobarContabilidad(idcentroCosto: string, fechaIni : string, fechaFin : string, idEstado : string, idUsuario : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  idcentroCosto + '|'+ fechaIni + '|'+ fechaFin  + '|'+ idEstado + '|'+ idUsuario   );

    return this.http.get( this.URL + 'AprobarContabilidad' , {params: parametros});
  }
 
  set_seleccionarDocumentos(idDocumentosMasivos :any, idusuario: string, idEstado: number){
    const filtro =   idusuario + '|' + idEstado ;
    return this.http.post(this.URL + 'AprobarContabilidad/post_seleccionarDocumentos?filtro=' + filtro, JSON.stringify(idDocumentosMasivos) ,  httpOptions);
  }
   
  get_generar_excelSisCont(idDocumentosMasivos :any, idusuario: string){
    const filtro =   idusuario ;
    return this.http.post(this.URL + 'AprobarContabilidad/post_excelSistCont?filtro=' + filtro, JSON.stringify(idDocumentosMasivos) ,  httpOptions);
  }



}
