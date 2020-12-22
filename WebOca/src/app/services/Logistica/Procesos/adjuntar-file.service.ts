import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
@Injectable({
  providedIn: 'root'
})
export class AdjuntarFileService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }


  upload_fileOrdenCompra(idOrdenCompra:string, nroOc:string, tipoDoc:string, file:any, opcionModal:string, idUsuario:string, nroDoc:string, fecha:string, importe:string ) { 
    const formData = new FormData();   
    const importeTotal = (importe.length ==0) ? 0 : importe;

    formData.append('file', file);
    const filtro = idOrdenCompra + '|' + nroOc + '|' + tipoDoc + '|' + opcionModal+ '|' + idUsuario + '|' + nroDoc +  '|' + fecha + '|' + importeTotal;
    
    console.log(filtro)
    return this.http.post(this.URL + 'Uploads/post_archivosOrdenCompra?filtros=' + filtro, formData);

  }


}
