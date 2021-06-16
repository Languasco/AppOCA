import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
 

@Injectable({
  providedIn: 'root'
})
export class  UploadService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }
 
  upload_documentoCab(file:any, idDocumentoCab: number ,idusuario : string) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idusuario  + '|' + idDocumentoCab
    return this.http.post(this.URL + 'Uploads/post_archivoCabProveedor?filtros=' + filtro, formData);
  }

  upload_documentosAdicionalesCab(file:any, idDocumentoCab: number ,tipoDoc : number, nroDoc :string, fechaD :string, idusuario : string, serieDoc:string ) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idDocumentoCab  + '|' + tipoDoc + '|' + nroDoc + '|' + fechaD + '|' + idusuario + '|' + serieDoc;
    return this.http.post(this.URL + 'Uploads/post_archivosAdicionalesCabProveedor?filtros=' + filtro, formData);
  }

  upload_excelCajaChicaxx(file:any, idLiquidacionCaja_Cab : number, idusuario : string) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idLiquidacionCaja_Cab  + '|' + idusuario ; 
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_cajaChica?filtros=' + filtro, formData);
  }

  upload_excelCajaChica(file:any, idLiquidacionCaja_Cab : number, idusuario : string) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idLiquidacionCaja_Cab  + '|' + idusuario ; 
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_cajaChica?filtros=' + filtro, formData);
  }

  upload_documentosCajaChica(file:any, idLiquidacionCaja_Cab: number , idusuario : string  ) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idLiquidacionCaja_Cab + '|' + idusuario ;
    return this.http.post(this.URL + 'Uploads/post_archivosDocumentos_cajaChica?filtros=' + filtro, formData);
  }

  upload_documentosCajaChica_Det(file:any, idLiquidacionCaja_Det: number , idusuario : string  ) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idLiquidacionCaja_Det + '|' + idusuario ;
    return this.http.post(this.URL + 'Uploads/post_archivosDocumentos_cajaChica_Det?filtros=' + filtro, formData);
  }





}
