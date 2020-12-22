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

namespace WebApi_Oca.Controllers.Acceso
{
    [EnableCors("*", "*", "*")]
    public class tblProveedor_BancoController : ApiController
    {
        private OCAEntities db = new OCAEntities();

        // GET: api/tblProveedor_Banco
        public IQueryable<tbl_Proveedor_Banco> Gettbl_Proveedor_Banco()
        {
            return db.tbl_Proveedor_Banco;
        }

        // GET: api/tblProveedor_Banco/5
        [ResponseType(typeof(tbl_Proveedor_Banco))]
        public IHttpActionResult Gettbl_Proveedor_Banco(int id)
        {
            tbl_Proveedor_Banco tbl_Proveedor_Banco = db.tbl_Proveedor_Banco.Find(id);
            if (tbl_Proveedor_Banco == null)
            {
                return NotFound();
            }

            return Ok(tbl_Proveedor_Banco);
        }
               
        public object Posttbl_Proveedor_Banco(tbl_Proveedor_Banco tbl_Proveedor_Banco)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Proveedor_Banco.fecha_creacion = DateTime.Now;
                db.tbl_Proveedor_Banco.Add(tbl_Proveedor_Banco);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Proveedor_Banco.id_Proveedor_Banco;
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

        public object Puttbl_Proveedor_Banco(int id, tbl_Proveedor_Banco tbl_Proveedor_Banco)
        {
            Resultado res = new Resultado();

            tbl_Proveedor_Banco objReemplazar;
            objReemplazar = db.tbl_Proveedor_Banco.Where(u => u.id_Proveedor_Banco == id).FirstOrDefault<tbl_Proveedor_Banco>();

            objReemplazar.id_Banco = tbl_Proveedor_Banco.id_Banco;
            objReemplazar.Pub_Mone_Codigo = tbl_Proveedor_Banco.Pub_Mone_Codigo;
            objReemplazar.id_TipoCuenta = tbl_Proveedor_Banco.id_TipoCuenta;
            objReemplazar.nroCuenta = tbl_Proveedor_Banco.nroCuenta;
            objReemplazar.nroCCI = tbl_Proveedor_Banco.nroCCI;

            objReemplazar.estado = tbl_Proveedor_Banco.estado;
            objReemplazar.usuario_edicion = tbl_Proveedor_Banco.usuario_creacion;
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
               
        // DELETE: api/tblProveedor_Banco/5
        [ResponseType(typeof(tbl_Proveedor_Banco))]
        public IHttpActionResult Deletetbl_Proveedor_Banco(int id)
        {
            tbl_Proveedor_Banco tbl_Proveedor_Banco = db.tbl_Proveedor_Banco.Find(id);
            if (tbl_Proveedor_Banco == null)
            {
                return NotFound();
            }

            db.tbl_Proveedor_Banco.Remove(tbl_Proveedor_Banco);
            db.SaveChanges();

            return Ok(tbl_Proveedor_Banco);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Proveedor_BancoExists(int id)
        {
            return db.tbl_Proveedor_Banco.Count(e => e.id_Proveedor_Banco == id) > 0;
        }
    }
}