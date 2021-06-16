 
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

export class AprobarPagosService {

  URL = environment.URL_API;

  documentosIdentidades :any [] =[];
  tiposDocumentos :any [] =[];
  monedas :any [] =[];
  estados :any [] =[];
  
  constructor(private http:HttpClient) { }


  get_documentoIDentidad(){
    if (this.documentosIdentidades.length > 0) {
      return of( this.documentosIdentidades )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'AprobarPagos' , {params: parametros})
                 .pipe(map((res:any)=>{

                       this.documentosIdentidades = res.data;
                       return res.data;
                  }) );
    }
  } 


  
  get_tipoDocumento(){
    if (this.tiposDocumentos.length > 0) {
      return of( this.tiposDocumentos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'AprobarPagos' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tiposDocumentos = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_moneda(){
    if (this.monedas.length > 0) {
      return of( this.monedas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'AprobarPagos' , {params: parametros})
                 .pipe(map((res:any)=>{

                       this.monedas = res.data;
                       return res.data;
                  }) );
    }
  }

  get_estado(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'AprobarPagos' , {params: parametros})
                 .pipe(map((res:any)=>{
 
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  } 


 
  get_mostrarAprobacionPagos( { docIdentidad, tipoDocumento,  centroCosto,  moneda, facturaCancelada , Estado , docVencido }  , usuario :string, fechaCorte :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');

    const facturaC =  (facturaCancelada==true) ? 1 : 0 ;
    const documVencido =  (docVencido==true) ? 1 : 0 ;

    parametros = parametros.append('filtro',  docIdentidad  + '|' +  tipoDocumento  + '|' +   centroCosto     + '|' +  moneda  + '|' +  facturaC   + '|' +  Estado    + '|' +  usuario  + '|' +  documVencido + '|' +  fechaCorte );  
    return this.http.get( this.URL + 'AprobarPagos' , {params: parametros});


  }
  
  ///--- masivos por Post

  set_grabar_aprobacionPagosMasivos(idDocumentos :any, idusuario: string){
    const filtro =  idusuario ;
    return this.http.post(this.URL + 'AprobarPagos/post_aprobacionPagosMasivos?filtro=' + filtro, JSON.stringify(idDocumentos) ,  httpOptions);
  }

  // get_descargarDetalleMacro( {  docIdentidad, tipoDocumento,  centroCosto,  moneda, facturaCancelada , Estado, docVencido }  , usuario :string  ){
  //   let parametros = new HttpParams();
  //   parametros = parametros.append('opcion', '6');
  //   const facturaC =  (facturaCancelada==true) ? 1 : 0 ;
  //   const docVenc =  (docVencido==true) ? 1 : 0 ;

  //   parametros = parametros.append('filtro',  docIdentidad  + '|' +  tipoDocumento  + '|' +   centroCosto     + '|' +  moneda  + '|' +  facturaC   + '|' +  Estado    + '|' +  usuario + '|' +  docVenc  );

  //   return this.http.get( this.URL + 'AprobarPagos' , {params: parametros});
  // }

  //--- masivos por Post
   get_descargarDetalleMacro( {  docIdentidad, tipoDocumento,  centroCosto,  moneda, facturaCancelada , Estado, docVencido }  , usuario :string , fechaCorte :string  , idDocumentosMasivos :any ){

    const facturaC =  (facturaCancelada==true) ? 1 : 0 ;
    const docVenc =  (docVencido==true) ? 1 : 0 ;

    const filtro =   docIdentidad  + '|' +  tipoDocumento  + '|' +   centroCosto     + '|' +  moneda  + '|' +  facturaC   + '|' +  Estado    + '|' +  usuario + '|' +  docVenc  + '|' +  fechaCorte ;
    return this.http.post(this.URL + 'AprobarPagos/post_descargarDetalleMacro?filtro=' + filtro, JSON.stringify(idDocumentosMasivos) ,  httpOptions);
  }


  set_actualizando_flagPagos(idDocumentosMasivos :any, idusuario: string, idEstado: number){
    const filtro =   idusuario + '|' + idEstado ;
    return this.http.post(this.URL + 'AprobarPagos/post_actualizando_flagPagos?filtro=' + filtro,JSON.stringify(idDocumentosMasivos) ,  httpOptions);
  }


  get_descargarDetalle_aprobarPagos( {  docIdentidad, tipoDocumento,  centroCosto,  moneda, facturaCancelada , Estado, docVencido }  , usuario :string, fechaCorte :string    ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
 

    const facturaC =  (facturaCancelada==true) ? 1 : 0 ;
    const docVenc =  (docVencido==true) ? 1 : 0 ;

    parametros = parametros.append('filtro',  docIdentidad  + '|' +  tipoDocumento  + '|' +   centroCosto     + '|' +  moneda  + '|' +  facturaC   + '|' +  Estado    + '|' +  usuario + '|' +  docVenc  + '|' +  fechaCorte  );

    return this.http.get( this.URL + 'AprobarPagos' , {params: parametros});
  }
   
 




}

