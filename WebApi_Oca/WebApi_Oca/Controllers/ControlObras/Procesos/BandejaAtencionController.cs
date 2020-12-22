using Negocio.ControlObras.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_Oca.Controllers.ControlObras.Procesos
{
    [EnableCors("*", "*", "*")]
    public class BandejaAtencionController : ApiController
    {
        public object GetBandejaAtencion(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            BandejaAtencion_BL obj_negocio = new BandejaAtencion_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    string idLocal = parametros[0].ToString();
                    string nroObra = parametros[1].ToString();
                    string jefeCuadrilla = parametros[2].ToString();
                    string idEstado = parametros[3].ToString();
 
                    res.ok = true;
                    res.data = obj_negocio.get_bandejaAtencionCab(idLocal, nroObra, jefeCuadrilla, idEstado);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    string idUsuario = parametros[0].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_locales(idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    string idUsuario = parametros[0].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_centroCosto(idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    string idcentroCosto = parametros[0].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_jefeCuadrilla(idcentroCosto);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_estado( );
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 6)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_inspector();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 7)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_supervisor();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    string idParteDiario = parametros[0].ToString();
                    string inspector = parametros[1].ToString();
                    string supervisor = parametros[2].ToString();

                    string observacion = parametros[3].ToString();
                    string fechaLiquidacion = parametros[4].ToString();
                    string idUsuario = parametros[5].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_actualizarParteDiario(idParteDiario, inspector, supervisor, observacion, fechaLiquidacion, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');

                    string idParteDiario = parametros[0].ToString();
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_cerrandoParteDiario(idParteDiario,  idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_baremos();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 11)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_actividad();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 12)  ///-- grabar Parte Diario Baremos
                {
                    string[] parametros = filtro.Split('|');

                    string idParteDiario = parametros[0].ToString();
                    string idActivad = parametros[1].ToString();
                    string idBaremo = parametros[2].ToString();
                    string cantidadAprobada = parametros[3].ToString();
                    string precioBaremo = parametros[4].ToString();
                    string importe = parametros[5].ToString();

                    string idUsuario = parametros[6].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_grabarParteDiario_baremo(idParteDiario, idActivad, idBaremo, cantidadAprobada, precioBaremo, importe, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }

                else if (opcion == 13)  ///-- grabar Parte Diario Baremos
                {
                    string[] parametros = filtro.Split('|');

                    string idParteDiario_baremo = parametros[0].ToString();
                    string cantidadAprobada = parametros[1].ToString();
                    string precioBaremo = parametros[2].ToString();
                    string importe = parametros[3].ToString();
                    string idUsuario = parametros[4].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_actualizarParteDiario_baremo(idParteDiario_baremo, cantidadAprobada, precioBaremo, importe, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    string idParteDiario = parametros[0].ToString();
                    
                    res.ok = true;
                    res.data = obj_negocio.get_parteDiario_baremos(idParteDiario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    string idParteDiario_baremo = parametros[0].ToString();
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_eliminarParteDiario_baremo(idParteDiario_baremo);
                    res.totalpage = 0;
                    resul = res;
                }
                //TABL MATERIAL DE CAMPO
                else if (opcion == 16) /// almacenes
                {

                    string[] parametros = filtro.Split('|');
                    string idUsuario = parametros[0].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_almacenes(idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 17)  
                {
                    string[] parametros = filtro.Split('|');
                    string idParteDiario = parametros[0].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_parteDiario_material(idParteDiario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');
                    string idParteDiario_articulo = parametros[0].ToString();
                    string cantidad = parametros[1].ToString();
                    string idUsuario = parametros[2].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_actualizarParteDiario_material(idParteDiario_articulo, cantidad, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 19)
                {
                    string[] parametros = filtro.Split('|');
                    string idParteDiario_articulo = parametros[0].ToString();
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_eliminarParteDiario_material(idParteDiario_articulo);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 20)  ////---- PARTE DIARIO FOTOS ---
                {
                    string[] parametros = filtro.Split('|');
                    string idParteDiario = parametros[0].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_parteDiario_fotos(idParteDiario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 21)
                {
                    string[] parametros = filtro.Split('|');
                    string idFotos = parametros[0].ToString();
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_download_parteDiario_fotos(idFotos, idUsuario);
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
    }
}
