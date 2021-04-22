using Entidades;
using Negocio.Proveedores.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_Oca.Controllers.Proveedores
{
    [EnableCors("*", "*", "*")]
    public class AprobarContabilidadController : ApiController
    {
        private OCAEntities db = new OCAEntities();
        
        public object GetAprobarContabilidad(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            Proveedores_BL obj_negocio = new Proveedores_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_estados_aprobacionContabilidad();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    string centroCosto = parametros[0].ToString();
                    string fechaInicial = parametros[1].ToString();
                    string fechaFinal = parametros[2].ToString();
                    string estado = parametros[3].ToString();
                    string usuario = parametros[4].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_listadoDocumentos_aprobacionContabilidad(centroCosto, fechaInicial, fechaFinal, estado,  usuario);
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


        [HttpPost]
        [Route("api/AprobarContabilidad/post_seleccionarDocumentos")]
        public object post_seleccionarDocumentos( List<string> listDocumentos, string filtro)
        {
            Resultado res = new Resultado();
            object resultado = null;
            try
            {
                string[] parametros = filtro.Split('|');
                string idDocumentos = String.Join(",", listDocumentos);

                string idusuario = parametros[0].ToString();
                string idestado = parametros[1].ToString();

                Proveedores_BL obj_negocio = new Proveedores_BL();
                resultado = obj_negocio.set_grabar_seleccionDocumentos(idDocumentos, idusuario, idestado);

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;

                resultado = res;
            }
            return resultado;
        }

        [HttpPost]
        [Route("api/AprobarContabilidad/post_excelSistCont")]
        public object post_excelSistCont(List<string> listDocumentos, string filtro)
        {
            Resultado res = new Resultado();
            object resultado = null;
            try
            {
                string[] parametros = filtro.Split('|');
                string idDocumentos = String.Join(",", listDocumentos);

                string idusuario = parametros[0].ToString();
                Proveedores_BL obj_negocio = new Proveedores_BL();
                resultado = obj_negocio.GenerarReporte_sistCont(idDocumentos, idusuario);

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;

                resultado = res;
            }
            return resultado;
        }




    }
}
