using Entidades.Logistica.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Logistisca.Proceso
{
    public class OrdenCompraAprobar_BL
    {
        public object get_ordenCompraAdjuntarCab(string nroOC)
        {
            List<OrdenCompraCab_E> list_cabecera = new List<OrdenCompraCab_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_APROBAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroOC", SqlDbType.VarChar).Value = nroOC;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                OrdenCompraCab_E obj_entidad = new OrdenCompraCab_E();

                                obj_entidad.idOrdenCompra = dr["idOrdenCompra"].ToString();

                                obj_entidad.tipoOc = dr["tipoOc"].ToString();
                                obj_entidad.nroOC = dr["nroOC"].ToString();
                                obj_entidad.fechaEmision = dr["fechaEmision"].ToString();
                                obj_entidad.moneda = dr["moneda"].ToString();

                                obj_entidad.subTotal = dr["subTotal"].ToString();
                                obj_entidad.igv = dr["igv"].ToString();
                                obj_entidad.total = dr["total"].ToString();

                                obj_entidad.formaPago = dr["formaPago"].ToString();
                                obj_entidad.proveedor = dr["proveedor"].ToString();

                                obj_entidad.aprobadorJefe = dr["aprobadorJefe"].ToString();
                                obj_entidad.solicitante = dr["solicitante"].ToString();

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
        
        public object get_ordenCompraAdjuntarDet(string idOrdenCompra)
        {
            List<OrdenCompraDet_E> list_detalle = new List<OrdenCompraDet_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENCOMPRA_APROBAR_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOrdenCompraCab", SqlDbType.VarChar).Value = idOrdenCompra;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                OrdenCompraDet_E obj_entidad = new OrdenCompraDet_E();
                                                               
                                obj_entidad.idOrdenCompraDet = dr["idOrdenCompraDet"].ToString();
                                obj_entidad.idOrdenCompraCab = dr["idOrdenCompraCab"].ToString();

                                obj_entidad.tm = dr["tm"].ToString();
                                obj_entidad.matricula = dr["matricula"].ToString();
                                obj_entidad.descripcion = dr["descripcion"].ToString();
                                obj_entidad.um = dr["um"].ToString();

                                obj_entidad.precio = dr["precio"].ToString();
                                obj_entidad.cantidad = dr["cantidad"].ToString();
                                obj_entidad.importe = dr["importe"].ToString();

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
        
        public object set_aprobarRechazar_ordenCompra(string idOrdenCompraCab, string observacion, string estadoOrdenCompra, string idUsuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("Web_Log_OrdenCompra_Cab_Aprueba_Rechazar_OC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Log_OCom_Codigo", SqlDbType.VarChar).Value = idOrdenCompraCab;
                        cmd.Parameters.Add("@OBS_Rechazo", SqlDbType.VarChar).Value = observacion;
                        cmd.Parameters.Add("@Log_OCom_Tipo", SqlDbType.VarChar).Value = "";
                        cmd.Parameters.Add("@Estado", SqlDbType.VarChar).Value = estadoOrdenCompra;
                        cmd.Parameters.Add("@Usuario", SqlDbType.VarChar).Value = idUsuario;
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
