import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DialogService } from 'src/app/services/dialog.service';
import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import { NotifierService } from 'angular-notifier';

import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class UsuariosComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['usuario', 'nombre', 'apellidos'];
  expandedElement: null;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

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
    public router: Router,
    private _api: ApiService,
    private dialogService: DialogService
    ) {
      this.notifier = notifier;
      this.dataSource = new MatTableDataSource();
     }

  ngOnInit(): void {
    let user= this._api.getUsuario()
    if (user == null) {
      this.router.navigateByUrl("/");
    }
    else if (user.dataUser.isAdmin == false) {
      this.router.navigateByUrl("/contratos");
    }else this.getUsuarios()
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

  getUsuarios() {
    this.spinner.show();
    this._api.getUsuarios().subscribe(
      (data: any[]) => {
        this.spinner.hide();
        if (data.length>0) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else{this.dataSource = new MatTableDataSource()}
      },
      err => {
        this.spinner.hide();
        console.log("Ha ocurrido un Error: ", err)
        this.router.navigateByUrl("/login")
      }
    );
  }

  eliminar(id: string) {
    this.dialogService.openConfirmDialog('Seguro que deseas Eliminar el Usuario?').afterClosed().subscribe( res => {
      if (res) {
        this.spinner.show();
        this._api.deleteUsuario(id).subscribe(
            data => {
              this.spinner.hide();
              console.log(data)
              this.showNotification( 'success', 'Usuario Eliminado!' )
              this.getUsuarios()
            },
            err => {
              this.spinner.hide();
              console.log("Ha ocurrido un Error: ", err)
              this.showNotification( 'error', 'Ha ocurrido un Error!' )
            }
          );
        }
    })
  }

  modificar(id: string) {
    this.dialogService.openConfirmDialog('Modificar Datos del Usuario?').afterClosed().subscribe( res => {
      if (res) {
        localStorage.setItem('USER_ID', id)
        this.router.navigateByUrl("usuarios/modificar");
        }
    })
  }

  cambiarPass(id: string) {
    this.dialogService.openConfirmDialog('Cambiar Contraseña?').afterClosed().subscribe( res => {
      if (res) {
        localStorage.setItem('USER_ID', id)
        this.router.navigateByUrl("usuarios/password");
        }
    })
  }

}
