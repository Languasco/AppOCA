 
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

export class RegistroFacturasService {

  URL = environment.URL_API;
  estados :any [] =[];
  estadosEvaluacion :any [] =[];
  estadosCajaChica :any [] =[];
  estadosFacturacion :any [] =[];
  
  tiposDocumentosFiles :any [] =[];
  tiposDocumentosCajaChica :any [] =[];
  estadosEvaluacionAprobar :any [] =[];
  proveedores :any [] =[];
  
  constructor(private http:HttpClient) { }

  get_estado(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_estado_estadofacturacion(){
    if (this.estadosFacturacion.length > 0) {
      return of( this.estadosFacturacion )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '32');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estadosFacturacion = res.data;
                       return res.data;
                  }) );
    }
  }


  get_estado_evaluacion(){
    if (this.estadosEvaluacion.length > 0) {
      return of( this.estadosEvaluacion )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '14');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estadosEvaluacion = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_estado_AprobacionEvaluacion(){
    if (this.estadosEvaluacionAprobar.length > 0) {
      return of( this.estadosEvaluacionAprobar )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '37');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estadosEvaluacionAprobar = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_estado_cajaChica(){
    if (this.estadosCajaChica.length > 0) {
      return of( this.estadosCajaChica )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tbl_Liquidacion_Caja_Cab' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estadosCajaChica = res.data;
                       return res.data;
                  }) );
    }
  } 

  
  get_tipoDocumentoFile(){
    if (this.tiposDocumentosFiles.length > 0) {
      return of( this.tiposDocumentosFiles )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tiposDocumentosFiles = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_proveedores(idUsuario: string){
    if (this.proveedores.length > 0) {
      return of( this.proveedores )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '39');
      parametros = parametros.append('filtro', idUsuario);
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.proveedores = res.data;
                       return res.data;
                  }) );
    }
  } 



  get_tipoDocumento_cajaChica(){
    if (this.tiposDocumentosCajaChica.length > 0) {
      return of( this.tiposDocumentosCajaChica )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '31');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tiposDocumentosCajaChica = res.data;
                       return res.data;
                  }) );
    }
  } 
 
  get_ordenesCompraCab(fechaIni : string, fechaFin : string, idEstado :string, idProveedor  : number , nroOC:string, isProveedor: number , idCentroCostro:string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  fechaIni + '|'+ fechaFin + '|'+ idEstado  + '|'+ idProveedor   + '|'+ nroOC + '|'+ isProveedor  + '|'+ idCentroCostro    );
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

   
  get_documentosCab(idOrdenCompraCab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro',  String(idOrdenCompraCab) );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_documentosDet(idDocumentoCab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro',  String(idDocumentoCab) );

    console.log(idDocumentoCab)

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  set_saveDocumentosCab(idOrdenCompraCab : number, nroFactura :string, fechaD :string, idUser : string , idDocumentoCab : number, serieFactura :string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro',  String(idOrdenCompraCab)  + '|' + String(nroFactura)  + '|' + String(fechaD)  + '|' +  String(idUser) + '|' +  String(idDocumentoCab) + '|' +  String(serieFactura)  );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_archivosAdicionales(idDocumentoCab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro',  String(idDocumentoCab) );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  
  get_eliminarArchivosAdicionales(idDocumentoArchivo : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro',  String(idDocumentoArchivo) );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_descargarFileAdicionales(idDocumentoArchivo:number , idusuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro',  String(idDocumentoArchivo)  + '|' +  String(idusuario)  );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }
  
  get_detalleDocumentosOC(idOrdenCompraCab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro',  String(idOrdenCompraCab) );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  set_save_detalleDocumentos(listProgramacionDet : any, idUsuario:string){
    return this.http.post(this.URL + 'RegistroFacturas/set_guardandoDetalleDocumentos?idUsuario='+ idUsuario, JSON.stringify(listProgramacionDet), httpOptions);
  }

  set_editarDocumentoDet( id_Documento_Det : number , codigo : string,  cantidadIngresoAprobada:number  ,  precio : number, idUser : string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro',  String(id_Documento_Det)  + '|' + String(codigo)  + '|' + String(cantidadIngresoAprobada)  + '|' +  String(precio)   + '|' +  String(idUser) );

    console.log(parametros)

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  set_enviarAprobarDocumento(idDocumentoCab : number,  idUser : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro',  String(idDocumentoCab)  + '|' +  String(idUser)  );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_estadosDocumentosCab( fechaIni :string,   fechaFin :string,  nroOC :string,  estado :string,  idProveedor : number, idCentroCostro :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro',  String(fechaIni)  + '|' +  String(fechaFin) + '|' +  String(nroOC)  + '|' +  String(estado) + '|' +  String(idProveedor) + '|' +  String(idCentroCostro)     );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  
  set_save_detalleEvaluacionProveedor(objEvaluacionDet:any){
    return this.http.post(this.URL + 'tblProveedor_Evalucion_Det', JSON.stringify(objEvaluacionDet), httpOptions);
  }

  get_verificar_nroDocumento(idOrdenCompraCab: number, idProveedor:number,  serie:string , numero:string , usuario: string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', idOrdenCompraCab + '|' + idProveedor + '|' + serie + '|' + numero  + '|' + usuario );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros}).toPromise();
  }

  
  ///---------------------*---
  // APROBACION DE FACTURAS
 //////------------------------

   get_aprobacionFacturasCab( { nroFactura, nroOC,  Proveedor,  idFormaPago, idEstado, idCentroCostro  }  , usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '18');
    parametros = parametros.append('filtro',  nroFactura  + '|' +  nroOC  + '|' +   Proveedor  + '|' +  idFormaPago  + '|' +  idEstado   + '|' +  usuario   + '|' +  idCentroCostro  );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_aprobacionFacturas_masivo( codigosIdFact :string , usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '19');
    parametros = parametros.append('filtro',  codigosIdFact   + '|' +  usuario  );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_detalleFacturaCab(idFacturaCab_Global : number  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '20');
    parametros = parametros.append('filtro',   String(idFacturaCab_Global) );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  // caja chica
  get_aprobarDevolverFactura( idFacturaCab : number , opcionProceso: number, usuario :string, facturaCancelada : number  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '21');
    parametros = parametros.append('filtro',  idFacturaCab   + '|' +  opcionProceso + '|' +  usuario + '|' +  facturaCancelada    );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_listadoItems( idFacturaCab : number , usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '22');
    parametros = parametros.append('filtro',  idFacturaCab   + '|' +  usuario   );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  
  get_listadoDocumentosAdjuntos( idFacturaCab : number , usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '23');
    parametros = parametros.append('filtro',  idFacturaCab   + '|' +  usuario   );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }


  set_saveUpdate_cuentasContables( {id_Glosa, id_Documento, importeDocumento, Glosa, CtaGastos, CtaIGV, CtaxPagar, CtaDetraccion} , idUser : string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '27');
    parametros = parametros.append('filtro',  String(id_Glosa)  + '|' + String(id_Documento)  + '|' + String(importeDocumento)  + '|' +  String(Glosa)   + '|' +  String(CtaGastos)   + '|' +  String(CtaIGV)  + '|' +  String(CtaxPagar)  + '|' +  String(idUser) + '|' + String(CtaDetraccion)  );

    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

   get_datosContables( idFacturaCab : number , usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '28');
    parametros = parametros.append('filtro',  idFacturaCab   + '|' +  usuario   );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }


  set_saveUpdate_cuentasContables_cajaChica( {  id_LiquidacionCaja_Det  , Glosa, CtaGastos, CtaIGV, CtaxPagar } , idUser : string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '29');
    parametros = parametros.append('filtro',  String(id_LiquidacionCaja_Det)  + '|' +  String(Glosa)   + '|' +  String(CtaGastos)   + '|' +  String(CtaIGV)  + '|' +  String(CtaxPagar)  + '|' +  String(idUser));
 
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  set_saveUpdate_distribucionCentroCosto( {id_documento_cc, id_documento, idCentroCosto, total_importe, porcentaje} , idUser : string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '36');
    parametros = parametros.append('filtro',  String(id_documento_cc)  + '|' + String(id_documento)  + '|' + String(idCentroCosto)  + '|' +  String(total_importe)   + '|' +  String(porcentaje) + '|' +  String(idUser) );

 
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_detalleDistribucion_CCosto( idFacturaCab : number , usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '35');
    parametros = parametros.append('filtro',  idFacturaCab   + '|' +  usuario   );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  set_save_cuentaContable( valorCuentaContable : string, tipoCuentaContable :string,  idUser : string, descripcionCuentaContable : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '38');
    parametros = parametros.append('filtro',  String(valorCuentaContable)  + '|' + String(tipoCuentaContable) + '|' +  String(idUser) + '|' +  String(descripcionCuentaContable) ); 
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  get_DevolverFactura( idFacturaCab : number , motivoDevolucion: string, usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '40');
    parametros = parametros.append('filtro',  idFacturaCab   + '|' +  motivoDevolucion + '|' +  usuario );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }

  
  set_eliminarRegistroCuentaContable( idGlosa : number , usuario :string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '41');
    parametros = parametros.append('filtro',  idGlosa   + '|' +  usuario   );
  
    return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros});
  }


}

