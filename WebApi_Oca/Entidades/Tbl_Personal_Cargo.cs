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
    
    public partial class Tbl_Personal_Cargo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Tbl_Personal_Cargo()
        {
            this.Tbl_Personal = new HashSet<Tbl_Personal>();
        }
    
        public int id_CargoPersonal { get; set; }
        public string codigoInterno_CargoPersonal { get; set; }
        public string descripcion_CargoPersonal { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Tbl_Personal> Tbl_Personal { get; set; }
    }
}