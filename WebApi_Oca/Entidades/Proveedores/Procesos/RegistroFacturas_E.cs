using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Proveedores.Procesos
{
   public  class RegistroFacturas_E
    {
        public int idOrdenCompraCab { get; set; }
        public string descripcionEstado { get; set; }
        public string tipoOc { get; set; }
        public string nroOc { get; set; }
        public string fechaOC { get; set; }
        public string moneda { get; set; }
        public string subtotal { get; set; }
        public string igv { get; set; }
        public string total { get; set; }
        public string formaPago { get; set; }
        public string subTotalFactura { get; set; }
        public string igvFactura { get; set; }
        public string TotalFactura { get; set; }
        public string porDetraccion { get; set; }
        public string totDetraccion { get; set; }
        public string totalPagar { get; set; }

    }

    public class Documentos_E
    {
        public int id_Documento { get; set; }
        public string serieFactura { get; set; }
        public string nroFactura { get; set; }
        public string nroGuia { get; set; }
        public DateTime fechaFactura { get; set; }
        public string subTotal { get; set; }

        public string igv { get; set; }
        public string total { get; set; }


        public string porDetraccion { get; set; }
        public string totDetraccion { get; set; }
        public string totalPagar { get; set; }


        public int idEstado { get; set; }
        public string descripcionEstado { get; set; }

    }

    public class DocumentosDet_E
    {

        public bool checkeado { get; set; }
        public int id { get; set; }
        public int id_Documento_Det { get; set; }
        public string codigo { get; set; }
        public string descripcion { get; set; }
        public string cantidadOc { get; set; }

        public string cantidadIngresoAlmacen { get; set; }
        public string cantidadFacturada { get; set; }
        public string cantidadIngresoAprobada { get; set; }
        public string precio { get; set; }
        public string subTotal { get; set; }
    }

    public class Detalle_E
    {
        public int idDocumentoCab { get; set; }
        public string codigoProducto { get; set; }
        public string cantAprobada { get; set; }
        public string precio { get; set; }
        public string usuarioCreacion { get; set; }

    }

    public class EstadosDocumentos_E
    {
        public int id_Documento { get; set; }
        public string nroFactura { get; set; }
        public string fecha { get; set; }
        public string subTotal { get; set; }
        public string igv { get; set; }
        public string total { get; set; }
        public string nroOC { get; set; }
        public string tipoOC { get; set; }
        public string formaPago { get; set; }
        public string fechaAprox { get; set; }
        public string idEstado { get; set; }
        public string estado { get; set; }
        public string nroVoucher { get; set; }
        public string fechaPago { get; set; }
        public string comentariosPago { get; set; }

        public string porDetraccion { get; set; }
        public string totDetraccion { get; set; }
        public string totalPagar { get; set; }

    }



    public class AprobarFacturas_E
    {

        public bool checkeado { get; set; }
        public int  idFacturaCab { get; set; }
        public string  nroFactura { get; set; }
        public string  fecha { get; set; }
        public string  proveedor { get; set; }
        public string  subTotal { get; set; }
        public string  igv { get; set; }
        public string  total { get; set; }
        public string  nroOC { get; set; }
        public string  tipoOC { get; set; }
        public string  formaPago { get; set; }
        public string  fechaAproxPago { get; set; }
        public string  idEstado { get; set; }
        public string  descripcionEstado { get; set; }
        public string  usuarioAprobador1 { get; set; }
        public string  fechaAprobacion1 { get; set; }
        public string  usuarioAprobador2 { get; set; }
        public string  fechaAprobacion2 { get; set; }
        public string  usuarioDevuelve { get; set; }
        public string fechaDevuelve { get; set; }

        public string porDetraccion { get; set; }
        public string totDetraccion { get; set; }
        public string totalPagar { get; set; }

    }






}
