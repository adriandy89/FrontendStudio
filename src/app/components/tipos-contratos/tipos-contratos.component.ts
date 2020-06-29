import { Component, OnInit, ViewChild } from "@angular/core";
import { ContratosService } from "../../services/contratos.service";
import { TiposContratosService } from 'src/app/services/tipos-contratos.service';
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
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
  selector: 'app-tipos-contratos',
  templateUrl: './tipos-contratos.component.html',
  styleUrls: ['./tipos-contratos.component.css'],
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
export class TiposContratosComponent implements OnInit {

  isAdm= false
  Accesorios
  Fotos
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['tipo', 'precio', 'descripcion'];
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
    private tipoContratoService: TiposContratosService,
    private contratosService: ContratosService,
    public router: Router,
    private _api: ApiService,
    private dialogService: DialogService
  ) {
    this.notifier = notifier;
    this.dataSource = new MatTableDataSource();
   }

  ngOnInit() {
    let user= this._api.getUsuario()
    if (user == null) {
      this.router.navigateByUrl("/");
    }else {
      this.getContratos();
      if (user.dataUser.isAdmin) {
        this.isAdm= true
      }
    }
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

  getContratos() {
    this.spinner.show();
    this.contratosService.getTiposContratos().subscribe(
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
    this.dialogService.openConfirmDialog('Seguro que deseas Eliminar el Tipo de Contrato?').afterClosed().subscribe( res => {
      if (res) {
        this.spinner.show();
        this.tipoContratoService.deleteContrato(id).subscribe(
          data => {
            this.spinner.hide();
            this.showNotification( 'success', 'Tipo de Contrato Eliminado!' )
            this.getContratos()
          },
          err => {
            this.spinner.hide();
            console.log("Ha ocurrido un Error: ", err)
            this.showNotification( 'error', 'Error de Conexión!' )
          }
        );
        }
    })
  }

  modificar(id: string) {
    this.dialogService.openConfirmDialog('Seguro que deseas Modificar el Tipo de Contrato?').afterClosed().subscribe( res => {
      if (res) {
        this.contratosService.setContratoId(id);
        this.router.navigateByUrl("tiposcontratos/modificar");
        }
    })
  }

}
