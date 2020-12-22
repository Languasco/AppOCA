using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Logistica.Procesos
{
    public class OrdenCompraCab_E
    {
        public string idOrdenCompra { get; set; }
        public string tipoOc { get; set; }
        public string nroOC { get; set; }
        public string fechaEmision { get; set; }
        public string moneda { get; set; }
        public string subTotal { get; set; }
        public string igv { get; set; }
        public string total { get; set; }

        public string formaPago { get; set; }
        public string proveedor { get; set; }

        public string aprobadorJefe { get; set; }
        public string solicitante { get; set; }

    }

    public class OrdenCompraDet_E
    {
      public string   idOrdenCompraDet { get; set; }
      public string   idOrdenCompraCab { get; set; }
 
      public string   tm { get; set; }
      public string   matricula { get; set; }
      public string   descripcion { get; set; }
      public string   um  { get; set; }
      public string   precio { get; set; }
      public string   cantidad { get; set; }
      public string   importe { get; set; }

    }
}
