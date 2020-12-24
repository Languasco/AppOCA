
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

export class CajaChicaService {

  URL = environment.URL_API;
 
  constructor(private http:HttpClient) { } 
 
  get_mostrarCajaChicaCab(idcentroCosto: string, fechaIni : string, fechaFin : string, idEstado : number, idUsuario : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro',  idcentroCosto + '|'+ fechaIni + '|'+ fechaFin  + '|'+ idEstado + '|'+ idUsuario   );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }

  set_saveLiquidacionCab(idLiquidacionCajaCab : number, idCentroCosto :string, fechaI :string, fechaF :string, idUser : string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro',  String(idLiquidacionCajaCab)  + '|' + String(idCentroCosto)  + '|' + String(fechaI)  + '|' +  String(fechaF) + '|' +  String(idUser)  );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  } 

  set_save_LiquidacionDet(objLiquidacionDet:any){
    return this.http.post(this.URL + 'tblLiquidacion_Caja_Det', JSON.stringify(objLiquidacionDet), httpOptions);
  }

  set_update_LiquidacionDet(objLiquidacionDet :any, idLiquidacionCaja_Det :number){
    return this.http.put(this.URL + 'tblLiquidacion_Caja_Det/' + idLiquidacionCaja_Det , JSON.stringify(objLiquidacionDet), httpOptions);
  }

  get_mostrar_liquidacionesDet(idLiquidacionCaja_Cab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro',  String(idLiquidacionCaja_Cab)    );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }

  set_eliminaLiquidacionesDet(id_LiquidacionCaja_Det : number, idUser : string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro',  String(id_LiquidacionCaja_Det)   );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }


  get_datosLiquidacionesCabDet( idLiquidacionCaja_Cab: number  ,idUsuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro',  idLiquidacionCaja_Cab + '|'+ idUsuario   );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }


  
  get_documentosCajaChica(idLiquidacionCaja_Cab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro',  String(idLiquidacionCaja_Cab) );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }

  
  
  get_eliminarDocumentosCajaChica(id_Liquidacion_Archivo : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro',  String(id_Liquidacion_Archivo) );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }

  get_descargarDocumentosCajaChica(idDocumentoArchivo:number , idusuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro',  String(idDocumentoArchivo)  + '|' +  String(idusuario)  );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }
  
  set_enviarAprobarCajaChica(idLiquidacionCaja_Cab : number,  idUser : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro',  String(idLiquidacionCaja_Cab)  + '|' +  String(idUser)  );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }


  get_descargarCajaChica( id_LiquidacionCaja_Cab: number, idUsuario : string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '30');
    parametros = parametros.append('filtro',    String(id_LiquidacionCaja_Cab) + '|' +  String(idUsuario) );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  // -------------  APROBACION DE CAJA CHICA -------------
  //-----------------------------------------------------

  get_mostrar_aprobacionCajaChicaCab(idcentroCosto: string, fechaIni : string, fechaFin : string, idEstado : number, idUsuario : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro',  idcentroCosto + '|'+ fechaIni + '|'+ fechaFin  + '|'+ idEstado + '|'+ idUsuario   );

    return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros});
  }



}

