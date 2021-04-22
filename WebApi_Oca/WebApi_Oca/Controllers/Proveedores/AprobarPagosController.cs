using Entidades;
using Negocio.Proveedores.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_Oca.Controllers.Proveedores
{
    [EnableCors("*", "*", "*")]
    public class AprobarPagosController : ApiController
    {

        private OCAEntities db = new OCAEntities();

        public object GetAprobarPagos(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            Proveedores_BL obj_negocio = new Proveedores_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    string docIdentidad = parametros[0].ToString();
                    string tipoDocumento = parametros[1].ToString();
                    string centroCosto = parametros[2].ToString();
                    string moneda = parametros[3].ToString();
                    string facturaCancelada = parametros[4].ToString();
                    string estado = parametros[5].ToString();
                    string usuario = parametros[6].ToString();
                    string docVencido = parametros[7].ToString();
                   string fechaCorte = parametros[8].ToString();
                    res.ok = true;
                    res.data = obj_negocio.get_listadoAprobacionPagosCab(docIdentidad, tipoDocumento, centroCosto, moneda, facturaCancelada, estado, usuario, docVencido, fechaCorte);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {

                    res.ok = true;
                    res.data = obj_negocio.get_documentosIdentidades();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {

                    res.ok = true;
                    res.data = obj_negocio.get_tipoDocumentos();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 4)
                {

                    res.ok = true;
                    res.data = obj_negocio.get_monedas();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_estados();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    string docIdentidad = parametros[0].ToString();
                    string tipoDocumento = parametros[1].ToString();
                    string centroCosto = parametros[2].ToString();
                    string moneda = parametros[3].ToString();
                    string facturaCancelada = parametros[4].ToString();
                    string estado = parametros[5].ToString();
                    string usuario = parametros[6].ToString();
                    string docVencido = parametros[7].ToString();

                    resul = obj_negocio.GenerarReporte_detalleMacros(docIdentidad, tipoDocumento, centroCosto, moneda, facturaCancelada, estado, usuario, docVencido); ;
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');

                    int idLiquidacionCab = Convert.ToInt32(parametros[0].ToString());
                    string usuario = parametros[1].ToString();

                    resul = obj_negocio.Generar_formatoLiquidaciones(idLiquidacionCab, usuario); ;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    string docIdentidad = parametros[0].ToString();
                    string tipoDocumento = parametros[1].ToString();
                    string centroCosto = parametros[2].ToString();
                    string moneda = parametros[3].ToString();
                    string facturaCancelada = parametros[4].ToString();
                    string estado = parametros[5].ToString();
                    string usuario = parametros[6].ToString();
                    string docVencido = parametros[7].ToString();

                    resul = obj_negocio.Generar_reporte_aprobacionPagos(docIdentidad, tipoDocumento, centroCosto, moneda, facturaCancelada, estado, usuario, docVencido); ;
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
        [Route("api/AprobarPagos/post_aprobacionPagosMasivos")]
        public object post_aprobacionPagosMasivos(List<string> listDocumentos, string filtro)
        {
            Resultado res = new Resultado();
            object resultado = null;
            try
            {
                string[] parametros = filtro.Split('|');

                string idDocumentos = String.Join(",", listDocumentos);
                string idusuario = parametros[0].ToString();

                Proveedores_BL obj_negocio = new Proveedores_BL();
                resultado = obj_negocio.set_grabar_aprobacionPagosMasivos(idDocumentos, idusuario);

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
        [Route("api/AprobarPagos/post_actualizando_flagPagos")]
        public object post_actualizando_flagPagos(List<string> listDocumentos, string filtro)
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
                resultado = obj_negocio.set_actualizarFlagPagos(idDocumentos, idusuario, idestado);

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
