using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Proveedores.Procesos
{
   public class Proveedor_E
    {
        public int id_Proveedor { get; set; }
        public string tipoProveedor { get; set; }
        public string ruc { get; set; }
        public string razonSocial { get; set; }
        public string actEconomica { get; set; }
        public string direccion { get; set; }
        public string pais { get; set; }
        public string departamento { get; set; }
        public string idEstado { get; set; }
        public string estado { get; set; }
    }

    public class vistaPreliminarProveedor_E
    {
        public bool checkeado { get; set; }
        public int idProveedor { get; set; } 
        public string ruc { get; set; }
        public string razonSocial { get; set; }
        public string importeFacturado { get; set; }
        public string porcVentas { get; set; }
        public string porcEvaluacion { get; set; }
        public string flagColorear { get; set; }
    }

    public class Proveedor_Evaluacion {

        public int id_Evaluacion_Cab { get; set; }
        public string nroEvaluacion { get; set; }
        public string periodoEvaluacion { get; set; }
        public string fechaEvaluacion { get; set; }
        public string ProveedorA { get; set; }
        public string ProveedorB { get; set; }
        public string ProveedorC { get; set; }

        public string idEstado { get; set; }
        public string descripcionEstado { get; set; }        
    }


    public class Incidencias_E
    {
        public int id_Incidencia { get; set; }
        public string ruc { get; set; }
        public string razonSocial { get; set; }
        public int id_Proveedor { get; set; }
        public DateTime fechaIngreso_Incidencia { get; set; }
        public string observaciones_Incidencia { get; set; }
        public string Estado { get; set; }
        public string descripcionEstado { get; set; }
    }




}
