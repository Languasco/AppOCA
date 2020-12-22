using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Logistica.Procesos
{
   public class OrdenCompraAdjuntar_E
    {
        public string idOrdenCompra { get; set; }
        public string tipoOc { get; set; }
        public string nroOC { get; set; }
        public string fechaEmision { get; set; }
        public string centroCosto { get; set; }
        public string proveedor { get; set; }
        public string formaPago { get; set; }
        public string moneda { get; set; }
        public string subTotal { get; set; }
        public string igv { get; set; }
        public string total { get; set; }
        public string nroPedido { get; set; }

    }
}
