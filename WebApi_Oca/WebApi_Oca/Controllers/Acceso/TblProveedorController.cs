using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Entidades;
using Negocio.Acceso;
using Negocio.Proveedores.Procesos;
using Negocio.Resultados;
using Microsoft.VisualBasic;

namespace WebApi_Oca.Controllers.Acceso
{
    [EnableCors("*", "*", "*")]
    public class TblProveedorController : ApiController
    {
        private OCAEntities db = new OCAEntities();

        // GET: api/TblProveedor
        public IQueryable<Tbl_Proveedor> GetTbl_Proveedor()
        {
            return db.Tbl_Proveedor;
        }


        public object GetTbl_Proveedor(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Pais
                                where a.estado == 1
                                select new
                                {
                                    a.id_Pais,
                                    a.nombre_Pais
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idPais = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_Ciudad
                                where a.estado == 1 && a.id_Pais == idPais
                                select new
                                {
                                    a.id_Ciudad,
                                    a.nombre_Ciudad
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idPais = Convert.ToInt32(parametros[0].ToString());
                    int idCiudad = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_Departamento
                                where a.estado == 1 && a.id_Pais == idPais && a.id_Ciudad == idCiudad
                                select new
                                {
                                    a.id_Departamento,
                                    a.nombre_Dpto
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_GrupoTabla_Detalle
                                where a.id_GrupoTabla == idCab
                                select new
                                {
                                    a.id_GrupoDetalle,
                                    a.codigo_detalleTabla,
                                    a.descripcion_detalleTabla
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = (from a in db.Tbl_Bancos
                                where a.estado == "1"
                                select new
                                {
                                    a.id_Banco,
                                    a.nombre_Banco
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 6)
                {
                    res.ok = true;
                    res.data = (from a in db.Pub_Monedas
                                select new
                                {
                                    a.Pub_Mone_Codigo,
                                    a.Pub_Mone_Descripcion
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedor = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_Proveedor_Banco
                                join b in db.Tbl_Bancos on a.id_Banco equals b.id_Banco
                                join c in db.Pub_Monedas on a.Pub_Mone_Codigo equals c.Pub_Mone_Codigo
                                where a.id_Proveedor == idProveedor
                                select new
                                {
                                    a.id_Proveedor_Banco,
                                    a.id_Proveedor,
                                    tipoCuenta = (a.id_TipoCuenta == "C") ? "CORRIENTE" : "AHORROS",
                                    a.id_Banco,
                                    b.nombre_Banco,
                                    a.Pub_Mone_Codigo,
                                    c.Pub_Mone_Descripcion,
                                    a.id_TipoCuenta,
                                    a.nroCuenta,
                                    a.nroCCI,
                                    a.estado
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Proveedor_Banco = Convert.ToInt32(parametros[0].ToString());

                    tbl_Proveedor_Banco objReemplazar;
                    objReemplazar = db.tbl_Proveedor_Banco.Where(u => u.id_Proveedor_Banco == id_Proveedor_Banco).FirstOrDefault<tbl_Proveedor_Banco>();
                    objReemplazar.estado = "0";

                    db.Entry(objReemplazar).State = EntityState.Modified;

                    try
                    {
                        db.SaveChanges();
                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                    catch (DbUpdateConcurrencyException ex)
                    {
                        res.ok = false;
                        res.data = ex.InnerException.Message;
                        res.totalpage = 0;
                    }
                    resul = res;

                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedor = Convert.ToInt32(parametros[0].ToString());

                    Login_BL obj_negocio = new Login_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_ListadoArchivosProveedor(idProveedor);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedorArchivo = Convert.ToInt32(parametros[0].ToString());

                    Login_BL obj_negocio = new Login_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_Eliminar_archivoProveedor(idProveedorArchivo);
                    res.totalpage = 0;
                    resul = res;
                }

                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedor = Convert.ToInt32(parametros[0].ToString());
                    string idusuario = parametros[1].ToString();

                    Login_BL obj_negocio = new Login_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_enviandoInformacionProveedor(idProveedor, idusuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    string nroRuc = parametros[0].ToString();

                    if (db.Tbl_Proveedor.Count(e => e.nro_RUC == nroRuc) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    string nroRuc = parametros[0].ToString();
                    string idUsuario = parametros[1].ToString();

                    Tbl_Proveedor objProveedor = db.Tbl_Proveedor.Where(p => p.nro_RUC == nroRuc).SingleOrDefault();

                    Login_BL obj_negocio = new Login_BL();
                    obj_negocio.set_envioCorreo_registroProveedores(Convert.ToInt32(objProveedor.id_Proveedor), idUsuario);

                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedorArchivo = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    Login_BL obj_negocio = new Login_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_download_archivosImportados(idProveedorArchivo, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedor = Convert.ToInt32(parametros[0].ToString());

                    Login_BL obj_negocio = new Login_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_detalleProveedor(idProveedor);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedor = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    Login_BL obj_negocio = new Login_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_estadosProveedorCab(idProveedor, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                ///----- NUEVOS PROVEEDORES ----
                else if (opcion == 17)
                {
                    string[] parametros = filtro.Split('|');

                    string nroObra = parametros[0].ToString();
                    string idEstado = parametros[1].ToString();
                    string idCentroCostro = parametros[2].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_nuevosProveedoresCab(nroObra, idEstado, idCentroCostro);
                    res.totalpage = 0;

                    resul = res;
                }
                ////EVALUACION DE PROOVEEDORES ----
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');
                    int idProveedor = Convert.ToInt32(parametros[0].ToString());
                    string descripcion = parametros[1].ToString();
                    string opcionProceso = parametros[2].ToString();
                    string idUser = parametros[3].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    resul = obj_negocio.set_aprobarRechazar_proveedor(idProveedor, descripcion, opcionProceso, idUser);
                }
                else if (opcion == 19)
                {
                    string[] parametros = filtro.Split('|');
                    string idUser = parametros[0].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_centroCostro(idUser);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 20)
                {
                    string[] parametros = filtro.Split('|');
                    string idUser = parametros[0].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_tipoResultado(idUser);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 21)
                {
                    string[] parametros = filtro.Split('|');

                    string idCentroCostro = parametros[0].ToString();
                    string idTipoResultado = parametros[1].ToString();

                    string fechaIni = parametros[2].ToString();
                    string fechaFin = parametros[3].ToString();

                    string porcEvaluacion = parametros[4].ToString();
                    string idUsuario = parametros[5].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_visualizarPreliminar(idCentroCostro, idTipoResultado, fechaIni, fechaFin, porcEvaluacion, idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }

                else if (opcion == 22)
                {
                    string[] parametros = filtro.Split('|');

                    string idCentroCostro = parametros[0].ToString();
                    string idTipoResultado = parametros[1].ToString();
                    string fechaIni = parametros[2].ToString();
                    string fechaFin = parametros[3].ToString();

                    string proveedorMasivo = parametros[4].ToString();
                    string idUsuario = parametros[5].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();
 
                    resul = obj_negocio.set_generarEvaluacionProveedor( idCentroCostro, idTipoResultado, fechaIni, fechaFin, proveedorMasivo, idUsuario);
 
                }
                else if (opcion == 23)
                {
                    string[] parametros = filtro.Split('|');

                    int idEvaluacion_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_evaluacionProveedorCabDet(idEvaluacion_Cab, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 24)
                {
                    string[] parametros = filtro.Split('|');
                    string nroRuc = parametros[0].ToString();
                    string idUsuario = parametros[1].ToString();

                    Login_BL obj_negocio = new Login_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_buscandoRuc(nroRuc, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 25)
                {
                    string[] parametros = filtro.Split('|');

                    int idEvaluacion_Cab = Convert.ToInt32(parametros[0].ToString());
                    int idEvaluacionDet = Convert.ToInt32(parametros[1].ToString());
                    string idUsuario = parametros[1].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_evaluacionProveedorDet(idEvaluacion_Cab, idEvaluacionDet,  idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 26)
                {
                    string[] parametros = filtro.Split('|');

                    string idCentroCostro = parametros[0].ToString();
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    string estado = parametros[3].ToString();
                    string idUsuario = parametros[4].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_relacionEvaluacionesCab(idCentroCostro, fechaIni, fechaFin, estado, idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 27)
                {
                    string[] parametros = filtro.Split('|');

                    int idProveedor = Convert.ToInt32(parametros[0].ToString());
                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_nuevosProveedoresPDF(idProveedor);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 28)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Evaluacion_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();
                    resul = obj_negocio.GenerarReporte_evaluacionProveedor(id_Evaluacion_Cab, idUsuario); ;
                }
                else if (opcion == 29)
                {
                    string[] parametros = filtro.Split('|');
                     
                    string fechaIni = parametros[0].ToString();
                    string fechaFin = parametros[1].ToString();
                    string idUsuario = parametros[2].ToString();
                    string idCentroCosto = parametros[3].ToString();


                    Proveedores_BL obj_negocio = new Proveedores_BL();
                    resul = obj_negocio.GenerarReporte_incidencias(fechaIni, fechaFin, idUsuario, idCentroCosto); 
                }
                else if (opcion == 30)
                {
                    string[] parametros = filtro.Split('|');

                    int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();
                    resul = obj_negocio.GenerarReporte_cajaChica(idLiquidacionCaja_Cab, idUsuario); ;
                }
                else if (opcion == 31)
                {
                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_nuevosProveedores();
                    res.totalpage = 0;
                    resul = res;
                }

                else
                {
                    res.ok = false;
                    res.data = "Opcion seleccionada invalida";
                    res.totalpage = 0;

                    resul = res;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
                resul = res;
            }
            return resul;
        }

        public object PostTbl_Proveedor(Tbl_Proveedor Tbl_Proveedor)
        {
            Resultado res = new Resultado();
            try
            {
                Tbl_Proveedor.fecha_creacion = DateTime.Now;
                db.Tbl_Proveedor.Add(Tbl_Proveedor);
                db.SaveChanges();

                //----enviando informacion al procedimiento almacenado --
                Thread.Sleep(1000);
                Login_BL obj_negocio = new Login_BL();
                obj_negocio.set_proveedor_insertUpdate(Tbl_Proveedor.id_Proveedor, "I", Tbl_Proveedor.usuario_creacion.ToString());


                Thread.Sleep(1000);
                //------ encryptando la clave ----
                int idProv = Tbl_Proveedor.id_Proveedor;
                Pub_Usuarios objUsuario = db.Pub_Usuarios.Where(p => p.pub_dni == idProv.ToString()).SingleOrDefault();

                if (!String.IsNullOrEmpty(objUsuario.Pub_Usua_Clave)) {
                    string claveEncriptada = EncriptarClave(objUsuario.Pub_Usua_Clave, true);
                    obj_negocio.set_actualizarConstraseniaEncryptada(Tbl_Proveedor.id_Proveedor, claveEncriptada);
                }



                res.ok = true;
                res.data = Tbl_Proveedor.id_Proveedor; 
                res.totalpage = 0;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }

        public object PutTbl_Proveedor(int id, Tbl_Proveedor Tbl_Proveedor)
        {
            Resultado res = new Resultado();

            Tbl_Proveedor objReemplazar;
            objReemplazar = db.Tbl_Proveedor.Where(u => u.id_Proveedor == id).FirstOrDefault<Tbl_Proveedor>();

            objReemplazar.nro_RUC = Tbl_Proveedor.nro_RUC;

            objReemplazar.nro_RUC = Tbl_Proveedor.nro_RUC;
            objReemplazar.razonsocial = Tbl_Proveedor.razonsocial;
            objReemplazar.nombreComercial = Tbl_Proveedor.nombreComercial;

            objReemplazar.vtaProductos = Tbl_Proveedor.vtaProductos;
            objReemplazar.vtaServicios = Tbl_Proveedor.vtaServicios;
            objReemplazar.vtaotros = Tbl_Proveedor.vtaotros;
            objReemplazar.vtaotrosDetalle = Tbl_Proveedor.vtaotrosDetalle;

            objReemplazar.direcion = Tbl_Proveedor.direcion;
            objReemplazar.id_Pais = Tbl_Proveedor.id_Pais;
            objReemplazar.id_Ciudad = Tbl_Proveedor.id_Ciudad;
            objReemplazar.id_Departamento = Tbl_Proveedor.id_Departamento;
            objReemplazar.telefonoFijo = Tbl_Proveedor.telefonoFijo;
            objReemplazar.celular = Tbl_Proveedor.celular;
            objReemplazar.fax = Tbl_Proveedor.fax;
            objReemplazar.personalContacto_IG = Tbl_Proveedor.personalContacto_IG;
            objReemplazar.cargo_IG = Tbl_Proveedor.cargo_IG;
            objReemplazar.email_IG = Tbl_Proveedor.email_IG;

            objReemplazar.personalContacto_T = Tbl_Proveedor.personalContacto_T;
            objReemplazar.cargo_T = Tbl_Proveedor.cargo_T;
            objReemplazar.email_T = Tbl_Proveedor.email_T;
            objReemplazar.personalContacto_RLC = Tbl_Proveedor.personalContacto_RLC;
            objReemplazar.cargo_RLC = Tbl_Proveedor.cargo_RLC;
            objReemplazar.id_TipoDoc_RLC = Tbl_Proveedor.id_TipoDoc_RLC;
            objReemplazar.nro_RLC = Tbl_Proveedor.nro_RLC;
            objReemplazar.email_RLC = Tbl_Proveedor.email_RLC;

            objReemplazar.nroCuentaDetraccion = Tbl_Proveedor.nroCuentaDetraccion;
            objReemplazar.check1_UDP = Tbl_Proveedor.check1_UDP;
            objReemplazar.check2_UDP = Tbl_Proveedor.check2_UDP;
            objReemplazar.estado = Tbl_Proveedor.estado;
            objReemplazar.celular_T = Tbl_Proveedor.celular_T;

            objReemplazar.usuario_edicion = Tbl_Proveedor.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();

                //----enviando informacion al procedimiento almacenado --
                Thread.Sleep(1000);
                Login_BL obj_negocio = new Login_BL();
                obj_negocio.set_proveedor_insertUpdate(Tbl_Proveedor.id_Proveedor, "U", Tbl_Proveedor.usuario_creacion.ToString());

                res.ok = true;
                res.data = "OK";
                res.totalpage = 0;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
                res.totalpage = 0;
            }

            return res;
        }


        public static string EncriptarClave(string cExpresion, bool bEncriptarCadena)
        {
            string cResult = "";
            string cPatron = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwwyz";
            string cEncrip = "^çºªæÆöûÿø£Ø×ƒ¬½¼¡«»ÄÅÉêèï7485912360^çºªæÆöûÿø£Ø×ƒ¬½¼¡«»ÄÅÉêèï";


            if (bEncriptarCadena == true)
            {
                cResult = CHRTRAN(cExpresion, cPatron, cEncrip);
            }
            else
            {
                cResult = CHRTRAN(cExpresion, cEncrip, cPatron);
            }

            return cResult;

        }

        public static string CHRTRAN(string cExpresion, string cPatronBase, string cPatronReemplazo)
        {
            string cResult = "";

            int rgChar;
            int nPosReplace;

            for (rgChar = 1; rgChar <= Strings.Len(cExpresion); rgChar++)
            {
                nPosReplace = Strings.InStr(1, cPatronBase, Strings.Mid(cExpresion, rgChar, 1));

                if (nPosReplace == 0)
                {
                    nPosReplace = rgChar;
                    cResult = cResult + Strings.Mid(cExpresion, nPosReplace, 1);
                }
                else
                {
                    if (nPosReplace > cPatronReemplazo.Length)
                    {
                        nPosReplace = rgChar;
                        cResult = cResult + Strings.Mid(cExpresion, nPosReplace, 1);
                    }
                    else
                    {
                        cResult = cResult + Strings.Mid(cPatronReemplazo, nPosReplace, 1);
                    }
                }
            }
            return cResult;
        }




        // DELETE: api/TblProveedor/5
        [ResponseType(typeof(Tbl_Proveedor))]
        public IHttpActionResult DeleteTbl_Proveedor(int id)
        {
            Tbl_Proveedor tbl_Proveedor = db.Tbl_Proveedor.Find(id);
            if (tbl_Proveedor == null)
            {
                return NotFound();
            }

            db.Tbl_Proveedor.Remove(tbl_Proveedor);
            db.SaveChanges();

            return Ok(tbl_Proveedor);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_ProveedorExists(int id)
        {
            return db.Tbl_Proveedor.Count(e => e.id_Proveedor == id) > 0;
        }
    }
}