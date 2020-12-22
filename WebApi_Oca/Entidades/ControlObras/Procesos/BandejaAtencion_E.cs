using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.ControlObras.Procesos
{
    public class BandejaAtencion_E
    {
        public string Id_ParteDiario { get; set; }
        public string ParteDiario_ObraTD { get; set; }
        public string ParteDiario_Fecha { get; set; }
        public string CC { get; set; }
        public string Cuadrilla { get; set; }
        public string ParteDiario_Suministro { get; set; }
        public string NroActa { get; set; }
        public string ParteDiario_Latitud { get; set; }
        public string ParteDiario_Longitud { get; set; }
        public string Pub_Esta_Codigo { get; set; }
        public string Estado { get; set; }


        public string fechaEjecucion { get; set; }
        public string horaInicio { get; set; }
        public string idInspectorCliente { get; set; }

        public string idSupervisor { get; set; }
        public string observacion { get; set; }
        public string fechaLiquidacion { get; set; }

    }

    public class BandejaAtencion_Baremos_E
    {
        public string  idBaremo { get; set; }
        public string  codigoBaremo { get; set; }
        public string  descripcion_Baremo { get; set; }
        public string  unidadMedida { get; set; }
        public string  precioBaremo { get; set; }
    }

    




}
