import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-usuarios-cambiar-passw',
  templateUrl: './usuarios-cambiar-passw.component.html',
  styleUrls: ['./usuarios-cambiar-passw.component.css']
})
export class UsuariosCambiarPasswComponent implements OnInit {

  error: boolean
  isLogued: boolean
  isAdm: string
  mensaje: string
  checked = false;
  comprobar: string

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
    private spinner: NgxSpinnerService,
    notifier: NotifierService,
    private _api: ApiService,
    private router: Router)
    {
      this.notifier = notifier;
      this.error = false
      this.isLogued = false
      this.mensaje = ""
      this.comprobar = ""
  }

  ngOnInit() {
    if (this._api.getUsuario() == null) {
      this.router.navigateByUrl('/')
    }
    this._api.validarToken().subscribe(
      data => {},
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
    this.spinner.show();
    this._api.loginRegister(form.value).subscribe(
      res => {
        this.spinner.hide();
        console.log(res.dataUser)
        if (res.dataUser.isAdmin==true) {
          this.isLogued = true
          this.error = false
        }else{
          this.isLogued = false
          this.error = true
          this.mensaje = "No tiene permisos administrativos para esta acción."
        }
      },
      err => {
        this.spinner.hide();
        if (err.status == 404) {
          this.error = true
          this.mensaje = "Usuario o Contraseña incorrectos"
        }else{
          this.router.navigateByUrl('/');
        }
      });
  }

  onRegister(): void {
    if (this.usuario.password!=this.comprobar) {
      this.error = true
      this.mensaje = "Las Contraseñas no son iguales, Revise."
      this.showNotification( 'warning', 'La contraseña no coincide!' )
    }else{
    let id = localStorage.getItem('USER_ID') || null
    this.spinner.show();
    this._api.updateUsuario(id, this.usuario).subscribe(
      data => {
        this.spinner.hide();
        console.log("OK OK OK", data);
        this.showNotification( 'success', 'Contraseña Cambiada!' )
        this.router.navigateByUrl("/usuarios");
      },
      err => {
        this.spinner.hide();
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Error de Conexión!' )
      }
    );}
  }

}
