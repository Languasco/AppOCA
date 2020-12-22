using Entidades.Proveedores.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Negocio.Proveedores.Procesos
{
    public class CajaChica_BL
    {
        public object get_liquidacionCajaChicaCab(string idCentroCosto, string fechaIni, string fechaFin, string idEstado, string IdUsuarios)
        {
            List<CajaChica_E> list_cabecera = new List<CajaChica_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCosto;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.VarChar).Value = idEstado;
                        cmd.Parameters.Add("@IdUsuarios", SqlDbType.VarChar).Value = IdUsuarios;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                CajaChica_E obj_entidad = new CajaChica_E();

                                obj_entidad.id_LiquidacionCaja_Cab = Convert.ToInt32(dr["id_LiquidacionCaja_Cab"].ToString());
                                obj_entidad.nroLiquidacion = dr["nroLiquidacion"].ToString();
                                obj_entidad.periodoEvaluacion = dr["periodoEvaluacion"].ToString();
                                obj_entidad.fechaRegistro = Convert.ToDateTime( dr["fechaRegistro"].ToString() );

                                obj_entidad.usuarioGeneracion = dr["usuarioGeneracion"].ToString();
                                obj_entidad.cantidadDoc = dr["cantidadDoc"].ToString();
                                obj_entidad.idEstado = dr["idEstado"].ToString();
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

        public DataTable get_estadoCajaChica()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_COMBO_ESTADOS", cn))
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
        
        public int set_grabarLiquidacionCab(int idLiquidacionCajaCab, string idCentroCosto, string fechaI, string fechaF, string idUser )
        {
            int idNewDoc_bd = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_GRABAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLiquidacionCajaCab", SqlDbType.Int).Value = idLiquidacionCajaCab;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCosto;
                        cmd.Parameters.Add("@fechaInicial", SqlDbType.VarChar).Value = fechaI;
                        cmd.Parameters.Add("@fechaFinal", SqlDbType.VarChar).Value = fechaF;
                        cmd.Parameters.Add("@idUser", SqlDbType.VarChar).Value = idUser;
 
                        cmd.Parameters.Add("@idCaja_bd", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        idNewDoc_bd = Convert.ToInt32(cmd.Parameters["@idCaja_bd"].Value);

                        return idNewDoc_bd;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_liquidacionDetalle( int id_LiquidacionCajaCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_DETALLE_LIQUIDACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_LiquidacionCajaCab", SqlDbType.Int).Value = id_LiquidacionCajaCab;

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
        
        public object set_eliminarLiquidacionDetalle(int id_LiquidacionCaja_Det)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_DETALLE_LIQUIDACION_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_LiquidacionCaja_Det", SqlDbType.Int).Value = id_LiquidacionCaja_Det;
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
        
        public object get_liquidacionesCabDet(int idLiquidacionCaja_Cab, string idUsuario)
        {
            DataTable dt_cabecera = new DataTable();
            DataTable dt_detalle = new DataTable();
            object evaluacion;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_CABECERA_LIQUIDACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLiquidacionCaja_Cab", SqlDbType.Int).Value = idLiquidacionCaja_Cab;
       
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_cabecera);
                        }
                    }
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_DETALLE_LIQUIDACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_LiquidacionCajaCab", SqlDbType.Int).Value = idLiquidacionCaja_Cab;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    evaluacion = new
                    {
                        liquidacionesCab = dt_cabecera,
                        liquidacionesDet = dt_detalle
                    };
                }
            }
            catch (Exception)
            {
                throw;
            }
            return evaluacion;
        }
        
        public DataTable get_documentosCajaChica(int idLiquidacionCaja_Cab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_FILE_DOCUMENTOS_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLiquidacionCaja_Cab", SqlDbType.Int).Value = idLiquidacionCaja_Cab;

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
        
        public object get_eliminarDocumentoCajaChica(int idLiquidacion_Archivo)
        {
            Resultado res = new Resultado();
            string sPath = HttpContext.Current.Server.MapPath("~/Archivos/CajaChica/" + idLiquidacion_Archivo);
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_FILE_DOCUMENTOS_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Liquidacion_Archivo", SqlDbType.Int).Value = idLiquidacion_Archivo;
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

        public string get_download_documentoCajaChica(int idLiquidacion_Archivo, string iduser)
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
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_FILE_DOCUMENTOS_DESCARGAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Liquidacion_Archivo", SqlDbType.Int).Value = idLiquidacion_Archivo;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/CajaChica/");

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

                                rutaOrig = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/CajaChica/" + item.nombreBd);
                                rutaDest = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/CajaChica/Descargas/" + nombreArchivoReal);

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
                                    ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "CajaChica/Descargas/" + list_files[0].nombreFile;
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
        
        public object set_enviarAprobarDocumentosLiquidacion_Cab(int idLiquidacionCaja_Cab, string idUser)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_ENVIAR_APROBAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLiquidacionCaja_Cab", SqlDbType.Int).Value = idLiquidacionCaja_Cab;
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



    }
}
