import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: boolean = false

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
   }

   ngOnInit() {
     this._api.logout()
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
    this.error = false
    this._api.login(form.value).subscribe(
      res => {
        this.showNotification( 'success', `Bienvenido ${this._api.dataUser.dataUser.nombre} ${this._api.dataUser.dataUser.apellidos}!` )
        this.router.navigateByUrl('/inicio')
      },
      err => {
        if (err.status == 403) {
          this.error = true
          this.showNotification( 'warning', 'Compruebe Usuario y Contraseña!' )
        }else{
          this.showNotification( 'error', 'Error de Conexión!' )
        }
      });
  }

}
