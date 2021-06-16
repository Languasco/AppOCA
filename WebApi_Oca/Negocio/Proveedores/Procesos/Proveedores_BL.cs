using Entidades.Proveedores.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Proveedores.Procesos
{
    public class Proveedores_BL
    {

        public object get_nuevosProveedoresCab(string nroObra, string idEstado, string idCentroCostro)
        {
            List<Proveedor_E> list_cabecera = new List<Proveedor_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_NUEVOS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroObra", SqlDbType.VarChar).Value = nroObra;
                        cmd.Parameters.Add("@idEstado", SqlDbType.VarChar).Value = idEstado;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCostro;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Proveedor_E obj_entidad = new Proveedor_E();

                                obj_entidad.id_Proveedor = Convert.ToInt32(dr["id_Proveedor"].ToString());
                                obj_entidad.tipoProveedor = dr["tipoProveedor"].ToString();
                                obj_entidad.ruc = dr["ruc"].ToString();
                                obj_entidad.razonSocial = dr["razonSocial"].ToString();

                                obj_entidad.actEconomica = dr["actEconomica"].ToString();
                                obj_entidad.direccion = dr["direccion"].ToString();
                                obj_entidad.pais = dr["pais"].ToString();

                                obj_entidad.departamento = dr["departamento"].ToString();
                                obj_entidad.idEstado = dr["idEstado"].ToString();
                                obj_entidad.estado = dr["estado"].ToString();

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
        
        public object set_aprobarRechazar_proveedor(int idProveedor, string descripcion, string opcionProceso, string idUser)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_NUEVOS_APROBAR_RECHAZAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = descripcion;
                        cmd.Parameters.Add("@opcionProceso", SqlDbType.VarChar).Value = opcionProceso; 
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
        
        public DataTable get_centroCostro(string idUser )
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_Evaluaciones_Combo", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Tipo", SqlDbType.Int).Value = 1;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUser;

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

        public DataTable get_tipoResultado(string idUser)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_Evaluaciones_Combo", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Tipo", SqlDbType.Int).Value = 2;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUser;

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

        public object get_visualizarPreliminar(string idCentroCostro, string idTipoResultado, string fechaIni, string fechaFin, string porcEvaluacion, string idUsuario)
        {
            List<vistaPreliminarProveedor_E> list_cabecera = new List<vistaPreliminarProveedor_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_VISTA_PRELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCentroCostro", SqlDbType.VarChar).Value = idCentroCostro;
                        cmd.Parameters.Add("@idTipoResultado", SqlDbType.VarChar).Value = idTipoResultado;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;

                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@porcEvaluacion", SqlDbType.VarChar).Value = porcEvaluacion;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                vistaPreliminarProveedor_E obj_entidad = new vistaPreliminarProveedor_E();

                                if (dr["flagColorear"].ToString() == "1")
                                {
                                    obj_entidad.checkeado = true;
                                }
                                else {
                                    obj_entidad.checkeado = false;
                                }
            
                                obj_entidad.idProveedor = Convert.ToInt32(dr["idProveedor"].ToString());
                                obj_entidad.ruc = dr["ruc"].ToString();
                                obj_entidad.razonSocial = dr["razonSocial"].ToString();
                                obj_entidad.importeFacturado = dr["importeFacturado"].ToString();
                                obj_entidad.porcVentas = dr["porcVentas"].ToString();
                                obj_entidad.porcEvaluacion = dr["porcEvaluacion"].ToString();
                                obj_entidad.flagColorear = dr["flagColorear"].ToString();

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
        
        public object set_generarEvaluacionProveedor(string idCentroCostro, string idTipoResultado, string fechaIni, string fechaFin, string proveedorMasivo , string idUsuario)
        {
            Resultado res = new Resultado();
            int idEvaluacion = 0;

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_GENERAR_EVALUACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCentroCostro", SqlDbType.VarChar).Value = idCentroCostro;
                        cmd.Parameters.Add("@idTipoResultado", SqlDbType.VarChar).Value = idTipoResultado;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;

                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@proveedorMasivo", SqlDbType.VarChar).Value = proveedorMasivo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        cmd.Parameters.Add("@new_id", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        idEvaluacion = Convert.ToInt32(cmd.Parameters["@new_id"].Value);

                        res.ok = true;
                        res.data = idEvaluacion;
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
        
        public object get_evaluacionProveedorCabDet(int idEvaluacion_Cab, string idUsuario )
        {
            DataTable dt_cabecera = new DataTable();
            DataTable dt_detalle = new DataTable();
            object evaluacion; 
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_APROBACION_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEvaluacion_Cab", SqlDbType.Int).Value = idEvaluacion_Cab;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_cabecera);
                        }
                    }
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_APROBACION_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEvaluacion_Cab", SqlDbType.Int).Value = idEvaluacion_Cab;
                        cmd.Parameters.Add("@idEvaluacion_Det", SqlDbType.Int).Value = 0;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    evaluacion = new
                    {
                        evaluacionCab = dt_cabecera,
                        evaluacionDet = dt_detalle
                    };
                }
            }
            catch (Exception)
            {
                throw;
            }
            return evaluacion;
        }
        
        public object get_evaluacionProveedorDet(int idEvaluacion_Cab, int idEvaluacionDet, string idUsuario)
        {
            DataTable dt_cabecera = new DataTable();
            DataTable dt_detalle = new DataTable();
            object evaluacion;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_APROBACION_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEvaluacion_Cab", SqlDbType.Int).Value = idEvaluacion_Cab;
                        cmd.Parameters.Add("@idEvaluacion_Det", SqlDbType.Int).Value = idEvaluacionDet;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    evaluacion = new
                    {
                        evaluacionDet = dt_detalle
                    };
                }
            }
            catch (Exception)
            {
                throw;
            }
            return evaluacion;
        }

        public string set_eliminarEvaluacionDet(int id_Evaluacion_Det, string idUsuario)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_ELIMINAR_EVALUACION_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Evaluacion_Det", SqlDbType.Int ).Value = id_Evaluacion_Det;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.VarChar).Value = idUsuario;

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

        public string set_editarEvaluacionDet(string opcionCampo , string valor,  int id_Evaluacion_Det, string idUsuario)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_EDITAR_VALOR_EVALUACION_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@opcionCampo", SqlDbType.VarChar).Value = opcionCampo;
                        cmd.Parameters.Add("@valorCantidad", SqlDbType.VarChar).Value = valor;
                        cmd.Parameters.Add("@id_Evaluacion_Det", SqlDbType.Int).Value = id_Evaluacion_Det;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.VarChar).Value = idUsuario;

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
               
        public object set_enviarAprobarEvaluacionCab(int idEvaluacion_Cab, string idUser)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_ENVIAR_APROBAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEvaluacion_Cab", SqlDbType.Int).Value = idEvaluacion_Cab;
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

        public object get_relacionEvaluacionesCab(string idCentroCostro,  string fechaIni, string fechaFin, string estado, string idUsuario)
        {
            List<Proveedor_Evaluacion> list_cabecera = new List<Proveedor_Evaluacion>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_LISTADO_EVALUACIONES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCentroCostro", SqlDbType.VarChar).Value = idCentroCostro;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.VarChar).Value = estado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Proveedor_Evaluacion obj_entidad = new Proveedor_Evaluacion();

                                obj_entidad.id_Evaluacion_Cab = Convert.ToInt32(dr["id_Evaluacion_Cab"].ToString());
                                obj_entidad.nroEvaluacion = dr["nroEvaluacion"].ToString();
                                obj_entidad.periodoEvaluacion = dr["periodoEvaluacion"].ToString();
                                obj_entidad.fechaEvaluacion = dr["fechaEvaluacion"].ToString();
                                obj_entidad.ProveedorA = dr["ProveedorA"].ToString();
                                obj_entidad.ProveedorB = dr["ProveedorB"].ToString();
                                obj_entidad.ProveedorC = dr["ProveedorC"].ToString();

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

        public object set_anularEvaluacionCab(int idEvaluacion_Cab , string idUser)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_ANULAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEvaluacion_Cab", SqlDbType.Int).Value = idEvaluacion_Cab;
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


        public object set_AprobarRechazarEvaluacionCab(int idEvaluacion_Cab, string opcion, string idUser)
        {
            Resultado res = new Resultado();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_PROVEEDORES_APROBAR_RECHAZAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEvaluacion_Cab", SqlDbType.Int).Value = idEvaluacion_Cab;
                        cmd.Parameters.Add("@opcion", SqlDbType.VarChar).Value = opcion;
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

        public object get_incidenciasCab(string idCentroCosto, string fechaIni, string fechaFin, string IdUsuarios )
        {
            List<Incidencias_E> list_cabecera = new List<Incidencias_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_INCIDENCIAS_PROVEEDORES_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@IdUsuarios", SqlDbType.VarChar).Value = IdUsuarios;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCosto;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Incidencias_E obj_entidad = new Incidencias_E();

                                obj_entidad.id_Incidencia = Convert.ToInt32(dr["id_Incidencia"].ToString());
                                obj_entidad.ruc = dr["ruc"].ToString();
                                obj_entidad.razonSocial = dr["razonSocial"].ToString();
                                obj_entidad.id_Proveedor = Convert.ToInt32(dr["id_Proveedor"].ToString());

                                obj_entidad.fechaIngreso_Incidencia = Convert.ToDateTime(dr["fechaIngreso_Incidencia"].ToString());
                                obj_entidad.observaciones_Incidencia = dr["observaciones_Incidencia"].ToString();
                                obj_entidad.Estado = dr["Estado"].ToString();
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
        
        public DataTable get_nuevosProveedoresPDF( int idProveedor)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_NUEVOS_PDF", cn))
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
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }
                          
        public object GenerarReporte_evaluacionProveedor(int id_Evaluacion_Cab, string idusuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_EVALUACION_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Evaluacion_Cab", SqlDbType.Int).Value = id_Evaluacion_Cab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = idusuario;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_evaluacionProveedor(dt_detalle, idusuario);
                            }
                        }
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
               
        public string GenerarExcel_evaluacionProveedor(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 1;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_evaluacionProveedor_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Proveedor/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("evaluacionProveedor");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[_fila, 1, _fila, 8].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "PROCESO SIG";
                    oWs.Cells[_fila, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[_fila, 9].Value = "FECHA EMISION";
                    oWs.Cells[_fila, 9].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 10].Value = listEvaluacion.Rows[0]["fechaEmision"].ToString();

                    _fila += 1;

                    oWs.Cells[_fila, 1, _fila + 2, 8].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "EVALUACION DE PROVEEDORES";
                    oWs.Cells[_fila, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila , 9].Value = "FECHA REVISION";
                    oWs.Cells[_fila , 9].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila , 10].Value = listEvaluacion.Rows[0]["fechaRevision"].ToString();

                    oWs.Cells[_fila + 1, 9].Value = "NRO REVISION";
                    oWs.Cells[_fila + 1 , 9].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila + 1, 10].Value = listEvaluacion.Rows[0]["nroRevision"].ToString();

                    oWs.Cells[_fila + 2, 9].Value = "CODIGO";
                    oWs.Cells[_fila + 2, 9].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila + 2, 10].Value = listEvaluacion.Rows[0]["codigo"].ToString();


                    _fila += 4;
                    for (int i = 1; i <= 10; i++)
                    {
                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);

                    oWs.Cells[_fila, 1].Value = "RUC";
                    oWs.Cells[_fila, 2].Value = "NOMBRE PROVEEDOR.";
                    oWs.Cells[_fila, 3].Value = "FECHA";
                    oWs.Cells[_fila, 4].Value = "PRECIO  ";
                    oWs.Cells[_fila, 5].Value = "CALIDAD";

                    oWs.Cells[_fila, 6].Value = "T. ENTREGA";
                    oWs.Cells[_fila, 7].Value = "CREDITO";
                    oWs.Cells[_fila, 8].Value = "GARANTIA.";
                    oWs.Cells[_fila, 9].Value = "PUNTUACION";
                    oWs.Cells[_fila, 10].Value = "ESTATUS"; 

                    _fila += 1;

                    foreach (DataRow oBp in listEvaluacion.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBp["ruc"].ToString();
                        oWs.Cells[_fila, 2].Value = oBp["proveedor"].ToString();
                        oWs.Cells[_fila, 3].Value = oBp["fecha"].ToString();
 

                        oWs.Cells[_fila, 4].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 4].Value = Convert.ToDouble(oBp["precio"].ToString());
                        oWs.Cells[_fila, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 5].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 5].Value = Convert.ToDouble(oBp["calidad"].ToString());
                        oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 5].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 6].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 6].Value = Convert.ToDouble(oBp["tentrega"].ToString());
                        oWs.Cells[_fila, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 6].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                        
                        oWs.Cells[_fila, 7].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 7].Value = Convert.ToDouble(oBp["credito"].ToString());
                        oWs.Cells[_fila, 7].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 7].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 8].Value = Convert.ToDouble(oBp["garantia"].ToString());
                        oWs.Cells[_fila, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 8].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 9].Value = Convert.ToDouble(oBp["puntuacion"].ToString());   
                        oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 9].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 10].Value = oBp["status"].ToString();           

                        _fila++;
                    } 

                    col = new int[10] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10  };
                    funcionGlobal_ajustarAnchoAutomatica_columna(oWs, col);

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }



        public void funcionGlobal_centrarNegrita_Fila(Excel.ExcelWorksheet oWs, int[] fil)
        {
            for (int i = 0; i < fil.Length; i++)
            {
                oWs.Row(fil[i]).Style.Font.Bold = true;
                oWs.Row(fil[i]).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                oWs.Row(fil[i]).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
            }
        }


        public void funcionGlobal_ajustarAnchoAutomatica_columna(Excel.ExcelWorksheet oWs, int[] col)
        {
            for (int y = 0; y < col.Length; y++)
            {
                oWs.Column(col[y]).AutoFit();
            }
        }


        public object GenerarReporte_incidencias( string fechaIni, string fechaFin, string idusuario, string idCentroCosto)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_INCIDENCIAS_PROVEEDORES_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idusuario;
                        cmd.Parameters.Add("@idCentroCosto", SqlDbType.VarChar).Value = idCentroCosto;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_incidenciasProveedor(dt_detalle, idusuario);
                            }
                        }
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
        
        public string GenerarExcel_incidenciasProveedor(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 1;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_incidenciasProveedor_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Proveedor/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("incidenciasProveedor");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[_fila, 1, _fila, 4].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "PROCESO SIG";
                    oWs.Cells[_fila, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[_fila, 5].Value = "FECHA EMISION";
                    oWs.Cells[_fila, 5].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 6].Value = listEvaluacion.Rows[0]["fechaEmision"].ToString();

                    _fila += 1;

                    oWs.Cells[_fila, 1, _fila + 2, 4].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "REGISTRO DE INCIDENCIA DE PROVEEDORES";
                    oWs.Cells[_fila, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 5].Value = "FECHA REVISION";
                    oWs.Cells[_fila, 5].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 6].Value = listEvaluacion.Rows[0]["fechaRevision"].ToString();

                    oWs.Cells[_fila + 1, 5].Value = "NRO REVISION";
                    oWs.Cells[_fila + 1, 5].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila + 1, 6].Value = listEvaluacion.Rows[0]["nroRevision"].ToString();

                    oWs.Cells[_fila + 2, 5].Value = "CODIGO";
                    oWs.Cells[_fila + 2, 5].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila + 2, 6].Value = listEvaluacion.Rows[0]["codigo"].ToString();


                    _fila += 4;
                    for (int i = 1; i <= 4; i++)
                    {
                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);

                    oWs.Cells[_fila, 1].Value = "RUC";
                    oWs.Cells[_fila, 2].Value = "NOMBRE PROVEEDOR.";
                    oWs.Cells[_fila, 3].Value = "FECHA";
                    oWs.Cells[_fila, 4].Value = "OBSERVACION ";
 

                    _fila += 1;

                    foreach (DataRow oBp in listEvaluacion.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBp["ruc"].ToString();
                        oWs.Cells[_fila, 2].Value = oBp["proveedor"].ToString();
                        oWs.Cells[_fila, 3].Value = oBp["fecha"].ToString();
                        oWs.Cells[_fila, 4].Value = oBp["observacion"].ToString();

                        _fila++;
                    }

                    col = new int[4] { 1, 2, 3, 4 };
                    funcionGlobal_ajustarAnchoAutomatica_columna(oWs, col);

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }


        public object GenerarReporte_cajaChica(int idLiquidacionCaja_Cab, string idusuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLiquidacionCaja_Cab", SqlDbType.Int).Value = idLiquidacionCaja_Cab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = idusuario;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_cajaChica(dt_detalle, idusuario);
                            }
                        }
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

        public string GenerarExcel_cajaChica(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 4;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_cajaChica_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/CajaChica/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "CajaChica/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("cajaChica");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[_fila, 1, _fila , 13].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = listEvaluacion.Rows[0]["empresa"].ToString();
                    oWs.Cells[_fila, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    _fila += 1;
                    oWs.Cells[_fila, 1].Value = "RUC";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 2].Value = listEvaluacion.Rows[0]["rucEmpresa"].ToString();
                    _fila += 1;
                    oWs.Cells[_fila, 1].Value = "DIRECCION";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 2, _fila, 13].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 2].Value = listEvaluacion.Rows[0]["direccionEmpresa"].ToString(); 
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Left;
                    oWs.Cells[_fila, 2].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
 

                    _fila += 1;
                    oWs.Cells[_fila, 1].Value = "MES";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 2].Value = listEvaluacion.Rows[0]["mes"].ToString();
                    _fila += 1;
                    oWs.Cells[_fila, 1].Value = "FECHAS";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 2].Value = listEvaluacion.Rows[0]["fechaIni"].ToString();
                    oWs.Cells[_fila, 3].Value = listEvaluacion.Rows[0]["fechaFin"].ToString();

                    _fila += 2;

                    oWs.Cells[_fila, 1, _fila , 13].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = listEvaluacion.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[_fila, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita

                    _fila += 3;

                    for (int i = 1; i <= 13; i++)
                    {
                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[_fila + 1, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);

                    oWs.Cells[_fila, 1].Value = "Item";

                    oWs.Cells[_fila, 2, _fila, 4].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 2].Value = "Comprobante";
                    oWs.Cells[_fila, 2].Style.Font.Size = 9; //letra tamaño  
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 2].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 2].Style.Font.Bold = true; //Letra negrita
                                       
                    oWs.Cells[_fila, 5].Value = "Fecha";
                    oWs.Cells[_fila, 6].Value = "Razón social";
                    oWs.Cells[_fila, 7].Value = "RUC";
                    oWs.Cells[_fila, 8].Value = "Concepto.";

                    oWs.Cells[_fila, 9, _fila, 13].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 9].Value = "Importe";
                    oWs.Cells[_fila, 9].Style.Font.Size = 9; //letra tamaño  
                    oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 9].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 9].Style.Font.Bold = true; //Letra negrita


                    _fila += 1;

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);

                    oWs.Cells[_fila, 2].Value = "Tipo";
                    oWs.Cells[_fila, 3].Value = "Serie";
                    oWs.Cells[_fila, 4].Value = "Número";
                                       
                    oWs.Cells[_fila, 9].Value = "No afecto";
                    oWs.Cells[_fila, 10].Value = "IGV";
                    oWs.Cells[_fila, 11].Value = "Percepciones";
                    oWs.Cells[_fila, 12].Value = "Otros cargos";
                    oWs.Cells[_fila, 13].Value = "Total";

                    _fila += 1;

                    int ac = 0;
                    foreach (DataRow oBp in listEvaluacion.Rows)
                    {
                        ac += 1;

                        oWs.Cells[_fila, 1].Value = ac;
                        oWs.Cells[_fila, 2].Value = oBp["tipo"].ToString();
                        oWs.Cells[_fila, 3].Value = oBp["serie"].ToString();
                        oWs.Cells[_fila, 4].Value = oBp["numero"].ToString();

                        oWs.Cells[_fila, 5].Value = oBp["fecha"].ToString();
                        oWs.Cells[_fila, 6].Value = oBp["razonSocial"].ToString();
                        oWs.Cells[_fila, 7].Value = oBp["ruc"].ToString();
                        oWs.Cells[_fila, 8].Value = oBp["concepto"].ToString();
                        
                        oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 9].Value = Convert.ToDouble(oBp["noAfecto"].ToString());
                        oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 9].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 10].Value = Convert.ToDouble(oBp["igv"].ToString());
                        oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 10].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 11].Value = Convert.ToDouble(oBp["percepciones"].ToString());
                        oWs.Cells[_fila, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 11].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 12].Value = Convert.ToDouble(oBp["otrosCargos"].ToString());
                        oWs.Cells[_fila, 12].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 12].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 13].Style.Numberformat.Format = "#,##0";
                        oWs.Cells[_fila, 13].Value = Convert.ToDouble(oBp["total"].ToString());
                        oWs.Cells[_fila, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 13].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center; 

                        _fila++;
                    }

                    for (int i = 1; i <= 13; i++)
                    {
                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }


                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);

                    oWs.Cells[_fila, 1, _fila, 8].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "Total general a reembolsar";
                    oWs.Cells[_fila, 1].Style.Font.Size = 9; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Left;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    object totalNoAfecto = listEvaluacion.Compute("sum(noAfecto)", "");
                    object totalIgv = listEvaluacion.Compute("sum(igv)", "");
                    object totalPercepciones = listEvaluacion.Compute("sum(percepciones)", "");
                    object totalOtrosCargos = listEvaluacion.Compute("sum(otrosCargos)", "");
                    object totalGeneral = listEvaluacion.Compute("sum(total)", "");


                    oWs.Cells[_fila, 9].Value =  Convert.ToDouble(totalNoAfecto);
                    oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0";
                    oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    oWs.Cells[_fila, 10].Value = Convert.ToDouble(totalIgv);
                    oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0";
                    oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    oWs.Cells[_fila, 11].Value = Convert.ToDouble(totalPercepciones);
                    oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0";
                    oWs.Cells[_fila, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    oWs.Cells[_fila, 12].Value = Convert.ToDouble(totalOtrosCargos);
                    oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0";
                    oWs.Cells[_fila, 12].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    oWs.Cells[_fila, 13].Value = Convert.ToDouble(totalGeneral);
                    oWs.Cells[_fila, 13].Style.Numberformat.Format = "#,##0";
                    oWs.Cells[_fila, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    col = new int[13] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13 };
                    funcionGlobal_ajustarAnchoAutomatica_columna(oWs, col);

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }

        public DataTable get_nuevosProveedores()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_PROVEEDORES_NUEVOS_COMBO_ESTADO", cn))
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
               
        public object get_listadoAprobacionPagosCab(string docIdentidad, string tipoDocumento,string centroCosto, string moneda,string facturaCancelada, string estado, string usuario, string docVencido, string fechaCorte)
        {
            List<AprobarPagos_E> list_cabecera = new List<AprobarPagos_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@docIdentidad", SqlDbType.VarChar).Value = docIdentidad;
                        cmd.Parameters.Add("@tipoDocumento", SqlDbType.VarChar).Value = tipoDocumento;
                        cmd.Parameters.Add("@centroCosto", SqlDbType.VarChar).Value = centroCosto;

                        cmd.Parameters.Add("@moneda", SqlDbType.VarChar).Value = moneda;
                        cmd.Parameters.Add("@facturaCancelada", SqlDbType.Int).Value = facturaCancelada;
                        cmd.Parameters.Add("@estado", SqlDbType.VarChar).Value = estado;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;
                        cmd.Parameters.Add("@docVencido", SqlDbType.VarChar).Value = docVencido;
                        cmd.Parameters.Add("@fechaCorte", SqlDbType.VarChar).Value = fechaCorte;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AprobarPagos_E obj_entidad = new AprobarPagos_E();

                                obj_entidad.checkeado = false;
                                obj_entidad.idDocumentoCab = Convert.ToInt32(dr["idDocumentoCab"].ToString());
                                obj_entidad.docIdentidad = dr["docIdentidad"].ToString();
                                obj_entidad.nroDocumentoIdentidad = dr["nroDocumentoIdentidad"].ToString();
                                obj_entidad.proveedor = dr["proveedor"].ToString();
                                obj_entidad.tipoDocumento = dr["tipoDocumento"].ToString();
                                obj_entidad.nroDocumento = dr["nroDocumento"].ToString();

                                obj_entidad.importe = dr["importe"].ToString();
                                obj_entidad.impDescuento = dr["impDescuento"].ToString();
                                obj_entidad.totalPagar = dr["totalPagar"].ToString();

                                obj_entidad.fechaVencimiento = dr["fechaVencimiento"].ToString();
                                obj_entidad.tipoAbono = dr["tipoAbono"].ToString();
                                obj_entidad.tipoCuenta = dr["tipoCuenta"].ToString();
                                obj_entidad.moneda = dr["moneda"].ToString();
                                obj_entidad.montoAbono = dr["montoAbono"].ToString();

                                obj_entidad.usuarioAprobador1 = dr["usuarioAprobador1"].ToString();
                                obj_entidad.fechaAprobacion1 = dr["fechaAprobacion1"].ToString();
                                obj_entidad.usuarioAprobador2 = dr["usuarioAprobador2"].ToString();
                                obj_entidad.fechaAprobacion2 = dr["fechaAprobacion2"].ToString();
                                obj_entidad.usuarioDevuelve = dr["usuarioDevuelve"].ToString();
                                obj_entidad.fechaDevuelve = dr["fechaDevuelve"].ToString();
                                obj_entidad.fechaDevuelve = dr["fechaDevuelve"].ToString();

                                obj_entidad.porDetraccion = dr["porDetraccion"].ToString();
                                obj_entidad.totDetraccion = dr["totDetraccion"].ToString();

                                obj_entidad.vencidos = dr["vencidos"].ToString();
                                obj_entidad.porVencer = dr["porVencer"].ToString();
                                obj_entidad.facturaCancelada = dr["facturaCancelada"].ToString();

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


        public DataTable get_documentosIdentidades()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_COMBO_DOC_IDENTIDAD", cn))
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

        public DataTable get_tipoDocumentos()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_COMBO_TIPO_DOC", cn))
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

        public DataTable get_monedas()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_COMBO_MONEDA", cn))
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

        public DataTable get_estados()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_COMBO_ESTADOS", cn))
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
        
        public object set_grabar_aprobacionPagosMasivos(string idDocumentos, string idusuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_MASIVOS_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentos", SqlDbType.VarChar).Value = idDocumentos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idusuario;
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
                res.totalpage = 0;
            }
            return res;
        }
               
        public object GenerarReporte_detalleMacros(string docIdentidad, string tipoDocumento, string centroCosto, string moneda, string facturaCancelada, string estado, string usuario, string docVencido)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_DETALLE_MACROS_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;


                        cmd.Parameters.Add("@docIdentidad", SqlDbType.VarChar).Value = docIdentidad;
                        cmd.Parameters.Add("@tipoDocumento", SqlDbType.VarChar).Value = tipoDocumento;
                        cmd.Parameters.Add("@centroCosto", SqlDbType.VarChar).Value = centroCosto;

                        cmd.Parameters.Add("@moneda", SqlDbType.VarChar).Value = moneda;
                        cmd.Parameters.Add("@facturaCancelada", SqlDbType.Int).Value = facturaCancelada;
                        cmd.Parameters.Add("@estado", SqlDbType.VarChar).Value = estado;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;
                        cmd.Parameters.Add("@docVencido", SqlDbType.VarChar).Value = docVencido;


                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_detalleMacros(dt_detalle, usuario);
                            }
                        }
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

        public string GenerarExcel_detalleMacros(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 1;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_detalleMacros_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Proveedor/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("detalleMacros");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);


                    oWs.Cells[_fila, 1].Value = "Tipo de Documento*";
                    oWs.Cells[_fila, 2].Value = "Número de Documento*";
                    oWs.Cells[_fila, 3].Value = "Nombre del Beneficiario*";
                    oWs.Cells[_fila, 4].Value = "Correo Electrónico ";
                    oWs.Cells[_fila, 5].Value = "N° Celular ";

                    oWs.Cells[_fila, 6].Value = "Tipo de doc. de pago";
                    oWs.Cells[_fila, 7].Value = "N° de doc. de pago";
                    oWs.Cells[_fila, 8].Value = "Fecha de Vencimiento del documento";
                    oWs.Cells[_fila, 9].Value = "Tipo de Abono* ";
                    oWs.Cells[_fila, 10].Value = "Tipo de Cuenta* ";

                    oWs.Cells[_fila, 11].Value = "Moneda de Cuenta ";
                    oWs.Cells[_fila, 12].Value = "N° Cuenta* ";
                    oWs.Cells[_fila, 13].Value = "Moneda de Abono* ";
                    oWs.Cells[_fila, 14].Value = "Monto de Abono* ";

                    _fila += 1;

                    foreach (DataRow oBp in listEvaluacion.Rows)
                    {

                        oWs.Cells[_fila, 1].Value = oBp["TipoDocumento"].ToString();
                        oWs.Cells[_fila, 2].Value = oBp["NumeroDocumento"].ToString();
                        oWs.Cells[_fila, 3].Value = oBp["NombreBeneficiario"].ToString();
                        oWs.Cells[_fila, 4].Value = oBp["CorreoElectronico"].ToString();
                        oWs.Cells[_fila, 5].Value = oBp["NroCelular"].ToString();

                        oWs.Cells[_fila, 6].Value = oBp["TipoDocPago"].ToString();
                        oWs.Cells[_fila, 7].Value = oBp["NroDocPago"].ToString();
                        oWs.Cells[_fila, 8].Value = oBp["FechaVencimientoDocumento"].ToString();
                        oWs.Cells[_fila, 9].Value = oBp["TipoAbono"].ToString();
                        oWs.Cells[_fila, 10].Value = oBp["TipoCuenta"].ToString();

                        oWs.Cells[_fila, 11].Value = oBp["MonedaCuenta"].ToString();
                        oWs.Cells[_fila, 12].Value = oBp["NroCuenta"].ToString();
                        oWs.Cells[_fila, 13].Value = oBp["MonedaAbono"].ToString();
                        oWs.Cells[_fila, 14].Value = oBp["MontoAbono"].ToString();

                        _fila++;
                    }

                    col = new int[14] { 1, 2, 3, 4 ,5,6,7,8,9,10,11,12,13,14};
                    funcionGlobal_ajustarAnchoAutomatica_columna(oWs, col);

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }
        
        public object Generar_formatoLiquidaciones(int idLiquidacionCab, string usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_CAJA_CHICA_UPDATE_EXPORTAR_LIQUIDACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idLiquidacionCab", SqlDbType.Int).Value = idLiquidacionCab;
                         cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_formatoLiquidaciones(dt_detalle, usuario);
                            }
                        }
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

        public string GenerarExcel_formatoLiquidaciones(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 1;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_formatoLiquidaciones_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Proveedor/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Importar");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);



                    oWs.Cells[_fila, 1].Value = "Item";
                    oWs.Cells[_fila, 2].Value = "ID_NoBorrar";
                    oWs.Cells[_fila, 3].Value = "Tipo";
                    oWs.Cells[_fila, 4].Value = " Serie ";
                    oWs.Cells[_fila, 5].Value = "Número ";

                    oWs.Cells[_fila, 6].Value = "Fecha";
                    oWs.Cells[_fila, 7].Value = "  Razón social ";
                    oWs.Cells[_fila, 8].Value = "RUC";
                    oWs.Cells[_fila, 9].Value = "Concepto ";
                    oWs.Cells[_fila, 10].Value = "Importe No afecto  ";

                    oWs.Cells[_fila, 11].Value = "IGV ";
                    oWs.Cells[_fila, 12].Value = "Percepciones ";
                    oWs.Cells[_fila, 13].Value = "  Otros cargos ";
                    oWs.Cells[_fila, 14].Value = "Total ";

                    oWs.Cells[_fila, 15].Value = "Glosa ";
                    oWs.Cells[_fila, 15].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[_fila, 15].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow); // fondo de celda
                    oWs.Cells[_fila, 15].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 16].Value = " Cta Gastos ";
                    oWs.Cells[_fila, 16].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[_fila, 16].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow); // fondo de celda
                    oWs.Cells[_fila, 16].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 17].Value = " Cta IGV ";
                    oWs.Cells[_fila, 17].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[_fila, 17].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow); // fondo de celda
                    oWs.Cells[_fila, 17].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 18].Value = " Cta X Pagar ";
                    oWs.Cells[_fila, 18].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[_fila, 18].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow); // fondo de celda
                    oWs.Cells[_fila, 18].Style.Font.Bold = true; //Letra negrita

                    _fila += 1;
                    int ac = 0;
                    foreach (DataRow oBp in listEvaluacion.Rows)
                    {
                        ac += 1;

                        oWs.Cells[_fila, 1].Value = ac;
                        oWs.Cells[_fila, 2].Value = oBp["ID_NoBorrar"].ToString();
                        oWs.Cells[_fila, 3].Value = oBp["Tipo"].ToString();
                        oWs.Cells[_fila, 4].Value = oBp["Serie"].ToString();
                        oWs.Cells[_fila, 5].Value = oBp["Numero"].ToString();

                        oWs.Cells[_fila, 6].Value = oBp["Fecha"].ToString();
                        oWs.Cells[_fila, 7].Value = oBp["RazonSocial"].ToString();
                        oWs.Cells[_fila, 8].Value = oBp["RUC"].ToString();
                        oWs.Cells[_fila, 9].Value = oBp["Concepto"].ToString();
                        oWs.Cells[_fila, 10].Value = oBp["ImporteNoAfecto"].ToString();

                        oWs.Cells[_fila, 11].Value = oBp["IGV"].ToString();
                        oWs.Cells[_fila, 12].Value = oBp["Percepciones"].ToString();
                        oWs.Cells[_fila, 13].Value = oBp["OtrosCargos"].ToString();
                        oWs.Cells[_fila, 14].Value = oBp["Total"].ToString();
                        oWs.Cells[_fila, 15].Value = oBp["Glosa"].ToString();

                        oWs.Cells[_fila, 16].Value = oBp["CtaGastos"].ToString();
                        oWs.Cells[_fila, 17].Value = oBp["CtaIGV"].ToString();
                        oWs.Cells[_fila, 18].Value = oBp["CtaXPagar"].ToString(); 

                        _fila++;
                    }

                    col = new int[18] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ,15,16,17,18};
                    funcionGlobal_ajustarAnchoAutomatica_columna(oWs, col);

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }

        public DataTable get_estados_aprobacionContabilidad()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_CONTABILIDAD_COMBO_ESTADOS", cn))
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
        
        public object get_listadoDocumentos_aprobacionContabilidad(string centroCosto, string fechaInicial,string fechaFinal, string estado,  string usuario)
        {
            List<AprobarContabilidad_E> list_cabecera = new List<AprobarContabilidad_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_CONTABILIDAD_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@centroCosto", SqlDbType.VarChar).Value = centroCosto;
                        cmd.Parameters.Add("@fechaInicial", SqlDbType.VarChar).Value = fechaInicial;
                        cmd.Parameters.Add("@fechaFinal", SqlDbType.VarChar).Value = fechaFinal;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = estado;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AprobarContabilidad_E obj_entidad = new AprobarContabilidad_E();

                                obj_entidad.checkeado = false;
                                obj_entidad.idDocumentoCab = Convert.ToInt32(dr["idDocumentoCab"].ToString());

                                obj_entidad.tipoDoc = dr["tipoDoc"].ToString();
                                obj_entidad.serie = dr["serie"].ToString();
                                obj_entidad.nroDoc = dr["nroDoc"].ToString();
                                obj_entidad.fecha = dr["fecha"].ToString();

                                obj_entidad.razonSocial = dr["razonSocial"].ToString();
                                obj_entidad.concepto = dr["concepto"].ToString();
                                obj_entidad.noAfecto = dr["noAfecto"].ToString();
                                obj_entidad.igv = dr["igv"].ToString();

                                obj_entidad.percepciones = dr["percepciones"].ToString();
                                obj_entidad.otrosCargos = dr["otrosCargos"].ToString();
                                obj_entidad.total = dr["total"].ToString();

                                obj_entidad.cuentas = dr["cuentas"].ToString();
                                obj_entidad.ctaGastos = dr["ctaGastos"].ToString();
                                obj_entidad.ctaIgv = dr["ctaIgv"].ToString();

                                obj_entidad.ctaXpagar = dr["ctaXpagar"].ToString();
                                obj_entidad.estado = dr["estado"].ToString();
                                obj_entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                obj_entidad.moneda = dr["moneda"].ToString();

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
               
        public object set_grabar_seleccionarDocumentos(string idDocumentos, string idusuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_MASIVOS_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentos", SqlDbType.VarChar).Value = idDocumentos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idusuario;
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
                res.totalpage = 0;
            }
            return res;
        }
               
        public object set_grabar_seleccionDocumentos(string idDocumentos , string idusuario, string idestado)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_CONTABILIDAD_SELECCIONAR_DOC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentos", SqlDbType.VarChar).Value = idDocumentos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idusuario;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idestado;
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
        

        public object GenerarReporte_sistCont(string idDocumentosMasivos,  string usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_CONTABILIDAD_EXCEL_SIS_CONT", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idDocumentos", SqlDbType.VarChar).Value = idDocumentosMasivos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = usuario;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_sistCont(dt_detalle, usuario);
                            }
                        }
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

        public string GenerarExcel_sistCont(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 1;
            int pos = 1;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_SIS_CONT_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Proveedor/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("sistCont");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);

                    oWs.Cells[_fila, pos].Value = "Vou.Origen "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Vou.Numero  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Vou.Fecha  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Doc  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Numero  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Fec.Doc  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Fec.Venc. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Codigo   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " B.I.O.G y E. (A)  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " B.I.O.G.y E. y NO GRA. (B)  "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " B.I.O.G.sin D.C.FIS(C)  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " AD. NO GRAV.  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " I.S.C.    "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " IGV (A)   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " IGV (B)   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " IGV (C)   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " OTROS TRIB. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Moneda  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " TC    "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Glosa "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " Cta Gastos     "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Cta IGV        "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Cta O. Trib.   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Cta x Pagar    "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " C.Costo      "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Presupuesto  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.Doc  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.numero   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.Fecha   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " D.Numero    "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " D.Fecha "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " RUC  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.Social "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Tipo "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Tip.Doc.Iden "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Medio de Pago "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Apellido 1"; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Apellido 2"; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Nombre"; pos += 1;
                    oWs.Cells[_fila, pos].Value = " T.Bien"; pos += 1;

                    oWs.Cells[_fila, pos].Value = " P.origen  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.vou "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fecha "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fecha D. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fecha V. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.cta cob "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.m.pago "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.doc "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.num doc "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.moneda "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " P.tc "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.monto "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.glosa "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fe "; pos += 1;


                    _fila += 1;
                    pos = 1;
                    foreach (DataRow item in listEvaluacion.Rows)
                    {
                        pos = 1;                        

                        oWs.Cells[_fila, pos].Value = item["VouOrigen"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["VouNumero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["VouFecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Doc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Numero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["FecDoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["FecVenc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Codigo"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["BIOG_E_A"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["BIOG_E_NO_GRA_B"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["BIOG_sin_DC_FIS_C"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["AD_NO_GRAV"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["ISC"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["IGV_A"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["IGV_B"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["IGV_C"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["OTROS_TRIB"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Moneda"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["TC"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Glosa"].ToString(); pos += 1;


                        oWs.Cells[_fila, pos].Value = item["CtaGastos"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CtaIGV"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CtaOTrib"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CtaxPagar"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CCosto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Presupuesto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RDoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Rnumero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RFecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["DNumero"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["DFecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RUC"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RSocial"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Tipo"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["TipDocIden"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["MedioPago"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Apellido1"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Apellido2"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Nombre"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["TBien"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["Porigen"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pvou"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfecha_D"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfecha_V"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pcta_cob"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["P_mpago"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pdoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pnumdoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pmoneda"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["Ptc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pmonto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pglosa"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfe"].ToString(); pos += 1;        

                        _fila++;
                    }


                    for (int k = 1; k <= 54; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }
               
        public object set_actualizarFlagPagos(string idDocumentos, string idusuario, string idestado)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_CAMBIAR_FLAG_PAGOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idDocumentos", SqlDbType.VarChar).Value = idDocumentos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idusuario;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idestado;
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

        public object Generar_reporte_aprobacionPagos(string docIdentidad, string tipoDocumento, string centroCosto, string moneda, string facturaCancelada, string estado, string usuario, string docVencido, string fechaCorte)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;


                        cmd.Parameters.Add("@docIdentidad", SqlDbType.VarChar).Value = docIdentidad;
                        cmd.Parameters.Add("@tipoDocumento", SqlDbType.VarChar).Value = tipoDocumento;
                        cmd.Parameters.Add("@centroCosto", SqlDbType.VarChar).Value = centroCosto;

                        cmd.Parameters.Add("@moneda", SqlDbType.VarChar).Value = moneda;
                        cmd.Parameters.Add("@facturaCancelada", SqlDbType.Int).Value = facturaCancelada;
                        cmd.Parameters.Add("@estado", SqlDbType.VarChar).Value = estado;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;
                        cmd.Parameters.Add("@docVencido", SqlDbType.VarChar).Value = docVencido;
                        cmd.Parameters.Add("@fechaCorte", SqlDbType.VarChar).Value = fechaCorte;


                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_aprobacionPagos(dt_detalle, usuario);
                            }
                        }
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
        
        public string GenerarExcel_aprobacionPagos(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 1;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_aprobacionPagos_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Proveedor/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "Proveedor/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("aprobacionPagos");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);


                    oWs.Cells[_fila, 1].Value = "VENCIDOS";
                    oWs.Cells[_fila, 2].Value = "POR VENCER";
                    oWs.Cells[_fila, 3].Value = "TIPO DOC IDENTIDAD";
                    oWs.Cells[_fila, 4].Value = "NRO DOC IDENTIDAD";
                    oWs.Cells[_fila, 5].Value = "PROVEEDOR";
                                       
                    oWs.Cells[_fila, 6].Value = "FACTURA CANCELADA";
                    oWs.Cells[_fila, 7].Value = "TIPO DE DOCUMENTO";
                    oWs.Cells[_fila, 8].Value = "NRO DOCUMENTO";
                    oWs.Cells[_fila, 9].Value = "IMPORTE ";
                    oWs.Cells[_fila, 10].Value =" % DETRACCION";
                                      
                    oWs.Cells[_fila, 11].Value ="TOTAL DETRACCION";
                    oWs.Cells[_fila, 12].Value ="TOTAL PAGAR";
                    oWs.Cells[_fila, 13].Value ="FECHA VENCIMIENTO";
                    oWs.Cells[_fila, 14].Value = "TIPO DE ABONO";
                    oWs.Cells[_fila, 15].Value = "TIPO DE CUENTA";

                    oWs.Cells[_fila, 16].Value = "MONEDA";
                    oWs.Cells[_fila, 17].Value = "MONTO DE ABONO";
                    oWs.Cells[_fila, 18].Value = "USUARIO APROBADOR 1";
                    oWs.Cells[_fila, 19].Value = "FECHA APROBACION 1";
                    oWs.Cells[_fila, 20].Value = "USUARIO APROBADOR 2";

                    oWs.Cells[_fila, 21].Value = "FECHA APROBACION 2";
                    oWs.Cells[_fila, 22].Value = "USUARIO DEVUELVE";
                    oWs.Cells[_fila, 23].Value = "FECHA DEVUELVE";

                    _fila += 1;

                    foreach (DataRow oBp in listEvaluacion.Rows)
                    {

                        oWs.Cells[_fila, 1].Value = oBp["vencidos"].ToString();
                        oWs.Cells[_fila, 2].Value = oBp["porVencer"].ToString();
                        oWs.Cells[_fila, 3].Value = oBp["docIdentidad"].ToString();
                        oWs.Cells[_fila, 4].Value = oBp["nroDocumentoIdentidad"].ToString();
                        oWs.Cells[_fila, 5].Value = oBp["proveedor"].ToString();

                        oWs.Cells[_fila, 6].Value = oBp["facturaCancelada"].ToString();
                        oWs.Cells[_fila, 7].Value = oBp["tipoDocumento"].ToString();
                        oWs.Cells[_fila, 8].Value = oBp["nroDocumento"].ToString();
                        oWs.Cells[_fila, 9].Value = oBp["importe"].ToString();
                        oWs.Cells[_fila, 10].Value = oBp["impDescuento"].ToString();

                        oWs.Cells[_fila, 11].Value = oBp["totDetraccion"].ToString();
                        oWs.Cells[_fila, 12].Value = oBp["totalPagar"].ToString();
                        oWs.Cells[_fila, 13].Value = oBp["fechaVencimiento"].ToString();
                        oWs.Cells[_fila, 14].Value = oBp["tipoAbono"].ToString();
                        oWs.Cells[_fila, 15].Value = oBp["tipoCuenta"].ToString();

                        oWs.Cells[_fila, 16].Value = oBp["moneda"].ToString();
                        oWs.Cells[_fila, 17].Value = oBp["montoAbono"].ToString();
                        oWs.Cells[_fila, 18].Value = oBp["usuarioAprobador1"].ToString();
                        oWs.Cells[_fila, 19].Value = oBp["fechaAprobacion1"].ToString();
                        oWs.Cells[_fila, 20].Value = oBp["usuarioAprobador2"].ToString();

                        oWs.Cells[_fila, 21].Value = oBp["fechaAprobacion2"].ToString();
                        oWs.Cells[_fila, 22].Value = oBp["usuarioDevuelve"].ToString();
                        oWs.Cells[_fila, 23].Value = oBp["fechaDevuelve"].ToString();

                        _fila++;
                    }

                    col = new int[23] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15,16,17,18,19,20,21,22,23 };
                    funcionGlobal_ajustarAnchoAutomatica_columna(oWs, col);

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }
        
        public object GenerarReporte_contabilidadCajaChica(int idLiquidacionCaja_Cab, string idusuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_CAJA_CHICA_CONTABILIDAD_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLiquidacionCaja_Cab", SqlDbType.Int).Value = idLiquidacionCaja_Cab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = idusuario;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_contabilidadCajaChica(dt_detalle, idusuario);
                            }
                        }
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


        public string GenerarExcel_contabilidadCajaChica(DataTable listEvaluacion, string idUsuario)
        {
            string Res = "";
            string FileRuta = "";
            string ruta_descarga = "";
            int _fila = 1;
            int pos = 0;
            int[] fil;
            int[] col;

            try
            {
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                string nombreFile = idUsuario + "_cajaChica_Siscont_" + Guid.Parse(guidB) + ".xlsx";

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/CajaChica/Descargas/" + nombreFile);
                FileInfo _file = new FileInfo(FileRuta);
                ruta_descarga = ConfigurationManager.AppSettings["ServerFiles"] + "CajaChica/Descargas/" + nombreFile;

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("sistCont");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));



                    fil = new int[1] { _fila };
                    funcionGlobal_centrarNegrita_Fila(oWs, fil);
                    pos += 1;
                    oWs.Cells[_fila, pos].Value = " Vou.Origen "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Vou.Numero  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Vou.Fecha  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Doc  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Numero  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Fec.Doc  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Fec.Venc. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Codigo   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " B.I.O.G y E. (A)  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " B.I.O.G.y E. y NO GRA. (B)  "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " B.I.O.G.sin D.C.FIS(C)  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " AD. NO GRAV.  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " I.S.C.    "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " IGV (A)   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " IGV (B)   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " IGV (C)   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " OTROS TRIB. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Moneda  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " TC    "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Glosa "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " Cta Gastos     "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Cta IGV        "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Cta O. Trib.   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Cta x Pagar    "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " C.Costo      "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Presupuesto  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.Doc  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.numero   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.Fecha   "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " D.Numero    "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " D.Fecha "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " RUC  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " R.Social "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Tipo "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Tip.Doc.Iden "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Medio de Pago "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Apellido 1"; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Apellido 2"; pos += 1;
                    oWs.Cells[_fila, pos].Value = " Nombre"; pos += 1;
                    oWs.Cells[_fila, pos].Value = " T.Bien"; pos += 1;

                    oWs.Cells[_fila, pos].Value = " P.origen  "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.vou "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fecha "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fecha D. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fecha V. "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.cta cob "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.m.pago "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.doc "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.num doc "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.moneda "; pos += 1;

                    oWs.Cells[_fila, pos].Value = " P.tc "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.monto "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.glosa "; pos += 1;
                    oWs.Cells[_fila, pos].Value = " P.fe "; pos += 1;

                    _fila += 1;
                    pos = 1;
                    foreach (DataRow item in listEvaluacion.Rows)
                    {
                        pos = 1;

                        oWs.Cells[_fila, pos].Value = item["VouOrigen"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["VouNumero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["VouFecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Doc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Numero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["FecDoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["FecVenc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Codigo"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["BIOG_E_A"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["BIOG_E_NO_GRA_B"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["BIOG_sin_DC_FIS_C"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["AD_NO_GRAV"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["ISC"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["IGV_A"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["IGV_B"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["IGV_C"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["OTROS_TRIB"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Moneda"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["TC"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Glosa"].ToString(); pos += 1;


                        oWs.Cells[_fila, pos].Value = item["CtaGastos"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CtaIGV"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CtaOTrib"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CtaxPagar"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["CCosto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Presupuesto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RDoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Rnumero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RFecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["DNumero"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["DFecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RUC"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["RSocial"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Tipo"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["TipDocIden"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["MedioPago"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Apellido1"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Apellido2"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Nombre"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["TBien"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["Porigen"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pvou"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfecha_D"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfecha_V"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pcta_cob"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["P_mpago"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pdoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pnumdoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pmoneda"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = item["Ptc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pmonto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pglosa"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = item["Pfe"].ToString(); pos += 1;

                        _fila++;
                    }

                    oEx.Save();
                    Res = ruta_descarga;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Res;
        }


        public object GenerarReporte_detalleMacros_II(string idDocumentos, string docIdentidad, string tipoDocumento, string centroCosto, string moneda, string facturaCancelada, string estado, string usuario, string docVencido, string fechaCorte)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBAR_PAGOS_DETALLE_MACROS_EXCEL_II", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idDocumentos", SqlDbType.VarChar).Value = idDocumentos;
                        cmd.Parameters.Add("@docIdentidad", SqlDbType.VarChar).Value = docIdentidad;
                        cmd.Parameters.Add("@tipoDocumento", SqlDbType.VarChar).Value = tipoDocumento;
                        cmd.Parameters.Add("@centroCosto", SqlDbType.VarChar).Value = centroCosto;

                        cmd.Parameters.Add("@moneda", SqlDbType.VarChar).Value = moneda;
                        cmd.Parameters.Add("@facturaCancelada", SqlDbType.Int).Value = facturaCancelada;
                        cmd.Parameters.Add("@estado", SqlDbType.VarChar).Value = estado;
                        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;
                        cmd.Parameters.Add("@docVencido", SqlDbType.VarChar).Value = docVencido;
                        cmd.Parameters.Add("@fechaCorte", SqlDbType.VarChar).Value = fechaCorte;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarExcel_detalleMacros(dt_detalle, usuario);
                            }
                        }
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
