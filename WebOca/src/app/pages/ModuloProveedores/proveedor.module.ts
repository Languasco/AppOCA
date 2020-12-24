
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; 
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ActualizarProveedorComponent } from './Procesos/actualizar-proveedor/actualizar-proveedor.component';
import { EstadoEvaluacionComponent } from './Procesos/estado-evaluacion/estado-evaluacion.component';

//----Mask
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { RegistroFacturasComponent } from './Procesos/registro-facturas/registro-facturas.component';
import { EstadoFacturasComponent } from './Procesos/estado-facturas/estado-facturas.component';
import { BandejaProveedoresComponent } from './Procesos/bandeja-proveedores/bandeja-proveedores.component';
import { EvaluacionProveedorComponent } from './Procesos/evaluacion-proveedor/evaluacion-proveedor.component';
import { AprobarEvaluacionProveedorComponent } from './Procesos/aprobar-evaluacion-proveedor/aprobar-evaluacion-proveedor.component';
import { IncidenciaProveedorComponent } from './Procesos/incidencia-proveedor/incidencia-proveedor.component';
import { CajaChicaComponent } from './Procesos/caja-chica/caja-chica.component';
import { AprobarFacturasComponent } from './Procesos/aprobar-facturas/aprobar-facturas.component';
import { AprobarCajaChicaComponent } from './Procesos/aprobar-caja-chica/aprobar-caja-chica.component'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
 

@NgModule({
  declarations: [ 
  ActualizarProveedorComponent, 
  EstadoEvaluacionComponent, RegistroFacturasComponent, EstadoFacturasComponent, BandejaProveedoresComponent, EvaluacionProveedorComponent, AprobarEvaluacionProveedorComponent, IncidenciaProveedorComponent, CajaChicaComponent, AprobarFacturasComponent, AprobarCajaChicaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    Ng2SearchPipeModule,
    NgxMaskModule.forRoot(),
  ],
  exports:[
    ActualizarProveedorComponent, 
    EstadoEvaluacionComponent
  ]
})
export class ProveedorModule { }
