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
    
    public partial class tbl_Estructura_Material
    {
        public int id_Estructura_Material { get; set; }
        public Nullable<int> id_TipoArmado { get; set; }
        public Nullable<int> id_Estructura { get; set; }
        public Nullable<int> TipoRegistro { get; set; }
        public string Alm_Arti_Codigo { get; set; }
        public string Pub_Esta_Codigo { get; set; }
        public string Pub_Empr_UsuCrea { get; set; }
        public Nullable<System.DateTime> Pub_Empr_FecCrea { get; set; }
        public string Pub_Empr_UsuModi { get; set; }
        public Nullable<System.DateTime> Pub_Empr_FecModi { get; set; }
    }
}