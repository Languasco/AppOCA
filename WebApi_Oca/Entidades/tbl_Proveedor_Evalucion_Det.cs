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
    
    public partial class tbl_Proveedor_Evalucion_Det
    {
        public int id_Evaluacion_Det { get; set; }
        public Nullable<int> id_Evaluacion_Cab { get; set; }
        public Nullable<int> id_Proveedor { get; set; }
        public Nullable<int> Pto_Precio { get; set; }
        public Nullable<int> Pto_Calidad { get; set; }
        public Nullable<int> Pto_TEntrega { get; set; }
        public Nullable<int> Pto_Credito { get; set; }
        public Nullable<int> Pto_Garantia { get; set; }
        public Nullable<int> puntuacion { get; set; }
        public string statuss { get; set; }
        public string Estado { get; set; }
        public string usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public string usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
    }
}
