//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Entidades
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_Documento_Cab
    {
        public int id_Documento { get; set; }
        public string Pub_Emp_Codigo { get; set; }
        public string id_tipoIngreso { get; set; }
        public string Pub_TiDo_Codigo { get; set; }
        public string nroSerie_Doc { get; set; }
        public string numero_Doc { get; set; }
        public Nullable<System.DateTime> fechaEmision_Doc { get; set; }
        public string Ges_Ordt_Codigo { get; set; }
        public string CCosto { get; set; }
        public Nullable<int> id_Proveedor { get; set; }
        public string nro_RUC { get; set; }
        public string concepto_Doc { get; set; }
        public string Log_Ocom_Tipo { get; set; }
        public string Log_Ocom_Codigo { get; set; }
        public string Pub_Mone_Codigo { get; set; }
        public Nullable<decimal> TipoCambio { get; set; }
        public Nullable<decimal> subTotal_Doc { get; set; }
        public Nullable<decimal> porcentajeIGV { get; set; }
        public Nullable<decimal> IgvTotal_Doc { get; set; }
        public Nullable<decimal> total_Doc { get; set; }
        public string observaciones { get; set; }
        public string usario_Aprobo { get; set; }
        public Nullable<System.DateTime> fecha_Aprobacion { get; set; }
        public string usuario_Rechazo { get; set; }
        public string fecha_Rechazo { get; set; }
        public string id_MotivoRechazo { get; set; }
        public string descripcionRechazo { get; set; }
        public string nroVaocher_Pago { get; set; }
        public Nullable<System.DateTime> fechaPago { get; set; }
        public string comentario_Pago { get; set; }
        public string Estado { get; set; }
        public string usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public string usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
        public Nullable<int> Log_OCom_Identidad { get; set; }
        public Nullable<decimal> porcentajeDescto { get; set; }
        public Nullable<decimal> totalDescuento { get; set; }
        public Nullable<decimal> totalaPagar { get; set; }
        public Nullable<int> factura_CanceladaPrioridad { get; set; }
        public Nullable<int> factura_marcaContable { get; set; }
        public Nullable<int> factura_pago { get; set; }
        public Nullable<System.DateTime> fecha_Vencimiento { get; set; }
        public Nullable<decimal> porcentajeRetencion { get; set; }
        public Nullable<decimal> TotalRetencion { get; set; }
        public Nullable<decimal> porcentajeDetraccion { get; set; }
        public Nullable<decimal> TotalDetraccion { get; set; }
        public string pub_FoPa_Codigo { get; set; }
    }
}
