using Negocio.Logistisca.Proceso;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_Oca.Controllers.Logistica.Procesos
{
    [EnableCors("*", "*", "*")]
    public class OrdenCompraAdjuntarController : ApiController
    {
        public object GetOrdenCompraAdjuntar(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    string idTipoOc =  parametros[0].ToString();
                    string fechaInicial = parametros[1].ToString();
                    string fechaFinal = parametros[2].ToString();
                    string idEstado = parametros[3].ToString();
                    string nroOC = parametros[4].ToString();

                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();
                    res.ok = true;
                    res.data = obj_negocio.get_ordenCompraAdjuntarCab(idTipoOc, fechaInicial, fechaFinal, idEstado, nroOC);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {
                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();
                    res.ok = true;
                    res.data = obj_negocio.get_tipoOrdenCompra();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {
                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();
                    res.ok = true;
                    res.data = obj_negocio.get_estado();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 4)
                {
                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();
                    res.ok = true;
                    res.data = obj_negocio.get_tipoDocumento();
                    res.totalpage = 0;

                    resul = res;
                }
                else if(opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    string idOrdenCompra = parametros[0].ToString();
                    string opcionModal = parametros[1].ToString();
 
                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();
                    res.ok = true;
                    res.data = obj_negocio.get_archivosOrdenCompra(idOrdenCompra, opcionModal);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    string idFileOrdenCompra = parametros[0].ToString();

                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();
                    resul = obj_negocio.set_AnulandoFile_ordenCompra(idFileOrdenCompra);
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    string idFileOrdenCompra = parametros[0].ToString();
                    string iduser = parametros[1].ToString();

                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_download_archivosImportadosOC(idFileOrdenCompra, iduser);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    string idFileOrdenCompra = parametros[0].ToString();
                    string tipoDoc = parametros[1].ToString();
                    string nroDoc = parametros[2].ToString();
                    string fecha = parametros[3].ToString();
                    string importe = parametros[4].ToString();

                    OrdenCompraAdjuntar_BL obj_negocio = new OrdenCompraAdjuntar_BL();
                    resul = obj_negocio.set_EditandoFile_ordenCompra(idFileOrdenCompra, tipoDoc, nroDoc, fecha, importe);
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
    }
}
