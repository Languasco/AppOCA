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

        public object get_nuevosProveedoresCab(string nroObra, string idEstado)
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
        
        public DataTable get_centroCostro()
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

        public DataTable get_tipoResultado()
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


        public object GenerarReporte_incidencias( string fechaIni, string fechaFin, string idusuario)
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



    }
}
