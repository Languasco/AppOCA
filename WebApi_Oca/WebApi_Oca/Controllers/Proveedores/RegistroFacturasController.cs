using Entidades;
using Entidades.Proveedores.Procesos;
using Negocio.Proveedores;
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
    public class RegistroFacturasController : ApiController
    {
        private OCAEntities db = new OCAEntities();

        public object GetRegistroFacturas(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            RegistroFacturas_BL obj_negocio = new RegistroFacturas_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_estado();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaIni = parametros[0].ToString();
                    string fechaFin = parametros[1].ToString();
                    string idEstado = parametros[2].ToString();
                    string Id_Proveedor = parametros[3].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_ordenCompraCab(fechaIni, fechaFin, idEstado, Id_Proveedor);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idOrdenCompraCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_documentosCab(idOrdenCompraCab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idDocumentoCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_documentosDet(idDocumentoCab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idOrdenCompraCab = Convert.ToInt32(parametros[0].ToString());
                    string nroFactura = parametros[1].ToString();
                    string fechaD = parametros[2].ToString();
                    string idUser = parametros[3].ToString();
                    int idDocumentoCab = Convert.ToInt32(parametros[4].ToString());
                    string serieFactura = parametros[5].ToString();

                    res.ok = true;
                    res.data = obj_negocio.set_grabarDocumentoCab(idOrdenCompraCab, nroFactura, fechaD, idUser, idDocumentoCab, serieFactura);
                    res.totalpage = 0;

                    resul = res;
                }

                else if (opcion == 6)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_TidoDocumento_File
                                where a.estado == 1
                                select new
                                {
                                    a.id_TipoDocFile,
                                    a.tipoFile,
                                    a.nombreFile
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int idDocumentoCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_archivosAdicionales(idDocumentoCab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int idDocumentoArchivo = Convert.ToInt32(parametros[0].ToString());

                    resul = obj_negocio.set_eliminarArchivoAdicional(idDocumentoArchivo);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idDocumentoArchivo = Convert.ToInt32(parametros[0].ToString());
                    string idUsuario = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_download_archivosAdicionalesImportados(idDocumentoArchivo, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idOrdenCompraCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_detalleDocumentosOC(idOrdenCompraCab);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    int idDocumentoDet = Convert.ToInt32(parametros[0].ToString());
                    string codigoProd = parametros[1].ToString();

                    string cantidadIngreso = parametros[2].ToString();
                    string precio = parametros[3].ToString();
                    string idUser = parametros[4].ToString();

                    resul = obj_negocio.set_editarCantidadDocumentosDet(idDocumentoDet, codigoProd, cantidadIngreso, precio, idUser);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    int idDocumentoCab = Convert.ToInt32(parametros[0].ToString());
                    string idUser = parametros[1].ToString();

                    resul = obj_negocio.set_enviarAprobarDocumentosCab(idDocumentoCab, idUser);
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaIni = parametros[0].ToString();
                    string fechaFin = parametros[1].ToString();
                    string nroOC = parametros[2].ToString();
                    string idEstado = parametros[3].ToString();
                    int idProveedor = Convert.ToInt32(parametros[4].ToString());

 
                    res.ok = true;
                    res.data = obj_negocio.get_estadosDocumentosCab(fechaIni, fechaFin, nroOC, idEstado, idProveedor);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 14)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_estadoEvaluacion();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');

                    int idOrdenCompraCab = Convert.ToInt32(parametros[0].ToString());
                    int idProveedor = Convert.ToInt32(parametros[1].ToString()); 
                    string serieDoc = parametros[2].ToString();
                    string nroDoc = parametros[3].ToString();
                    string idUser = parametros[4].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_verificacion_serieNroDocumento(idOrdenCompraCab, idProveedor, serieDoc, nroDoc, idUser);
                    res.totalpage = 0;

                    resul = res;
                }
                //----APROBAR FACTURAS --
                else if (opcion == 16)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_formaPago();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 17)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_estadosAprobacionFactura();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');

                    string nroFactura = parametros[0].ToString();
                    string nroOC = parametros[1].ToString();
                    string Proveedor = parametros[2].ToString();
                    string idFormaPago = parametros[3].ToString();
                    string idEstado = parametros[4].ToString();
                    string idUsuario = parametros[5].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_aprobacionFacturasCab(nroFactura, nroOC, Proveedor, idFormaPago, idEstado, idUsuario  );
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 19)
                {
                    string[] parametros = filtro.Split('|');
                    string codigosIdFact = parametros[0].ToString();
                    string idUser = parametros[1].ToString();

                    resul = obj_negocio.set_aprobarFacturacion_masivo(codigosIdFact, idUser);
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
        [Route("api/RegistroFacturas/set_guardandoDetalleDocumentos")]
        public object set_guardandoDetalleDocumentos(List<Detalle_E> List_Detalle, string idUsuario)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                RegistroFacturas_BL obj_negocio = new RegistroFacturas_BL();
                res.ok = true;
                res.data = obj_negocio.Set_almacenandoDetalle_documentos(List_Detalle, idUsuario);
                res.totalpage = 0;

                resul = res;
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
