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
    
    public partial class tbl_Liquidacion_Caja_Det
    {
        public int id_LiquidacionCaja_Det { get; set; }
        public Nullable<int> id_LiquidacionCaja_Cab { get; set; }
        public Nullable<int> id_tipoIngreso { get; set; }
        public string Pub_TiDo_Codigo { get; set; }
        public string nroSerie_Doc { get; set; }
        public string numero_Doc { get; set; }
        public Nullable<System.DateTime> fechaEmision_Doc { get; set; }
        public string Ges_Ordt_Codigo { get; set; }
        public string CCosto { get; set; }
        public Nullable<int> id_Proveedor { get; set; }
        public string nro_RUC { get; set; }
        public string concepto_Doc { get; set; }
        public string Pub_Mone_Codigo { get; set; }
        public Nullable<decimal> TipoCambio { get; set; }
        public Nullable<decimal> subTotal_Doc { get; set; }
        public Nullable<decimal> porcentajeIGV { get; set; }
        public Nullable<decimal> IgvTotal_Doc { get; set; }
        public Nullable<decimal> percepciones_Doc { get; set; }
        public Nullable<decimal> otrosG_Doc { get; set; }
        public Nullable<decimal> total_Doc { get; set; }
        public string observaciones { get; set; }
        public Nullable<int> modoIngreso_Doc { get; set; }
        public string Estado { get; set; }
        public string usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public string usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
        public Nullable<decimal> porcentajeDescto { get; set; }
        public Nullable<decimal> totalDescuento { get; set; }
        public Nullable<decimal> totalaPagar { get; set; }
        public string Glosa { get; set; }
        public string CtaGastos { get; set; }
        public string CtaIGV { get; set; }
        public string CtaxPagar { get; set; }
    }
}
