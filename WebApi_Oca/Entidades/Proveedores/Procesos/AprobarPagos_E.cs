using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Proveedores.Procesos
{
   public class AprobarPagos_E
    {     

        public bool checkeado { get; set; }
        public int idDocumentoCab { get; set; }
        public string  docIdentidad { get; set; }
        public string  nroDocumento { get; set; }
        public string nroDocumentoIdentidad { get; set; }

        public string importe { get; set; }
        public string impDescuento { get; set; }
        public string totalPagar { get; set; }

        public string  proveedor { get; set; }
        public string  tipoDocumento { get; set; }
        public string  fechaVencimiento { get; set; }
        public string  tipoAbono { get; set; }
        public string  tipoCuenta { get; set; }
        public string  moneda { get; set; }
        public string  montoAbono { get; set; }
        public string  usuarioAprobador1 { get; set; }
        public string  fechaAprobacion1 { get; set; }
        public string  usuarioAprobador2 { get; set; }
        public string  fechaAprobacion2 { get; set; }
        public string  usuarioDevuelve { get; set; }
        public string fechaDevuelve { get; set; }


        public string porDetraccion { get; set; }
        public string totDetraccion { get; set; }

        public string vencidos { get; set; }
        public string porVencer { get; set; }
        public string facturaCancelada { get; set; }
    }


    public class AprobarContabilidad_E
    {
        public bool checkeado { get; set; }
        public int idDocumentoCab { get; set; } 
        public string tipoDoc { get; set; }
        public string serie { get; set; }
        public string nroDoc { get; set; }
        public string fecha { get; set; }
        public string razonSocial { get; set; }
        public string concepto { get; set; }
        public string noAfecto { get; set; }
        public string igv { get; set; }
        public string percepciones { get; set; }
        public string otrosCargos { get; set; }
        public string total { get; set; }
        public string cuentas { get; set; }
        public string ctaGastos { get; set; }
        public string ctaIgv { get; set; }
        public string ctaXpagar { get; set; }
        public string estado { get; set; }
        public string descripcionEstado { get; set; }
        public string moneda { get; set; }
    }

}
