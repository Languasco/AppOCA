import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { OrdenCompraAdjuntarComponent } from './pages/Logistica/Procesos/orden-compra-adjuntar/orden-compra-adjuntar.component';
import { OrdenCompraAprobarComponent } from './pages/Logistica/Procesos/orden-compra-aprobar/orden-compra-aprobar.component';
import { HomeModuloComponent } from './pages/home-modulo/home-modulo.component';
import { BandejaAtencionComponent } from './pages/ControlObras/Procesos/bandeja-atencion/bandeja-atencion.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActualizarProveedorComponent } from './pages/ModuloProveedores/Procesos/actualizar-proveedor/actualizar-proveedor.component';
import { EstadoEvaluacionComponent } from './pages/ModuloProveedores/Procesos/estado-evaluacion/estado-evaluacion.component';
import { RegistroFacturasComponent } from './pages/ModuloProveedores/Procesos/registro-facturas/registro-facturas.component';
import { EstadoFacturasComponent } from './pages/ModuloProveedores/Procesos/estado-facturas/estado-facturas.component';
import { BandejaProveedoresComponent } from './pages/ModuloProveedores/Procesos/bandeja-proveedores/bandeja-proveedores.component';
import { EvaluacionProveedorComponent } from './pages/ModuloProveedores/Procesos/evaluacion-proveedor/evaluacion-proveedor.component';
import { AprobarEvaluacionProveedorComponent } from './pages/ModuloProveedores/Procesos/aprobar-evaluacion-proveedor/aprobar-evaluacion-proveedor.component';
import { IncidenciaProveedorComponent } from './pages/ModuloProveedores/Procesos/incidencia-proveedor/incidencia-proveedor.component';
import { CajaChicaComponent } from './pages/ModuloProveedores/Procesos/caja-chica/caja-chica.component';
import { AprobarFacturasComponent } from './pages/ModuloProveedores/Procesos/aprobar-facturas/aprobar-facturas.component';
import { AprobarCajaChicaComponent } from './pages/ModuloProveedores/Procesos/aprobar-caja-chica/aprobar-caja-chica.component';
 
const APP_ROUTERS: Routes = [
    { path: 'login', component: LoginComponent},  
    { path: 'home', component: HomeComponent,  canActivate: [ AuthGuard]},  
    { path: 'inicio', component: HomeModuloComponent,  canActivate: [ AuthGuard]}, 
    // Logistica 
    { path: 'orden-compra-adjuntar', component: OrdenCompraAdjuntarComponent, canActivate: [ AuthGuard] },  
    { path: 'orden-compra-aprobar', component: OrdenCompraAprobarComponent, canActivate: [ AuthGuard] },  
    // Control de obras
    { path: 'BandejaAtencion', component: BandejaAtencionComponent, canActivate: [ AuthGuard] },  

    { path: 'register', component: RegisterComponent},  
    { path: 'actualizar-proveedor', component: ActualizarProveedorComponent},  
    { path: 'estado-evaluacion', component: EstadoEvaluacionComponent},  
    { path: 'registro-facturas', component: RegistroFacturasComponent},  
    { path: 'estado-facturas', component: EstadoFacturasComponent},  
    { path: 'bandeja-proveedores-nuevos', component: BandejaProveedoresComponent},  
    { path: 'evaluacion-proveedores', component: EvaluacionProveedorComponent  },  
    { path: 'aprobar-evaluacion-proveedores', component: AprobarEvaluacionProveedorComponent  },  
    { path: 'incidencia-proveedor', component: IncidenciaProveedorComponent  },  
    { path: 'caja-chica', component: CajaChicaComponent  },  

    { path: 'aprobar-facturas', component: AprobarFacturasComponent  },  
    { path: 'aprobar-caja-chica', component: AprobarCajaChicaComponent  },  

    { path: '', pathMatch:'full', redirectTo:'home' },
    { path: '**', pathMatch:'full', redirectTo:'home' },
  ];
  
  export const APP_ROUTING = RouterModule.forRoot(APP_ROUTERS,{useHash:true});  
