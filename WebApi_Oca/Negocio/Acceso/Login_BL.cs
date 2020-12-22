using Negocio.Conexion;
 
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Negocio.Acceso
{
   public class Login_BL
    {

        public string set_proveedor_insertUpdate(int idProveedor, string tipo, string idusuario)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_INSERT_UPDATE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idusuario;
                        cmd.ExecuteNonQuery();

                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }

        public DataTable get_ListadoArchivosProveedor(int idProveedor)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_FILE_PROVEEDOR_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public string set_Eliminar_archivoProveedor(int idProveedorArchivo)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_FILE_PROVEEDOR_DELETE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedorArchivo", SqlDbType.Int).Value = idProveedorArchivo;
                        cmd.ExecuteNonQuery();

                        string sPath = HttpContext.Current.Server.MapPath("~/Archivos/Proveedor/" + idProveedorArchivo);
                        if (File.Exists(sPath))
                        {
                            File.Delete(sPath);
                        }               

                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }

        public string set_enviandoInformacionProveedor(int idProveedor, string idusuario)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_ENVIAR_REGISTRO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idusuario", SqlDbType.VarChar).Value = idusuario;
                        cmd.ExecuteNonQuery();


                        set_envioCorreo_registroProveedores(idProveedor, idusuario);

                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }

        public void set_envioCorreo_registroProveedores(int idProveedor, string idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_proveedor(idProveedor, idusuario);

                if (dt_detalleMail.Rows.Count > 0)
                {
                    if (dt_detalleMail.Rows[0]["destinatario"].ToString().Length > 0)
                    {
                        var message = new MailMessage();
                        message.From = new MailAddress(dt_detalleMail.Rows[0]["remitente"].ToString());
                        message.To.Add(new MailAddress(dt_detalleMail.Rows[0]["destinatario"].ToString()));
                        message.Subject = dt_detalleMail.Rows[0]["asunto"].ToString();
                        message.Body = dt_detalleMail.Rows[0]["cuerpoMensaje"].ToString();
                        message.IsBodyHtml = true;
                        message.Priority = MailPriority.Normal;

                        //---agregando la copia del correo 
                        if (dt_detalleMail.Rows[0]["copiaDestinatario"].ToString().Length > 0)
                        {
                            message.CC.Add(new MailAddress(dt_detalleMail.Rows[0]["copiaDestinatario"].ToString()));
                        }
                        using (var smtp = new SmtpClient())
                        {
                            smtp.EnableSsl = true;
                            smtp.UseDefaultCredentials = false;

                            var credential = new NetworkCredential(dt_detalleMail.Rows[0]["remitente"].ToString(), dt_detalleMail.Rows[0]["remitentePass"].ToString());
                            smtp.Credentials = credential;
                            smtp.Host = "smtp.gmail.com";
                            smtp.Port = 587;
                            smtp.Send(message);
                        }
                    }
                    else
                    {
                        throw new System.ArgumentException("Error al envio de correo no hay correo de destinatario");
                    }
                }
                else
                {
                    throw new System.ArgumentException("Error al envio de correo no hay informacion para enviar");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_datosEnviosCorreo_proveedor(int idProveedor, string idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idusuario", SqlDbType.VarChar).Value = idusuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public class download
        {
            public string nombreFile { get; set; }
            public string nombreBd { get; set; }
            public string ubicacion { get; set; }
        }

        public string get_download_archivosImportados(int idProveedorArchivo, string iduser)
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
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_DESCARGAR_FILE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedorArchivo", SqlDbType.Int).Value = idProveedorArchivo;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/Proveedor/");

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

                                rutaOrig = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/" + item.nombreBd);
                                rutaDest = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/Descargas/" + nombreArchivoReal);

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
                                    ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Proveedor/Descargas/" + list_files[0].nombreFile;
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
                
        public DataTable get_detalleProveedor(int idProveedor)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_EDITAR_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_estadosProveedorCab(int idProveedor, string idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ESTADO_EVALUACION_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_buscandoRuc(string nroRuc, string idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_BUSCAR_RUC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroRuc", SqlDbType.VarChar).Value = nroRuc;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public string set_actualizarConstraseniaEncryptada(int idProveedor,  string claveEncryptada)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REGISTRO_PROVEEDOR_UPDATE_CLAVE_ENCRYPTADA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@claveEncryptada", SqlDbType.VarChar).Value = claveEncryptada; 
 
                        cmd.ExecuteNonQuery();

                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }

    }
}
