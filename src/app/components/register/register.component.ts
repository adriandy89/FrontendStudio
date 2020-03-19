import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  error: boolean
  isLogued: boolean
  isAdm: string
  mensaje: string
  checked = false;

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
    private router: Router
    ) {
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
        console.log(data)

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

  onRegister(form): void {
    this._api.register(form.value).subscribe(res => {
      console.log(res)
      if (res.error) {
        this.showNotification( 'error', 'Ya existe ese Usuario!' )
      } else {
        this.showNotification( 'success', 'Nuevo Usuario Creado!' )
        this.router.navigateByUrl('/usuarios');
      }

    }, err => {
      console.log(err)
      this.showNotification( 'error', 'Error de Conexión!' )
    });
  }

}
