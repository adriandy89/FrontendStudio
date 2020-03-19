import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-usuarios-modificar',
  templateUrl: './usuarios-modificar.component.html',
  styleUrls: ['./usuarios-modificar.component.css']
})
export class UsuariosModificarComponent implements OnInit {

  error: boolean
  isLogued: boolean
  isAdm: string
  mensaje: string
  checked = false;

  usuario= <any>{}

  /**
	 * Notifier service
	 */
	private notifier: NotifierService;

	/**
	 * Constructor
	 *
	 * @param {NotifierService} notifier Notifier service
	 */
  constructor(
    notifier: NotifierService,
    private _api: ApiService,
    private router: Router)
    {
      this.notifier = notifier;
      this.error = false
      this.isLogued = false
      this.mensaje = ""
  }

  ngOnInit() {
    if (this._api.getUsuario() == null) {
      this.router.navigateByUrl('/')
    }
    this._api.validarToken().subscribe(
      data => {
        this.cargarDatos()
      },
      err => { console.log(err)
        this.router.navigateByUrl('/')}
    )
  }

  /**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

  onLogin(form): void {
    this._api.loginRegister(form.value).subscribe(
      res => {
        console.log(res.dataUser)
        if (res.dataUser.isAdmin==true) {
          this.isLogued = true
          this.error = false
        }else{
          this.isLogued = false
          this.error = true
          this.mensaje = "No tiene permisos administrativos para esta acción."
          this.showNotification( 'warning', 'Necesita ser Administrador!' )
        }
      },
      err => {
        if (err.status == 403) {
          this.error = true
          this.mensaje = "Usuario o Contraseña incorrectos"
          this.showNotification( 'warning', 'Necesita ser Administrador!' )
        }else{
          this.showNotification( 'error', 'Error de Conexión!' )
        }
      });
  }

  cargarDatos(){
    let id = localStorage.getItem('USER_ID') || null
    this._api.getUsuarioXId(id).subscribe( res => {
      console.log(res)
      this.usuario.nombre= res.nombre
      this.usuario.apellidos=res.apellidos
      this.usuario.usuario=res.usuario
      this.checked=res.isAdmin
    }, err => {
      console.log(err)
      this.showNotification( 'error', 'Error de Conexión!' )
    })
  }

  onRegister(): void {
    let id = localStorage.getItem('USER_ID') || null
    this.usuario.isAdmin=this.checked
    this._api.updateUsuario(id, this.usuario).subscribe(
      data => {
        console.log("OK OK OK", data);
        this.showNotification( 'success', 'Usuario Modificado!' )
        this.router.navigateByUrl("/usuarios");
      },
      err => {
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Error de Conexión!' )
      }
    );
  }

}
