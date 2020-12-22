using Entidades.Logistica.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading;
using System.Web;

namespace Negocio.Logistisca.Proceso
{
    public class OrdenCompraAdjuntar_BL
    {        
        public object get_ordenCompraAdjuntarCab(string idTipoOc, string fechaInicial, string fechaFinal, string idEstado, string nroOC)
        {
            List<OrdenCompraAdjuntar_E> list_detalle = new List<OrdenCompraAdjuntar_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipoOc", SqlDbType.VarChar).Value = idTipoOc;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaInicial;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFinal;
                        cmd.Parameters.Add("@estado", SqlDbType.VarChar).Value = idEstado;
                        cmd.Parameters.Add("@nroOC", SqlDbType.VarChar).Value = nroOC;
                        
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                OrdenCompraAdjuntar_E obj_entidad = new OrdenCompraAdjuntar_E();

                                obj_entidad.idOrdenCompra = dr["idOrdenCompra"].ToString();
                                obj_entidad.tipoOc = dr["tipoOc"].ToString();
                                obj_entidad.nroOC = dr["nroOC"].ToString();
                                obj_entidad.fechaEmision = dr["fechaEmision"].ToString();
                                obj_entidad.centroCosto = dr["centroCosto"].ToString();

                                obj_entidad.proveedor = dr["proveedor"].ToString();
                                obj_entidad.formaPago = dr["formaPago"].ToString();
                                obj_entidad.moneda = dr["moneda"].ToString();
                                obj_entidad.subTotal = dr["subTotal"].ToString();

                                obj_entidad.igv = dr["igv"].ToString();
                                obj_entidad.total = dr["total"].ToString();
                                obj_entidad.nroPedido = dr["nroPedido"].ToString();

                                list_detalle.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_detalle;
        }
        
        public DataTable get_tipoOrdenCompra()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_TIPO_OC", cn))
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
        
        public DataTable get_estado()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_ESTADO", cn))
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
                
        public DataTable get_tipoDocumento()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_TIPO_DOCUMENTO", cn))
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
        
        public DataTable get_archivosOrdenCompra(string idOrdenCompra,  string opcionModal)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_LISTAR_ARCHIVOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOrdenCompra", SqlDbType.VarChar).Value = idOrdenCompra;
                        cmd.Parameters.Add("@opcionImportacion", SqlDbType.Int).Value = (opcionModal == "cotizacion") ? 1 : 2;

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

        public object set_AnulandoFile_ordenCompra(string idFileOrdenCompra)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_ANULAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFileOrdenCompra", SqlDbType.VarChar).Value = idFileOrdenCompra;
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
        
        public class download
        {
            public string nombreFile { get; set; }
            public string nombreBd { get; set; }
            public string ubicacion { get; set; }
        }

        public string get_download_archivosImportadosOC(string idFileOrdenCompra, string idusuario)
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
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_DESCARGAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFileOrdenCompra", SqlDbType.VarChar).Value = idFileOrdenCompra;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/OrdenCompra/");

                            foreach (DataRow Fila in dt_detalle.Rows)
                            {
                                download obj_entidad = new download();
                                obj_entidad.nombreFile = Fila["nombreArchivo"].ToString();
                                obj_entidad.nombreBd = Fila["nombreArchivo_bd"].ToString();
                                obj_entidad.ubicacion = pathfile;

                                list_files.Add(obj_entidad);
                            }

                            ////----- restaurando el archivo...
                            foreach (download item in list_files)
                            {
                                nombreArchivoReal = "";
                                nombreArchivoReal = item.nombreBd.Replace(item.nombreBd, item.nombreFile);

                                rutaOrig = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/OrdenCompra/" + item.nombreBd);
                                rutaDest = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/OrdenCompra/Descargas/" + nombreArchivoReal);

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
                                    ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "OrdenCompra/descargas/" + list_files[0].nombreFile;
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


        public object set_EditandoFile_ordenCompra(string idFileOrdenCompra, string tipoDoc, string nroDoc, string fecha, string importe)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_ADJUNTAR_EDITAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFileOrdenCompra", SqlDbType.VarChar).Value = idFileOrdenCompra;
                        cmd.Parameters.Add("@tipoDoc", SqlDbType.VarChar).Value = tipoDoc;
                        cmd.Parameters.Add("@nroDoc", SqlDbType.VarChar).Value = nroDoc;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                        cmd.Parameters.Add("@importe", SqlDbType.VarChar).Value = importe;
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



    }
}
