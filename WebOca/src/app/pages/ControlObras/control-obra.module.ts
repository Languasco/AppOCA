
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; 
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BandejaAtencionComponent } from './Procesos/bandeja-atencion/bandeja-atencion.component';
import { TimepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    BandejaAtencionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    Ng2SearchPipeModule,
    TimepickerModule.forRoot(),
  ],
  exports:[
    BandejaAtencionComponent
  ]
})
export class ControlObraModule { }
