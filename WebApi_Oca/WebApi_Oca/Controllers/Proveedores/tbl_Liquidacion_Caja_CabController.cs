using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Entidades;
using Negocio.Proveedores.Procesos;
using Negocio.Resultados;

namespace WebApi_Oca.Controllers.Proveedores
{
    [EnableCors("*", "*", "*")]
    public class tbl_Liquidacion_Caja_CabController : ApiController
    {
        private OCAEntities db = new OCAEntities();

        // GET: api/tbl_Liquidacion_Caja_Cab
        public IQueryable<tbl_Liquidacion_Caja_Cab> Gettbl_Liquidacion_Caja_Cab()
        {
            return db.tbl_Liquidacion_Caja_Cab;
        }


        public object Gettbl_Liquidacion_Caja_Cab(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            CajaChica_BL obj_negocio = new CajaChica_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    string idCentroCosto = parametros[0].ToString();
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    string idEstado = parametros[3].ToString();
                    string IdUsuarios = parametros[4].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_liquidacionCajaChicaCab(idCentroCosto, fechaIni, fechaFin, idEstado, IdUsuarios);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_estadoCajaChica();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacionCajaCab = Convert.ToInt32(parametros[0].ToString());
                    string idCentroCosto = parametros[1].ToString();
                    string fechaI = parametros[2].ToString();
                    string fechaF = parametros[3].ToString();
                    string idUser = parametros[4].ToString();
 
                    res.ok = true;
                    res.data = obj_negocio.set_grabarLiquidacionCab( idLiquidacionCajaCab, idCentroCosto, fechaI, fechaF, idUser );
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_LiquidacionCajaCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_liquidacionDetalle(id_LiquidacionCajaCab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int id_LiquidacionCaja_Det = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.set_eliminarLiquidacionDetalle(id_LiquidacionCaja_Det);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_liquidacionesCabDet(idLiquidacionCaja_Cab, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_documentosCajaChica(idLiquidacionCaja_Cab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacion_Archivo = Convert.ToInt32(parametros[0].ToString());

                    resul = obj_negocio.get_eliminarDocumentoCajaChica(idLiquidacion_Archivo);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacion_Archivo = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_download_documentoCajaChica(idLiquidacion_Archivo, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUser = parametros[1].ToString();

                    resul = obj_negocio.set_enviarAprobarDocumentosLiquidacion_Cab(idLiquidacionCaja_Cab, idUser);
                }
                //------ APROBACIONES CAJA CHICA------
                /// ------------------------------------
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');

                    string idCentroCosto = parametros[0].ToString();
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    string idEstado = parametros[3].ToString();
                    string IdUsuarios = parametros[4].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_aprobacion_liquidacionCajaChicaCab(idCentroCosto, fechaIni, fechaFin, idEstado, IdUsuarios);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_detalleCajaChica(idLiquidacionCaja_Cab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Liquidacion_Archivo = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.set_Eliminar_archivosCajaChica(id_Liquidacion_Archivo);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_detalleCajaChica_archivos(idLiquidacionCaja_Cab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacionCaja_Det = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_documentosCajaChica_Det(idLiquidacionCaja_Det);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacion_Archivo = Convert.ToInt32(parametros[0].ToString());

                    resul = obj_negocio.get_eliminarDocumentoCajaChica_Det(idLiquidacion_Archivo);
                }
                else if (opcion == 17)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacion_Archivo = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_download_documentoCajaChica_Det(idLiquidacion_Archivo, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');
                    int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUser = parametros[1].ToString();

                    resul = obj_negocio.guardar_excelCajaChica(idLiquidacionCaja_Cab, idUser);
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



        // PUT: api/tbl_Liquidacion_Caja_Cab/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Liquidacion_Caja_Cab(int id, tbl_Liquidacion_Caja_Cab tbl_Liquidacion_Caja_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Liquidacion_Caja_Cab.id_LiquidacionCaja_Cab)
            {
                return BadRequest();
            }

            db.Entry(tbl_Liquidacion_Caja_Cab).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Liquidacion_Caja_CabExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/tbl_Liquidacion_Caja_Cab
        [ResponseType(typeof(tbl_Liquidacion_Caja_Cab))]
        public IHttpActionResult Posttbl_Liquidacion_Caja_Cab(tbl_Liquidacion_Caja_Cab tbl_Liquidacion_Caja_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Liquidacion_Caja_Cab.Add(tbl_Liquidacion_Caja_Cab);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Liquidacion_Caja_Cab.id_LiquidacionCaja_Cab }, tbl_Liquidacion_Caja_Cab);
        }

        // DELETE: api/tbl_Liquidacion_Caja_Cab/5
        [ResponseType(typeof(tbl_Liquidacion_Caja_Cab))]
        public IHttpActionResult Deletetbl_Liquidacion_Caja_Cab(int id)
        {
            tbl_Liquidacion_Caja_Cab tbl_Liquidacion_Caja_Cab = db.tbl_Liquidacion_Caja_Cab.Find(id);
            if (tbl_Liquidacion_Caja_Cab == null)
            {
                return NotFound();
            }

            db.tbl_Liquidacion_Caja_Cab.Remove(tbl_Liquidacion_Caja_Cab);
            db.SaveChanges();

            return Ok(tbl_Liquidacion_Caja_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Liquidacion_Caja_CabExists(int id)
        {
            return db.tbl_Liquidacion_Caja_Cab.Count(e => e.id_LiquidacionCaja_Cab == id) > 0;
        }
    }
}