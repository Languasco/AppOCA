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
using Negocio.Resultados;

namespace WebApi_Oca.Controllers.Proveedores
{
    [EnableCors("*", "*", "*")]
    public class tblLiquidacion_Caja_DetController : ApiController
    {
        private OCAEntities db = new OCAEntities();

        // GET: api/tblLiquidacion_Caja_Det
        public IQueryable<tbl_Liquidacion_Caja_Det> Gettbl_Liquidacion_Caja_Det()
        {
            return db.tbl_Liquidacion_Caja_Det;
        }

        // GET: api/tblLiquidacion_Caja_Det/5
        [ResponseType(typeof(tbl_Liquidacion_Caja_Det))]
        public IHttpActionResult Gettbl_Liquidacion_Caja_Det(int id)
        {
            tbl_Liquidacion_Caja_Det tbl_Liquidacion_Caja_Det = db.tbl_Liquidacion_Caja_Det.Find(id);
            if (tbl_Liquidacion_Caja_Det == null)
            {
                return NotFound();
            }

            return Ok(tbl_Liquidacion_Caja_Det);
        }

        public object Posttbl_Liquidacion_Caja_Det(tbl_Liquidacion_Caja_Det tbl_Liquidacion_Caja_Det)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Liquidacion_Caja_Det.fecha_creacion = DateTime.Now;
                db.tbl_Liquidacion_Caja_Det.Add(tbl_Liquidacion_Caja_Det);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Liquidacion_Caja_Det.id_LiquidacionCaja_Det;
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

        public object Puttbl_Liquidacion_Caja_Det(int id, tbl_Liquidacion_Caja_Det tbl_Liquidacion_Caja_Det)
        {
            Resultado res = new Resultado();

            tbl_Liquidacion_Caja_Det objReemplazar;
            objReemplazar = db.tbl_Liquidacion_Caja_Det.Where(u => u.id_LiquidacionCaja_Det == id).FirstOrDefault<tbl_Liquidacion_Caja_Det>();

            objReemplazar.Pub_TiDo_Codigo = tbl_Liquidacion_Caja_Det.Pub_TiDo_Codigo;
            objReemplazar.nroSerie_Doc = tbl_Liquidacion_Caja_Det.nroSerie_Doc;

            objReemplazar.numero_Doc = tbl_Liquidacion_Caja_Det.numero_Doc;
            objReemplazar.fechaEmision_Doc = tbl_Liquidacion_Caja_Det.fechaEmision_Doc;
            objReemplazar.id_Proveedor = tbl_Liquidacion_Caja_Det.id_Proveedor;

            objReemplazar.nro_RUC = tbl_Liquidacion_Caja_Det.nro_RUC;
            objReemplazar.concepto_Doc  = tbl_Liquidacion_Caja_Det.concepto_Doc;
            objReemplazar.subTotal_Doc = tbl_Liquidacion_Caja_Det.subTotal_Doc;
            objReemplazar.IgvTotal_Doc = tbl_Liquidacion_Caja_Det.IgvTotal_Doc;
            objReemplazar.percepciones_Doc = tbl_Liquidacion_Caja_Det.percepciones_Doc;

            objReemplazar.otrosG_Doc = tbl_Liquidacion_Caja_Det.otrosG_Doc;
            objReemplazar.total_Doc = tbl_Liquidacion_Caja_Det.total_Doc;
            objReemplazar.Estado = tbl_Liquidacion_Caja_Det.Estado;
            objReemplazar.usuario_edicion = tbl_Liquidacion_Caja_Det.usuario_creacion;
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


        // DELETE: api/tblLiquidacion_Caja_Det/5
        [ResponseType(typeof(tbl_Liquidacion_Caja_Det))]
        public IHttpActionResult Deletetbl_Liquidacion_Caja_Det(int id)
        {
            tbl_Liquidacion_Caja_Det tbl_Liquidacion_Caja_Det = db.tbl_Liquidacion_Caja_Det.Find(id);
            if (tbl_Liquidacion_Caja_Det == null)
            {
                return NotFound();
            }

            db.tbl_Liquidacion_Caja_Det.Remove(tbl_Liquidacion_Caja_Det);
            db.SaveChanges();

            return Ok(tbl_Liquidacion_Caja_Det);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Liquidacion_Caja_DetExists(int id)
        {
            return db.tbl_Liquidacion_Caja_Det.Count(e => e.id_LiquidacionCaja_Det == id) > 0;
        }
    }
}