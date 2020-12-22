using Entidades.ControlObras.Procesos;
using Negocio.Conexion;
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

namespace Negocio.ControlObras.Procesos
{
    public class BandejaAtencion_BL
    {
        public object get_bandejaAtencionCab( string idLocal, string nroObra, string  jefeCuadrilla, string idEstado  )
        {
            List<BandejaAtencion_E> list_cabecera = new List<BandejaAtencion_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Web_Bandeja_ListaParteDiario", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Local", SqlDbType.VarChar).Value = idLocal;
                        cmd.Parameters.Add("@Obra", SqlDbType.VarChar).Value = nroObra;
                        cmd.Parameters.Add("@JefeCuadrilla", SqlDbType.VarChar).Value = jefeCuadrilla;
                        cmd.Parameters.Add("@Estado", SqlDbType.VarChar).Value = idEstado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                BandejaAtencion_E obj_entidad = new BandejaAtencion_E();

                                obj_entidad.Id_ParteDiario = dr["Id_ParteDiario"].ToString();
                                obj_entidad.ParteDiario_ObraTD = dr["ParteDiario_ObraTD"].ToString();
                                obj_entidad.ParteDiario_Fecha = dr["ParteDiario_Fecha"].ToString();
                                obj_entidad.CC = dr["CC"].ToString();
                                obj_entidad.Cuadrilla = dr["Cuadrilla"].ToString();

                                obj_entidad.ParteDiario_Suministro = dr["ParteDiario_Suministro"].ToString();
                                obj_entidad.NroActa = dr["NroActa"].ToString();
                                obj_entidad.ParteDiario_Latitud = dr["ParteDiario_Latitud"].ToString();

                                obj_entidad.ParteDiario_Longitud = dr["ParteDiario_Longitud"].ToString();
                                obj_entidad.Pub_Esta_Codigo = dr["Pub_Esta_Codigo"].ToString();
                                obj_entidad.Estado = dr["Estado"].ToString();


                                obj_entidad.fechaEjecucion = dr["fechaEjecucion"].ToString();
                                obj_entidad.horaInicio = dr["horaInicio"].ToString();
                                obj_entidad.idInspectorCliente = dr["idInspectorCliente"].ToString();
                                obj_entidad.idSupervisor = dr["idSupervisor"].ToString();

                                obj_entidad.observacion = dr["observacion"].ToString();
                                obj_entidad.fechaLiquidacion = dr["fechaLiquidacion"].ToString();
 

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
        
        public DataTable get_locales(string idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Movil_GetSucursales", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = idusuario;

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

        public DataTable get_centroCosto( string idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Movil_GetCentroCostos", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codigoUsuario", SqlDbType.VarChar).Value = idusuario;

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

        public DataTable get_jefeCuadrilla(string idCentroCosto)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Movil_GetCuadrillas", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@centroCostoId", SqlDbType.VarChar).Value = idCentroCosto;

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
                    using (SqlCommand cmd = new SqlCommand("Movil_GetEstados", cn))
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

        public DataTable get_inspector()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Movil_GetUsuario_Coordinador_C", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Codigo_OP", SqlDbType.VarChar).Value = "0001/0001";

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

        public DataTable get_supervisor()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Movil_GetSupervisorENEL", cn))
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
        
        public string set_actualizarParteDiario( string idParteDiario, string inspector,  string supervisor,string  observacion, string fechaLiquidacion, string idUsuario)
        { 
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_ACTUALIZAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario", SqlDbType.VarChar).Value = idParteDiario;
                        cmd.Parameters.Add("@idInspector", SqlDbType.VarChar).Value = inspector;
                        cmd.Parameters.Add("@idSupervisor", SqlDbType.VarChar).Value = supervisor; 

                        cmd.Parameters.Add("@observacion", SqlDbType.VarChar).Value = observacion;
                        cmd.Parameters.Add("@fechaLiquidacion", SqlDbType.VarChar).Value = fechaLiquidacion;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;
 
                        cmd.ExecuteNonQuery();

                        return "OK";
              
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
 
        }

        public string set_cerrandoParteDiario(string idParteDiario, string idUsuario)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_CERRAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario", SqlDbType.VarChar).Value = idParteDiario;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        cmd.ExecuteNonQuery();

                        return "OK";

                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

        }
        
        public List<BandejaAtencion_Baremos_E> get_baremos()
        { 
            List<BandejaAtencion_Baremos_E> list_baremos = new List<BandejaAtencion_Baremos_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_BAREMOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                BandejaAtencion_Baremos_E obj_entidad = new BandejaAtencion_Baremos_E();
                                
                                obj_entidad.idBaremo = dr["idBaremo"].ToString();
                                obj_entidad.codigoBaremo = dr["codigoBaremo"].ToString();
                                obj_entidad.descripcion_Baremo = dr["descripcion_Baremo"].ToString();
                                obj_entidad.unidadMedida = dr["unidadMedida"].ToString();
                                obj_entidad.precioBaremo = dr["precioBaremo"].ToString();

                                list_baremos.Add(obj_entidad);
                            }
                        }

                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_baremos;
        }

        public DataTable get_actividad()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Movil_GetActividad", cn))
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
        
        public int set_grabarParteDiario_baremo(string idParteDiario,string idActividad,string idBaremo, string cantidadAprobada, string precioBaremo, string importe, string idUsuario)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_GRABAR_BAREMO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario", SqlDbType.VarChar).Value = idParteDiario;

                        cmd.Parameters.Add("@idActividad", SqlDbType.VarChar).Value = idActividad;
                        cmd.Parameters.Add("@idBaremo", SqlDbType.VarChar).Value = idBaremo;

                        cmd.Parameters.Add("@cantidadAprobada", SqlDbType.VarChar).Value = cantidadAprobada;
                        cmd.Parameters.Add("@precioBaremo", SqlDbType.VarChar).Value = precioBaremo;
                        cmd.Parameters.Add("@importe", SqlDbType.VarChar).Value = importe;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.Parameters.Add("@idParteDiario_baremo", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        return  Convert.ToInt32(cmd.Parameters["@idParteDiario_baremo"].Value);

                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public string set_actualizarParteDiario_baremo(string idParteDiario_baremo, string cantidadAprobada, string precioBaremo, string importe, string idUsuario)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_ACTUALIZAR_BAREMO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario_baremo", SqlDbType.VarChar).Value = idParteDiario_baremo;
                        cmd.Parameters.Add("@cantidadAprobada", SqlDbType.VarChar).Value = cantidadAprobada;
                        cmd.Parameters.Add("@precioBaremo", SqlDbType.VarChar).Value = precioBaremo;
                        cmd.Parameters.Add("@importe", SqlDbType.VarChar).Value = importe;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        cmd.ExecuteNonQuery();
                        return "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

        }

        public DataTable get_parteDiario_baremos(string idParteDiario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_LISTAR_BAREMO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario", SqlDbType.VarChar).Value = idParteDiario;

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
        
        public string set_eliminarParteDiario_baremo(string idParteDiario_baremo)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_ELIMINAR_BAREMO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario_baremo", SqlDbType.VarChar).Value = idParteDiario_baremo;

                        cmd.ExecuteNonQuery();
                        return "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

        }

        public DataTable get_almacenes(string idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Movil_GetAlmacenes", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@sucursal", SqlDbType.VarChar).Value = "";
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = idUsuario;

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

        public DataTable get_parteDiario_material(string idParteDiario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_LISTAR_MATERIAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario", SqlDbType.VarChar).Value = idParteDiario;

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

        public string set_actualizarParteDiario_material( string idParteDiario_articulo, string cantidad, string idUsuario)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_ACTUALIZAR_MATERIAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario_material", SqlDbType.VarChar).Value = idParteDiario_articulo;
                        cmd.Parameters.Add("@cantidadAprobada", SqlDbType.VarChar).Value = cantidad;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        cmd.ExecuteNonQuery();
                        return "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

        }

        public string set_eliminarParteDiario_material(string idParteDiario_articulo)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_ELIMINAR_MATERIAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario_material", SqlDbType.VarChar).Value = idParteDiario_articulo;

                        cmd.ExecuteNonQuery();
                        return "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

        }
        
        public DataTable get_parteDiario_fotos(string idParteDiario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_LISTAR_FOTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idParteDiario", SqlDbType.VarChar).Value = idParteDiario;

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


        public class download
        {
            public string nombreFile { get; set; }
            public string nombreBd { get; set; }
            public string ubicacion { get; set; }
        }

        public string get_download_parteDiario_fotos(string idFotos, string iduser)
        {
            DataTable dt_detalle = new DataTable();
            List<download> list_files = new List<download>();
            string pathfile = "";
            string ruta_descarga = "";

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PARTE_DIARIO_LISTAR_FOTOS_ZIP", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFotos", SqlDbType.VarChar).Value = idFotos;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/Fotos/");

                            foreach (DataRow Fila in dt_detalle.Rows)
                            {
                                download obj_entidad = new download();
                                obj_entidad.nombreFile = Fila["nombreArchivo"].ToString();
                                obj_entidad.ubicacion = pathfile;
                                list_files.Add(obj_entidad);
                            }

                            if (list_files.Count > 0)
                            {
                                if (list_files.Count == 1)
                                {
                                    ruta_descarga = ConfigurationManager.AppSettings["ServerFilesFoto"] + "Descargas/" + list_files[0].nombreFile;
                                }
                                else
                                {
                                    ruta_descarga = comprimir_Files(list_files, iduser);
                                }
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

        public string comprimir_Files(List<download> list_download, string usuario_creacion)
        {
            string resultado = "";
            try
            {
                string ruta_destino = "";
                string ruta_descarga = "";
                string pathFoto = "";
                
                ruta_destino = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Fotos/Descargas/VisorFotos" + usuario_creacion + "Descarga.zip");
                ruta_descarga = ConfigurationManager.AppSettings["ServerFilesFoto"] + "Descargas/VisorFotos" + usuario_creacion + "Descarga.zip";

                if (File.Exists(ruta_destino)) /// verificando si existe el archivo zip
                {
                    System.IO.File.Delete(ruta_destino);
                }
                using (Ionic.Zip.ZipFile zip = new Ionic.Zip.ZipFile())
                {
                    foreach (download item in list_download)
                    {
                        pathFoto = item.ubicacion + item.nombreFile;
                        if (System.IO.File.Exists(pathFoto))
                        {
                            zip.AddFile(pathFoto, "");
                        }
                    }
                    // Guardando el archivo zip 
                    zip.Save(ruta_destino);
                }
                Thread.Sleep(2000);

                if (File.Exists(ruta_destino))
                {
                    resultado = ruta_descarga;
                }
                else
                {
                    throw new System.InvalidOperationException("No se pudo generar la Descarga del Archivo");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return resultado;
        }


    }
}
