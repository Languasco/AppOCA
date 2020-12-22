
using Negocio.Resultados;
using Negocio.Uploads;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_Oca.Controllers.Upload
{
    [EnableCors("*", "*", "*")]
    public class UploadsController : ApiController
    {

        [HttpPost]
        [Route("api/Uploads/post_archivosOrdenCompra")]
        public object post_archivosOrdenCompra(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData
                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                //string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
 
                string idOrdenCompra = parametros[0].ToString();
                string nroOc = parametros[1].ToString();
                string tipoDoc = parametros[2].ToString();

                string opcionModal = parametros[3].ToString();
                string idUsuario = parametros[4].ToString();

                string nroDoc = parametros[5].ToString();
                string fecha = parametros[6].ToString();
                string importe = parametros[7].ToString();

                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_archivoOrdenCompra(idOrdenCompra, nroOc, tipoDoc, opcionModal, file.FileName , nroDoc, fecha, importe);

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/OrdenCompra/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }

        [HttpPost]
        [Route("api/Uploads/post_archivosProveedor")]
        public object post_archivosProveedor(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
                int idProveedor = Convert.ToInt32(parametros[0].ToString());
                int tipDoc = Convert.ToInt32(parametros[1].ToString());
                string nombreArchivo = parametros[2].ToString();
                string idUsuario = parametros[3].ToString();

             

                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_archivoProveedor(idProveedor, tipDoc, file.FileName, idUsuario);

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Proveedor/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }

        [HttpPost]
        [Route("api/Uploads/post_archivoCabProveedor")]
        public object post_archivoCabProveedor(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|'); 
                string idUsuario = parametros[0].ToString();
                int idDocumentoCab = Convert.ToInt32(parametros[1].ToString());

                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_archivoDocumentosCab(idDocumentoCab,  file.FileName, idUsuario);

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Documentos/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }


        [HttpPost]
        [Route("api/Uploads/post_archivosAdicionalesCabProveedor")]
        public object post_archivosAdicionalesCabProveedor(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);
                string[] parametros = filtros.Split('|');

                int idDocumentoCab = Convert.ToInt32(parametros[0].ToString());
                int tipoDoc = Convert.ToInt32(parametros[1].ToString());
                string nroDoc = parametros[2].ToString();
                string fechaD = parametros[3].ToString();
                string idUsuario = parametros[4].ToString();
                string serieDoc = parametros[5].ToString();

                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_archivosAdicionalesDocumentosCab(idDocumentoCab, tipoDoc, nroDoc, fechaD, file.FileName, idUsuario, serieDoc);

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Documentos/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }


        [HttpPost]
        [Route("api/Uploads/post_archivoExcel_cajaChica")]
        public object post_archivoExcel_cajaChica(string filtros)
        {
            Resultado res = new Resultado();
            var nombreFile = "";
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
                int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());
                string idUsuario = parametros[1].ToString();

                //nombreFile = "Impotacion_Excels" + "_" + idUsuario + extension;

                //-----generando clave unica---
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                nombreFile = idUsuario + "_Importacion_Excel_cajaChica" + Guid.Parse(guidB) + extension;

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Excel/" + nombreFile);
                //if (System.IO.File.Exists(sPath))
                //{
                //    System.IO.File.Delete(sPath);
                //}
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    Upload_BL obj_negocio = new Upload_BL();
 
                    res.ok = true;
                    res.data = obj_negocio.setAlmacenandoFile_Excel_cajaChica(sPath, file.FileName, idLiquidacionCaja_Cab, idUsuario);
                    res.totalpage = 0;
            
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }

        [HttpPost]
        [Route("api/Uploads/post_archivosDocumentos_cajaChica")]
        public object post_archivosDocumentos_cajaChica(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);
                string[] parametros = filtros.Split('|');

                int idLiquidacionCaja_Cab = Convert.ToInt32(parametros[0].ToString());
                 string idUsuario = parametros[1].ToString();
 

                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_documentosCajaChica(idLiquidacionCaja_Cab, file.FileName, idUsuario);

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/CajaChica/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }



    }
}
