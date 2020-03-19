import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {NgxPrintModule} from 'ngx-print';
import { ChartModule } from 'angular-highcharts';

import { MatTableModule } from "@angular/material/table"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatButtonModule } from "@angular/material/button"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatIconModule } from "@angular/material/icon"
import { MatSelectModule } from "@angular/material/select"
import { MatRadioModule } from "@angular/material/radio"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from "@angular/common/http";
import { ContratosComponent } from './components/contratos/contratos.component';
import { ContratoAgregarComponent } from './components/contrato-agregar/contrato-agregar.component';
import { ContratoModificarComponent } from './components/contrato-modificar/contrato-modificar.component';
import { AccesoriosComponent } from './components/accesorios/accesorios.component';
import { FotosComponent } from './components/fotos/fotos.component';
import { TiposContratosAgregarComponent } from './components/tipos-contratos-agregar/tipos-contratos-agregar.component';
import { TiposContratosModificarComponent } from './components/tipos-contratos-modificar/tipos-contratos-modificar.component';
import { TiposContratosComponent } from './components/tipos-contratos/tipos-contratos.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuariosModificarComponent } from './components/usuarios-modificar/usuarios-modificar.component';
import { UsuariosCambiarPasswComponent } from './components/usuarios-cambiar-passw/usuarios-cambiar-passw.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

import { NotifierModule, NotifierOptions } from 'angular-notifier';
/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 32,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 4000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    ContratosComponent,
    ContratoAgregarComponent,
    ContratoModificarComponent,
    AccesoriosComponent,
    FotosComponent,
    TiposContratosAgregarComponent,
    TiposContratosModificarComponent,
    TiposContratosComponent,
    ConfirmDialogComponent,
    UsuariosComponent,
    UsuariosModificarComponent,
    UsuariosCambiarPasswComponent,
    InicioComponent,
    EstadisticasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDialogModule,
    NgxPrintModule,
    ChartModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
