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
    public class tblProveedor_Evalucion_DetController : ApiController
    {
        private OCAEntities db = new OCAEntities();

        // GET: api/tblProveedor_Evalucion_Det
        public IQueryable<tbl_Proveedor_Evalucion_Det> Gettbl_Proveedor_Evalucion_Det()
        {
            return db.tbl_Proveedor_Evalucion_Det;
        }
        

        public object GetTbl_Proveedor(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
            
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEvaluacion_Det = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_eliminarEvaluacionDet(idEvaluacion_Det, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    
                    string opcionCampo = parametros[0].ToString();
                    string valor = parametros[1].ToString();
                    int idEvaluacion_Det = Convert.ToInt32(parametros[2].ToString());
                    string idUsuario = parametros[3].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_editarEvaluacionDet(opcionCampo, valor,  idEvaluacion_Det, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idEvaluacion_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUser = parametros[1].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    resul = obj_negocio.set_enviarAprobarEvaluacionCab(idEvaluacion_Cab, idUser);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idEvaluacion_Cab = Convert.ToInt32(parametros[0].ToString());
                    string idUser = parametros[1].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    resul = obj_negocio.set_anularEvaluacionCab(idEvaluacion_Cab, idUser);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idEvaluacion_Cab = Convert.ToInt32(parametros[0].ToString());
                    string opcionModal = parametros[1].ToString();
                    string idUser = parametros[2].ToString();

                    Proveedores_BL obj_negocio = new Proveedores_BL();

                    resul = obj_negocio.set_AprobarRechazarEvaluacionCab(idEvaluacion_Cab, opcionModal, idUser);
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


        public object PostTbl_Proveedor(tbl_Proveedor_Evalucion_Det tbl_Proveedor_Evalucion_Det)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Proveedor_Evalucion_Det.fecha_creacion = DateTime.Now;
                db.tbl_Proveedor_Evalucion_Det.Add(tbl_Proveedor_Evalucion_Det);
                db.SaveChanges();

                Proveedores_BL obj_negocio = new Proveedores_BL();

                int idEvaluacionDet = tbl_Proveedor_Evalucion_Det.id_Evaluacion_Det;
                string idUsuario = tbl_Proveedor_Evalucion_Det.usuario_creacion;


                res.ok = true;
                //res.data = tbl_Proveedor_Evalucion_Det.id_Evaluacion_Det;
                res.data = obj_negocio.get_evaluacionProveedorDet(0, idEvaluacionDet,  idUsuario);
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
               
        // DELETE: api/tblProveedor_Evalucion_Det/5
        [ResponseType(typeof(tbl_Proveedor_Evalucion_Det))]
        public IHttpActionResult Deletetbl_Proveedor_Evalucion_Det(int id)
        {
            tbl_Proveedor_Evalucion_Det tbl_Proveedor_Evalucion_Det = db.tbl_Proveedor_Evalucion_Det.Find(id);
            if (tbl_Proveedor_Evalucion_Det == null)
            {
                return NotFound();
            }

            db.tbl_Proveedor_Evalucion_Det.Remove(tbl_Proveedor_Evalucion_Det);
            db.SaveChanges();

            return Ok(tbl_Proveedor_Evalucion_Det);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Proveedor_Evalucion_DetExists(int id)
        {
            return db.tbl_Proveedor_Evalucion_Det.Count(e => e.id_Evaluacion_Det == id) > 0;
        }
    }
}