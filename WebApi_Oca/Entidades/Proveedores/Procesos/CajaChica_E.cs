using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Proveedores.Procesos
{
    public class CajaChica_E
    {
        public int id_LiquidacionCaja_Cab { get; set; }
        public string nroLiquidacion { get; set; }
        public string periodoEvaluacion { get; set; }
        public DateTime fechaRegistro { get; set; }
        public string usuarioGeneracion { get; set; }
        public string cantidadDoc { get; set; }
        public string idEstado { get; set; }
        public string descripcionEstado { get; set; }

        public string usuarioAprobador1 { get; set; }
        public string fechaAprobacion1 { get; set; }

        public string usuarioAprobador2 { get; set; }
        public string fechaAprobacion2 { get; set; }

        public string usuarioDevuelve { get; set; }
        public string fechaDevolucion { get; set; }

        public string centroCosto { get; set; }
    }
}
