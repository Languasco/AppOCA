using Entidades.Proveedores.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Negocio.Proveedores
{
   public class RegistroFacturas_BL
    {

        public DataTable get_estado()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SDSIGE_PROY_W_REGISTRO_FACTURAS_COMBO_ESTADOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }


        public DataTable get_estado_estadoFacturas()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ESTADO_FACTURAS_COMBO_ESTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public DataTable get_estadoEvaluacion()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_COMBO_ESTADOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public DataTable get_estadoEvaluacion_aprobacion()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_PROVEEDORES_COMBO_ESTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public object get_ordenCompraCab(  string fechaIni, string fechaFin , string idEstado, string Id_Proveedor, string nroOC, int isProveedor, string idCentroCosto)
        {
            List<RegistroFacturas_E> list_cabecera = new List<RegistroFacturas_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_ORDEN_COMPRA_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin; 
                        cmd.Parameters.Add("@idEstado", SqlDbType.VarChar).Value = idEstado;
                        cmd.Parameters.Add("@Id_Proveedor", SqlDbType.Int).Value = Id_Proveedor;
                        cmd.Parameters.Add("@nroOC", SqlDbType.VarChar).Value = nroOC;
                        cmd.Parameters.Add("@esProveedor", SqlDbType.Int).Value = isProveedor;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCosto;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                RegistroFacturas_E obj_entidad = new RegistroFacturas_E();

                                obj_entidad.idOrdenCompraCab = Convert.ToInt32(dr["idOrdenCompraCab"].ToString());
                                obj_entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                obj_entidad.tipoOc = dr["tipoOc"].ToString();
                                obj_entidad.nroOc = dr["nroOc"].ToString();

                                obj_entidad.fechaOC = dr["fechaOC"].ToString();
                                obj_entidad.moneda = dr["moneda"].ToString();
                                obj_entidad.subtotal = dr["subtotal"].ToString();
                                obj_entidad.igv = dr["igv"].ToString();

                                obj_entidad.total = dr["total"].ToString();
                                obj_entidad.formaPago = dr["formaPago"].ToString();
                                obj_entidad.subTotalFactura = dr["subTotalFactura"].ToString();
                                obj_entidad.igvFactura = dr["igvFactura"].ToString();
                                obj_entidad.TotalFactura = dr["TotalFactura"].ToString();

                                obj_entidad.porDetraccion = dr["porDetraccion"].ToString();
                                obj_entidad.totDetraccion = dr["totDetraccion"].ToString();
                                obj_entidad.totalPagar = dr["totalPagar"].ToString();

                                list_cabecera.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_cabecera;
        }

        public object get_documentosCab(int idOrdenCompraCab)
        {
            List<Documentos_E> list_cabecera = new List<Documentos_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_DOCUMENTOS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOrdenCompraCab", SqlDbType.Int).Value = idOrdenCompraCab; 

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Documentos_E obj_entidad = new Documentos_E();

                                obj_entidad.id_Documento = Convert.ToInt32(dr["id_Documento"].ToString());
                                obj_entidad.serieFactura = dr["serieFactura"].ToString();
                                obj_entidad.nroFactura = dr["nroFactura"].ToString();
                                obj_entidad.nroGuia = dr["nroGuia"].ToString();
                                obj_entidad.fechaFactura = Convert.ToDateTime(dr["fechaFactura"].ToString());

                                obj_entidad.subTotal = dr["subTotal"].ToString();
                                obj_entidad.igv = dr["igv"].ToString();
                                obj_entidad.total = dr["total"].ToString();

                                obj_entidad.porDetraccion = dr["porDetraccion"].ToString();
                                obj_entidad.totDetraccion = dr["totDetraccion"].ToString();
                                obj_entidad.totalPagar = dr["totalPagar"].ToString();

                                obj_entidad.idEstado = Convert.ToInt32(dr["idEstado"].ToString());
                                obj_entidad.descripcionEstado = dr["descripcionEstado"].ToString();

                                list_cabecera.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_cabecera;
        }

        public object get_documentosDet(int idDocumentoCab)
        {
            List<DocumentosDet_E> list_cabecera = new List<DocumentosDet_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_DOCUMENTOS_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentoCab", SqlDbType.Int).Value = idDocumentoCab;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                DocumentosDet_E obj_entidad = new DocumentosDet_E();

                                obj_entidad.id_Documento_Det = Convert.ToInt32(dr["id_Documento_Det"].ToString());
                                obj_entidad.codigo = dr["codigo"].ToString();
                                obj_entidad.descripcion = dr["descripcion"].ToString();
                                obj_entidad.cantidadOc = dr["cantidadOc"].ToString();

                                obj_entidad.cantidadIngresoAlmacen = dr["cantidadIngresoAlmacen"].ToString();
                                obj_entidad.cantidadFacturada = dr["cantidadFacturada"].ToString();

                                obj_entidad.cantidadIngresoAprobada = dr["cantidadIngresoAprobada"].ToString();
                                obj_entidad.precio = dr["precio"].ToString();
                                obj_entidad.subTotal = dr["subTotal"].ToString();


                                list_cabecera.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_cabecera;
        }

        public int set_grabarDocumentoCab(int idOrdenCompraCab, string nroFactura, string fechaD, string idUser, int idDocumentoCab, string serieFactura)
        {
            int idNewDoc_bd = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_GRABAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOrdenCompraCab", SqlDbType.Int).Value = idOrdenCompraCab;
                        cmd.Parameters.Add("@idDocumentoCab", SqlDbType.Int).Value = idDocumentoCab;
                        cmd.Parameters.Add("@nroFactura", SqlDbType.VarChar).Value = nroFactura;
                        cmd.Parameters.Add("@fechaD", SqlDbType.VarChar).Value = fechaD;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;
                        cmd.Parameters.Add("@serieFactura", SqlDbType.VarChar).Value = serieFactura;
                        cmd.Parameters.Add("@idDoc_bd", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        idNewDoc_bd = Convert.ToInt32(cmd.Parameters["@idDoc_bd"].Value);

                        return idNewDoc_bd;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_archivosAdicionales( int idDocumentoCab )
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_FILE_ADICIONALES_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentoCab", SqlDbType.Int).Value = idDocumentoCab;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
        
        public object set_eliminarArchivoAdicional(int idDocumentoArchivo)
        {
            Resultado res = new Resultado();
            string sPath = HttpContext.Current.Server.MapPath("~/Archivos/Documentos/" + idDocumentoArchivo);
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_FILE_ADICIONALES_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentoArchivo", SqlDbType.Int).Value = idDocumentoArchivo;
                        cmd.ExecuteNonQuery();
                        
                        if (File.Exists(sPath))
                        {
                            System.IO.File.Delete(sPath);
                        }

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        
        public class download
        {
            public string nombreFile { get; set; }
            public string nombreBd { get; set; }
            public string ubicacion { get; set; }
        }

        public string get_download_archivosAdicionalesImportados(int idDocumentoArchivo, string iduser)
        {
            DataTable dt_detalle = new DataTable();
            List<download> list_files = new List<download>();
            string pathfile = "";
            string rutaOrig = "";
            string rutaDest = "";
            string nombreArchivoReal = "";
            string ruta_descarga = "";

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_FILE_ADICIONALES_DESCARGAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentoArchivo", SqlDbType.Int).Value = idDocumentoArchivo;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/Documentos/");

                            foreach (DataRow Fila in dt_detalle.Rows)
                            {
                                download obj_entidad = new download();
                                obj_entidad.nombreFile = Fila["nombreArchivo"].ToString();
                                obj_entidad.nombreBd = Fila["nombreArchivo_bd"].ToString();
                                obj_entidad.ubicacion = pathfile;

                                list_files.Add(obj_entidad);
                            }

                            ////restaurando el archivo...
                            foreach (download item in list_files)
                            {
                                nombreArchivoReal = "";
                                nombreArchivoReal = item.nombreBd.Replace(item.nombreBd, item.nombreFile);

                                rutaOrig = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Documentos/" + item.nombreBd);
                                rutaDest = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Documentos/Descargas/" + nombreArchivoReal);

                                if (System.IO.File.Exists(rutaDest)) //--- borrando restaurarlo
                                {
                                    System.IO.File.Delete(rutaDest);
                                    System.IO.File.Copy(rutaOrig, rutaDest);
                                }
                                else //--- restaurandolo
                                {
                                    System.IO.File.Copy(rutaOrig, rutaDest);
                                }
                                Thread.Sleep(1000);
                            }


                            if (list_files.Count > 0)
                            {
                                if (list_files.Count == 1)
                                {
                                    ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Documentos/Descargas/" + list_files[0].nombreFile;
                                }
                                //else
                                //{
                                //    ruta_descarga = comprimir_Files(list_files, id_usuario, tipo);
                                //}
                            }
                            else
                            {
                                throw new System.InvalidOperationException("No hay archivo para Descargar");
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return ruta_descarga;
        }
        
        public object get_detalleDocumentosOC(int idOrdenCompraCab)
        {
            List<DocumentosDet_E> list_cabecera = new List<DocumentosDet_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_DETALLE_DOCUMENTO_OC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOrdenCompraCab", SqlDbType.Int).Value = idOrdenCompraCab;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                DocumentosDet_E obj_entidad = new DocumentosDet_E();

                                obj_entidad.checkeado = false;
                                obj_entidad.id = Convert.ToInt32(dr["id"].ToString());
                                obj_entidad.codigo = dr["codigo"].ToString();
                                obj_entidad.descripcion = dr["descripcion"].ToString();
                                obj_entidad.cantidadOc = dr["cantidadOc"].ToString();

                                obj_entidad.cantidadIngresoAlmacen = dr["cantidadIngresoAlmacen"].ToString();
                                obj_entidad.cantidadFacturada = dr["cantidadFacturada"].ToString();
                                
                                obj_entidad.cantidadIngresoAprobada = dr["cantidadIngresoAprobada"].ToString();
                                obj_entidad.precio = dr["precio"].ToString();
                                obj_entidad.subTotal = dr["subTotal"].ToString();


                                list_cabecera.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_cabecera;
        }
        
        public string Set_almacenandoDetalle_documentos(List<Detalle_E> List_Detalle, string idUsuario)
        {
            string Resultado = null;

            DataTable dt_detalle = new DataTable();
            try
            {
                try
                {
                    PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(Detalle_E));
                    foreach (PropertyDescriptor prop in properties)
                    {
                        dt_detalle.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                    }

                    foreach (Detalle_E item in List_Detalle)
                    {
                        DataRow row = dt_detalle.NewRow();
                        foreach (PropertyDescriptor prop in properties)
                            row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                        dt_detalle.Rows.Add(row);
                    }
                }
                catch (Exception ex)
                {
                    Resultado = ex.Message;
                    return Resultado;
                }

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_TEMPORAL_DETALLE_DOCUMENTOS_DELETE", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(bdConexion.cadenaBDcx()))
                    {
                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMPORAL_DETALLE_DOCUMENTOS";
                        bulkCopy.WriteToServer(dt_detalle);
                    }

           
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_GRABAR_DET", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.ExecuteNonQuery();
                    }

                    Resultado = "OK";
                }
            }
            catch (Exception)
            {
                throw;
            }

            return Resultado;
        }

        public object set_editarCantidadDocumentosDet( int idDocumentoDet, string codigoProd, string cantidadIngreso, string precio,  string idUser )
        {
            Resultado res = new Resultado();
 
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_DET_EDITAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentoDet", SqlDbType.Int).Value = idDocumentoDet;
                        cmd.Parameters.Add("@codigoProd", SqlDbType.VarChar).Value = codigoProd;
                        cmd.Parameters.Add("@cantidadIngreso", SqlDbType.VarChar).Value = cantidadIngreso;

                        cmd.Parameters.Add("@precio", SqlDbType.VarChar).Value = precio;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;
 
                        cmd.ExecuteNonQuery(); 

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object set_enviarAprobarDocumentosCab(int idDocumentoCab, string idUser )
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_ENVIAR_APROBAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentoCab", SqlDbType.Int).Value = idDocumentoCab;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        
        public object get_estadosDocumentosCab(string fechaIni, string fechaFin,string nroOC, string idEstado, int idProveedor, string idCentroCostro)
        {
            List<EstadosDocumentos_E> list_cabecera = new List<EstadosDocumentos_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ESTADO_FACTURAS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@nroOC", SqlDbType.VarChar).Value = nroOC;
                        cmd.Parameters.Add("@idEstado", SqlDbType.VarChar).Value = idEstado;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCostro;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                EstadosDocumentos_E obj_entidad = new EstadosDocumentos_E();

                                obj_entidad.id_Documento = Convert.ToInt32(dr["id_Documento"].ToString());
                                obj_entidad.nroFactura = dr["nroFactura"].ToString();
                                obj_entidad.fecha = dr["fecha"].ToString();
                                obj_entidad.subTotal = dr["subTotal"].ToString();

                                obj_entidad.igv = dr["igv"].ToString();
                                obj_entidad.total = dr["total"].ToString();
                                obj_entidad.nroOC = dr["nroOC"].ToString();
                                obj_entidad.tipoOC = dr["tipoOC"].ToString();

                                obj_entidad.formaPago = dr["formaPago"].ToString();
                                obj_entidad.fechaAprox = dr["fechaAprox"].ToString();
                                obj_entidad.idEstado = dr["idEstado"].ToString();
                                obj_entidad.estado = dr["estado"].ToString();

                                obj_entidad.nroVoucher = dr["nroVoucher"].ToString();
                                obj_entidad.fechaPago = dr["fechaPago"].ToString();
                                obj_entidad.comentariosPago = dr["comentariosPago"].ToString();


                                obj_entidad.porDetraccion = dr["porDetraccion"].ToString();
                                obj_entidad.totDetraccion = dr["totDetraccion"].ToString();
                                obj_entidad.totalPagar = dr["totalPagar"].ToString();


                                list_cabecera.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_cabecera;
        }
        
        public DataTable get_verificacion_serieNroDocumento(int idOrdenCompraCab, int  idProveedor, string serieDoc, string  nroDoc, string idUser)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_VERIFICAR_SERIE_NRO_DOC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOrdenCompraCab", SqlDbType.Int).Value = idOrdenCompraCab;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@serieDoc", SqlDbType.VarChar).Value = serieDoc;
                        cmd.Parameters.Add("@nroDoc", SqlDbType.VarChar).Value = nroDoc;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUser;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
        
        public DataTable get_formaPago()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_COMBO_FORMA_PAGO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public DataTable get_estadosAprobacionFactura()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_COMBO_ESTADOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
                
        public object get_aprobacionFacturasCab(string nroFactura, string nroOC, string Proveedor,string idFormaPago,string idEstado,string idUsuario , string idCentroCostro)
        {
            List<AprobarFacturas_E> list_cabecera = new List<AprobarFacturas_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroFactura", SqlDbType.VarChar).Value = nroFactura;
                        cmd.Parameters.Add("@nroOC", SqlDbType.VarChar).Value = nroOC;
                        cmd.Parameters.Add("@Proveedor", SqlDbType.VarChar).Value = Proveedor;
                        cmd.Parameters.Add("@idFormaPago", SqlDbType.VarChar).Value = idFormaPago;
                        cmd.Parameters.Add("@idEstado", SqlDbType.VarChar).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCostro;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AprobarFacturas_E obj_entidad = new AprobarFacturas_E();


                                obj_entidad.checkeado =  false;
                                obj_entidad.idFacturaCab = Convert.ToInt32(dr["idFacturaCab"].ToString());
 
                                obj_entidad.nroFactura = dr["nroFactura"].ToString();
                                obj_entidad.fecha = dr["fecha"].ToString();
                                obj_entidad.proveedor = dr["proveedor"].ToString();
                                obj_entidad.subTotal = dr["subTotal"].ToString();
                                obj_entidad.igv = dr["igv"].ToString();
                                obj_entidad.total = dr["total"].ToString();

                                obj_entidad.nroOC = dr["nroOC"].ToString();
                                obj_entidad.tipoOC = dr["tipoOC"].ToString();
                                obj_entidad.formaPago = dr["formaPago"].ToString();
                                obj_entidad.fechaAproxPago = dr["fechaAproxPago"].ToString();
                                obj_entidad.idEstado = dr["idEstado"].ToString();

                                obj_entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                obj_entidad.usuarioAprobador1 = dr["usuarioAprobador1"].ToString();
                                obj_entidad.fechaAprobacion1 = dr["fechaAprobacion1"].ToString();

                                obj_entidad.usuarioAprobador2 = dr["usuarioAprobador2"].ToString();
                                obj_entidad.fechaAprobacion2 = dr["fechaAprobacion2"].ToString();
                                obj_entidad.usuarioDevuelve = dr["usuarioDevuelve"].ToString();
                                obj_entidad.fechaDevuelve = dr["fechaDevuelve"].ToString();

                                obj_entidad.porDetraccion = dr["porDetraccion"].ToString();
                                obj_entidad.totDetraccion = dr["totDetraccion"].ToString();
                                obj_entidad.totalPagar = dr["totalPagar"].ToString();

                                list_cabecera.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_cabecera;
        }
        
        public object set_aprobarFacturacion_masivo(string codigosIdFact, string idUser)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_APROBAR_MASIVO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocMasivos", SqlDbType.VarChar).Value = codigosIdFact;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public DataTable get_detalleFacturaCab(int idFacturaCab )
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_DETALLE_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFacturaCab", SqlDbType.Int).Value = idFacturaCab;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
        
        public object set_aprobarDevolverFacturacion( int idFacturaCab, int opcionProceso , string idUser, int facturaCancelada)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_APROBAR_DEVOLVER", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFacturaCab", SqlDbType.Int).Value = idFacturaCab;
                        cmd.Parameters.Add("@opcionProceso", SqlDbType.Int).Value = opcionProceso;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;
                        cmd.Parameters.Add("@facturaCancelada", SqlDbType.Int).Value = facturaCancelada;

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        
        public DataTable get_listadoItemFacturacion(int idFacturaCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_LISTADO_ITEMS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFacturaCab", SqlDbType.Int).Value = idFacturaCab;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public DataTable get_listadoDocumentosFacturacion(int idFacturaCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_LISTADO_DOCUMENTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFacturaCab", SqlDbType.Int).Value = idFacturaCab;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }


        public DataTable get_cuentaContable_gastos()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_COMBO_CTA_GASTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
        
        public DataTable get_cuentaContable_igv()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_COMBO_CTA_IGV", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public DataTable get_cuentaContable_pagar()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_COMBO_CTA_PAGAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public DataTable get_cuentaContable_detraccion()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_COMBO_CTA_DETRACCION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }


        public object set_saveUpdate_cuentasContables(int id_Glosa, int id_Documento, string importeDocumento, string Glosa, string CtaGastos, string CtaIGV, string CtaxPagar, string idUser, string CtaDetraccion)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_SAVE_UPDATE_CTA_CONTABLES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Glosa", SqlDbType.Int).Value = id_Glosa;
                        cmd.Parameters.Add("@id_Documento", SqlDbType.Int).Value = id_Documento;
                        cmd.Parameters.Add("@importeDocumento", SqlDbType.VarChar).Value = importeDocumento;

                        cmd.Parameters.Add("@Glosa", SqlDbType.VarChar).Value = Glosa;
                        cmd.Parameters.Add("@CtaGastos", SqlDbType.VarChar).Value = CtaGastos;
                        cmd.Parameters.Add("@CtaIGV", SqlDbType.VarChar).Value = CtaIGV;
                        cmd.Parameters.Add("@CtaxPagar", SqlDbType.VarChar).Value = CtaxPagar;                   
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;
                        cmd.Parameters.Add("@CtaDetraccion", SqlDbType.VarChar).Value = CtaDetraccion;

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        
        public DataTable get_detalle_cuentasContables(int idFacturaCab, string idUser)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_LISTADO_CTAS_CONTABLES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFacturaCab", SqlDbType.Int).Value = idFacturaCab;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
               
        public object set_saveUpdate_cuentasContables_cajaChica(int id_LiquidacionCaja_Det , string Glosa, int CtaGastos, int CtaIGV, int CtaxPagar, string idUser)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_CAJA_CHICA_UPDATE_CTA_CONTABLES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_LiquidacionCaja_Det", SqlDbType.Int).Value = id_LiquidacionCaja_Det;
                        cmd.Parameters.Add("@Glosa", SqlDbType.VarChar).Value = Glosa;
                        cmd.Parameters.Add("@CtaGastos", SqlDbType.Int).Value = CtaGastos;
                        cmd.Parameters.Add("@CtaIGV", SqlDbType.Int).Value = CtaIGV;
                        cmd.Parameters.Add("@CtaxPagar", SqlDbType.Int).Value = CtaxPagar;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public DataTable get_documentosVencidos()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_COMBO_DOC_VENCIDOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }


        public DataTable get_centroCosto_distribucion( string idUser)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_COMBO_CC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUser;


                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }


        public DataTable get_detalle_distribucionCCosto(int idFacturaCab, string idUser)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_LISTADO_DISTRIBUCION_CC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFacturaCab", SqlDbType.Int).Value = idFacturaCab;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
        
        public object set_saveUpdate_distribucion_centroCosto(int id_documento_cc, int  id_documento, string idCentroCosto, string total_importe,string porcentaje, string idUser )
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_SAVE_UPDATE_DISTRIBUCION_CC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_documento_cc", SqlDbType.Int).Value = id_documento_cc;
                        cmd.Parameters.Add("@id_documento", SqlDbType.Int).Value = id_documento;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCosto;

                        cmd.Parameters.Add("@total_importe", SqlDbType.VarChar).Value = total_importe;
                        cmd.Parameters.Add("@porcentaje", SqlDbType.VarChar).Value = porcentaje; 
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser; 

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object set_saveCuentaContable(string valorCuentaContable,string tipoCuentaContable,string idUser )
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_FACTURAS_SAVE_CUENTA_CONTABLE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipoCuentaContable", SqlDbType.VarChar).Value = tipoCuentaContable;
                        cmd.Parameters.Add("@valorCuentaContable", SqlDbType.VarChar).Value = valorCuentaContable;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUser;

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public DataTable get_proveedoresUsuario( string idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_FACTURAS_COMBO_PROVEEDORES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }


    }
}
