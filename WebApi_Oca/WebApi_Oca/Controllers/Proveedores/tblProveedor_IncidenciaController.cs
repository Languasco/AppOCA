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
    public class tblProveedor_IncidenciaController : ApiController
    {
        private OCAEntities db = new OCAEntities();

        // GET: api/tblProveedor_Incidencia
        public IQueryable<tbl_Proveedor_Incidencia> Gettbl_Proveedor_Incidencia()
        {
            return db.tbl_Proveedor_Incidencia;
        }
        
        public object Gettbl_Proveedor_Incidencia(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            Proveedores_BL obj_negocio = new Proveedores_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    string idCentroCosto = parametros[0].ToString();
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    string IdUsuarios = parametros[3].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_incidenciasCab(idCentroCosto , fechaIni, fechaFin, IdUsuarios);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Incidencia = Convert.ToInt32(parametros[0].ToString());

                    tbl_Proveedor_Incidencia objReemplazar;
                    objReemplazar = db.tbl_Proveedor_Incidencia.Where(u => u.id_Incidencia == id_Incidencia).FirstOrDefault<tbl_Proveedor_Incidencia>();
                    objReemplazar.Estado = "221";

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


        public object Posttbl_Proveedor_Incidencia(tbl_Proveedor_Incidencia tbl_Proveedor_Incidencia)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Proveedor_Incidencia.fecha_creacion = DateTime.Now;
                db.tbl_Proveedor_Incidencia.Add(tbl_Proveedor_Incidencia);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Proveedor_Incidencia.id_Incidencia;                             
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

        public object Puttbl_Proveedor_Incidencias(int id, tbl_Proveedor_Incidencia tbl_Proveedor_Incidencia)
        {
            Resultado res = new Resultado();

            tbl_Proveedor_Incidencia objReemplazar;
            objReemplazar = db.tbl_Proveedor_Incidencia.Where(u => u.id_Incidencia == id).FirstOrDefault<tbl_Proveedor_Incidencia>();

            objReemplazar.id_Proveedor = tbl_Proveedor_Incidencia.id_Proveedor;
            objReemplazar.fechaIngreso_Incidencia = tbl_Proveedor_Incidencia.fechaIngreso_Incidencia;
            objReemplazar.observaciones_Incidencia = tbl_Proveedor_Incidencia.observaciones_Incidencia;
            objReemplazar.Estado = tbl_Proveedor_Incidencia.Estado;
            objReemplazar.usuario_edicion = tbl_Proveedor_Incidencia.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

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

            return res;
        }


        // DELETE: api/tblProveedor_Incidencia/5
        [ResponseType(typeof(tbl_Proveedor_Incidencia))]
        public IHttpActionResult Deletetbl_Proveedor_Incidencia(int id)
        {
            tbl_Proveedor_Incidencia tbl_Proveedor_Incidencia = db.tbl_Proveedor_Incidencia.Find(id);
            if (tbl_Proveedor_Incidencia == null)
            {
                return NotFound();
            }

            db.tbl_Proveedor_Incidencia.Remove(tbl_Proveedor_Incidencia);
            db.SaveChanges();

            return Ok(tbl_Proveedor_Incidencia);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Proveedor_IncidenciaExists(int id)
        {
            return db.tbl_Proveedor_Incidencia.Count(e => e.id_Incidencia == id) > 0;
        }
    }
}