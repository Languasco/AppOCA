
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

export class RegisterService {

  URL = environment.URL_API;

  paises :any[]= [];
  ciudades :any[]= [];
 
  estados :any[]= [];
  departamentos :any[]= [];
  tipoDocumentos :any[]= [];
  tipoArchivos :any[]= [];

  bancos :any[]= [];
  monedas :any[]= [];
  almacenes :any[]= [];
  centroCostro:any[]= [];
  tipoResultado:any[]= [];
  formaPagos:any[]= [];
  estadosAprobarFacturas:any[]= [];
  
  constructor(private http:HttpClient) { }

  get_estadosProveedorNuevo(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '31');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  } 
 
  get_paises(){
    if (this.paises.length > 0) {
      return of( this.paises )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.paises = res.data;
                       return res.data;
                  }) );
    }
  } 

   get_ciudades(idPais:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', String(idPais));
    return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
  } 


  get_departamentos(idPais:number, idCiudad:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(idPais)  + '|' + String(idCiudad) );
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
  } 


  get_tipoDocumentos(){
    if (this.tipoDocumentos.length > 0) {
      return of( this.tipoDocumentos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '3');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tipoDocumentos = res.data;
                       return res.data;
                  }) );
    }
  }


  get_bancos(){
    if (this.bancos.length > 0) {
      return of( this.bancos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.bancos = res.data;
                       return res.data;
                  }) );
    }
  }

  get_monedas(){
    if (this.monedas.length > 0) {
      return of( this.monedas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.monedas = res.data;
                       return res.data;
                  }) );
    }
  }

  get_tipoArchivos(){
    if (this.tipoArchivos.length > 0) {
      return of( this.tipoArchivos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '4');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tipoArchivos = res.data;
                       return res.data;
                  }) );
    }
  }

  
  get_centroCosto(){
    if (this.centroCostro.length > 0) {
      return of( this.centroCostro )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '19');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.centroCostro = res.data;
                       return res.data;
                  }) );
    }
  }

  get_tipoResultado(){
    if (this.tipoResultado.length > 0) {
      return of( this.tipoResultado )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '20');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tipoResultado = res.data;
                       return res.data;
                  }) );
    }
  }

  get_formaPagos(){
    if (this.formaPagos.length > 0) {
      return of( this.formaPagos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '16');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.formaPagos = res.data;
                       return res.data;
                  }) );
    }
  }
  get_estadosAprobarFacturas(){
    if (this.estadosAprobarFacturas.length > 0) {
      return of( this.estadosAprobarFacturas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '17');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'RegistroFacturas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estadosAprobarFacturas = res.data;
                       return res.data;
                  }) );
    }
  }

 

  set_save_registroProveedor(objProveedor:any){
    return this.http.post(this.URL + 'TblProveedor', JSON.stringify(objProveedor), httpOptions);
  }

  
  set_edit_registroProveedor(objProveedor:any, id_proveedor :number){
    return this.http.put(this.URL + 'TblProveedor/' + id_proveedor , JSON.stringify(objProveedor), httpOptions);
  }


  set_save_registroBancos(objBancos:any){
    return this.http.post(this.URL + 'tblProveedor_Banco', JSON.stringify(objBancos), httpOptions);
  }

  set_edit_registroBancos(objBancos:any, id_Proveedor_Banco :number){
    return this.http.put(this.URL + 'tblProveedor_Banco/' + id_Proveedor_Banco , JSON.stringify(objBancos), httpOptions);
  }

  get_proveedorBancos(idProveedor:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro', String(idProveedor));
    return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
  } 

  
  get_anularProveedorBancos(idProveedorBanco:number){ 

    console.log(idProveedorBanco)
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', String(idProveedorBanco));
    return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
  }

  upload_fileProveedorArchivos(idProveedor:number, file:any, tipDoc : number, nombreArchivo:string,  idusuario : string) {
 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro = idProveedor + '|' + tipDoc + '|' + nombreArchivo + '|' + idusuario ;

    return this.http.post(this.URL + 'Uploads/post_archivosProveedor?filtros=' + filtro, formData).toPromise();
  }

  get_buscarDetalleArchivos_proveedor(idProveedor :number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro',  String(idProveedor)  );

    return this.http.get( this.URL + 'TblProveedor' , { params: parametros });
  }

  delete_detalleArchivo_proveedor(idProveedorArchivo:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro',  String(idProveedorArchivo) );

    return this.http.get( this.URL + 'TblProveedor' , { params: parametros });
  }

  set_enviandoInfomacionProveedor(idProveedor:number, idUsuario:string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro',  String(idProveedor) + '|' +  idUsuario);

    return this.http.get( this.URL + 'TblProveedor' , { params: parametros });
  }

  get_verificar_nroRuc(nroRuc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', nroRuc);

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros}).toPromise();
  }

  set_verificacionRuc_envioCorreo(nroRuc:string, idUsuario:string){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro',  String(nroRuc) + '|' +  idUsuario);

    return this.http.get( this.URL + 'TblProveedor' , { params: parametros });
  }

  get_descargarFileProveedor(idProveedorArchivo:number, idUser: string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '14');
    parametros = parametros.append('filtro',  idProveedorArchivo + '|'+ idUser );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  get_detalleProveedor(idProveedor:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', String(idProveedor));
    return this.http.get( this.URL + 'TblProveedor' , {params: parametros})
  } 

  get_Informacion_estadoProveedoresCab(idProveedor:number, idUser: string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '16');
    parametros = parametros.append('filtro',  idProveedor + '|'+ idUser );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  get_Informacion_nuevosProveedoresCab({nroObra, idEstado}){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '17');
    parametros = parametros.append('filtro',  nroObra + '|'+ idEstado );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }




  set_aprobarRechazarProveedoresNuevos(idProveedor:number, descripcionRechazo :string , opcion: string, idUsuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '18');
    parametros = parametros.append('filtro',  idProveedor + '|'+ descripcionRechazo  + '|'+ opcion  + '|'+ idUsuario );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});

  }


  get_informacion_evaluacionProveedores( idCentroCostro:string , idTipoResultado : string, fechaIni :string , fechaFin:string , porcEvaluacion :string, idUsuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '21');
    parametros = parametros.append('filtro',  idCentroCostro + '|'+ idTipoResultado  + '|'+ fechaIni + '|'+ fechaFin + '|'+ porcEvaluacion + '|'+ idUsuario   );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  set_generarEvaluacionProveedor( idCentroCostro:string , idTipoResultado : string, fechaIni :string , fechaFin:string , proveedorMasivo :string, idUsuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '22');
    parametros = parametros.append('filtro',  idCentroCostro + '|'+ idTipoResultado  + '|'+ fechaIni + '|'+ fechaFin + '|'+ proveedorMasivo + '|'+ idUsuario   );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  
  get_evaluacionProveedorCabDet( idEvaluacion_Cab: number  ,idUsuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '23');
    parametros = parametros.append('filtro',  idEvaluacion_Cab + '|'+ idUsuario   );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  get_consultarRucProveedor( nroRuc:string ,idUsuario:string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '24');
    parametros = parametros.append('filtro',  nroRuc   + '|'+ idUsuario   );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  set_eliminarEvaluacionDet( id_Evaluacion_Det:number  , idUsuario:string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro',  id_Evaluacion_Det   + '|'+ idUsuario   );

    return this.http.get( this.URL + 'tblProveedor_Evalucion_Det' , {params: parametros});
  }

  set_editarValorEvaluacionDet(opcionCampo :string, valor :string, id_Evaluacion_Det:number , idUsuario:string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  opcionCampo   + '|'+  valor   + '|'+  id_Evaluacion_Det    + '|'+  idUsuario  );
    return this.http.get( this.URL + 'tblProveedor_Evalucion_Det' , {params: parametros});
  }

  set_enviarAprobarEvaluacionCab(idEvaluacionCab : number,  idUser : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro',  String(idEvaluacionCab)  + '|' +  String(idUser)  );

    return this.http.get( this.URL + 'tblProveedor_Evalucion_Det' , {params: parametros});
  }

  // LISTADO DE EVALUACIONES

  get_listaEvaluacionesCab(idCentroCostro:string , fechaIni :string , fechaFin:string , idEstado :string, idUsuario:string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '26');
    parametros = parametros.append('filtro',  idCentroCostro + '|'+ fechaIni + '|'+ fechaFin + '|'+ idEstado + '|'+ idUsuario   );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  set_anularEvaluacionesCab(id_Evaluacion_Cab: number, idUsuario:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro',  String(id_Evaluacion_Cab) + '|'+ idUsuario    );

    return this.http.get( this.URL + 'tblProveedor_Evalucion_Det' , { params: parametros });
  }
  set_AprobarRechazarEvaluacionCab(idEvaluacionCab : number, opcion:string, idUser : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro',  String(idEvaluacionCab)  + '|' +  String(opcion)  + '|' +  String(idUser)  );

    return this.http.get( this.URL + 'tblProveedor_Evalucion_Det' , {params: parametros});
  }
 
  get_nuevosProveedores_pdf( idProveedor:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '27');
    parametros = parametros.append('filtro',  String(idProveedor)  );

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }

  get_descargarEvaluacionProveedor( id_Evaluacion_Cab:number, idUser : string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '28');
    parametros = parametros.append('filtro',  String(id_Evaluacion_Cab)  + '|' +  String(idUser));

    return this.http.get( this.URL + 'TblProveedor' , {params: parametros});
  }




}
