import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { ContratoAgregarComponent } from './components/contrato-agregar/contrato-agregar.component';
import { ContratoModificarComponent } from './components/contrato-modificar/contrato-modificar.component';
import { FotosComponent } from './components/fotos/fotos.component';
import { AccesoriosComponent } from './components/accesorios/accesorios.component';
import { TiposContratosComponent } from './components/tipos-contratos/tipos-contratos.component';
import { TiposContratosAgregarComponent } from './components/tipos-contratos-agregar/tipos-contratos-agregar.component';
import { TiposContratosModificarComponent } from './components/tipos-contratos-modificar/tipos-contratos-modificar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuariosModificarComponent } from './components/usuarios-modificar/usuarios-modificar.component';
import { UsuariosCambiarPasswComponent } from './components/usuarios-cambiar-passw/usuarios-cambiar-passw.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent},
  { path: 'estadisticas', component: EstadisticasComponent},
  { path: 'contratos', component: ContratosComponent},
  { path: 'contratos/nuevo', component: ContratoAgregarComponent},
  { path: 'contratos/modificar', component: ContratoModificarComponent},
  { path: 'fotos', component: FotosComponent },
  { path: 'accesorios', component: AccesoriosComponent },
  { path: 'tiposcontratos', component: TiposContratosComponent },
  { path: 'tiposcontratos/nuevo', component: TiposContratosAgregarComponent },
  { path: 'tiposcontratos/modificar', component: TiposContratosModificarComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios/modificar', component: UsuariosModificarComponent },
  { path: 'usuarios/password', component: UsuariosCambiarPasswComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
