import { Component, OnInit, ViewChild } from "@angular/core";
import { ContratosService } from "../../services/contratos.service";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";

import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import { NotifierService } from 'angular-notifier';

import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
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
export class InicioComponent implements OnInit {

  fechaCita
  fechaCita2
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['hora_cita', 'nombre', 'apellidos', 'tipo_contrato'];
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
    notifier: NotifierService,
    private contratosService: ContratosService,
    private router: Router,
    private _api: ApiService,
    private dialogService: DialogService
  ) {
    this.notifier = notifier;
    this.dataSource = new MatTableDataSource();
    let minDate = new Date(Date.now());
    minDate.setHours(0, 0, 0, 0);
    this.fechaCita = minDate;
    this.fechaCita2 = minDate;
  }

  ngOnInit() {
    if (this._api.getUsuario() == null) {
      this.router.navigateByUrl('/')
    }
    this.getContratos();
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
    if (this.fechaCita>this.fechaCita2) {
      this.fechaCita2=this.fechaCita
    }
    this.contratosService.getContratosPendientesIntervalo({ fecha_cita: this.fechaCita, fecha_cita2: this.fechaCita2 }).subscribe(
      (data: any[]) => {
        if (data.length>0) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else{this.dataSource = new MatTableDataSource()}
      },
      err => {
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Error de Conexión!' )
        this.router.navigateByUrl("/login")
      }
    );
  }

  eliminar(id: string) {
    this.dialogService.openConfirmDialog('Seguro que deseas Eliminar el Contrato?').afterClosed().subscribe( res => {
      if (res) {
        this.contratosService.setContratoId(id);
        this.contratosService.deleteContrato().subscribe(
          data => {
            localStorage.removeItem("CONTRATO_ID");
            console.log(data)
            this.showNotification( 'success', 'Contrato Eliminado!' )
            this.getContratos()
          },
          err => {
            console.log("Ha ocurrido un Error: ", err)
            this.showNotification( 'error', 'Error de Conexión!' )
          }
        );
        }
    })
  }

  modificar(id: string) {
    this.dialogService.openConfirmDialog('Seguro que deseas Modificar el Contrato?').afterClosed().subscribe( res => {
      if (res) {
        this.contratosService.setContratoId(id);
        this.router.navigateByUrl("contratos/modificar");
        }
    })
  }

  cambiarEstado(id: string) {
    this.dialogService.openConfirmDialog('Desea Cambiar el Estado del Contrato?').afterClosed().subscribe( res => {
      if (res) {
        this.contratosService.setContratoId(id);
        this.contratosService.getContrato().subscribe(
          data => {
            let contrato= data;
            if (contrato.estado == "Pendiente") {
              contrato.estado= "Terminado"
            } else if (contrato.estado == "Terminado") {
              contrato.estado= "Entregado"
            }

            this.contratosService.updateContrato(contrato).subscribe(
              data => {
                console.log("OK OK OK", data);
                this.showNotification( 'success', 'Estado del Contrato Actualizado!' )
                this.getContratos();
              },
              err => {
                console.log("Ha ocurrido un Error: ", err)
                this.showNotification( 'error', 'Error de Conexión!' )
              }
            );

          },
          err => {
            console.log("Ha ocurrido un Error: ", err)
            this.showNotification( 'error', 'Error de Conexión!' )
          }
        );
        }
    })
  }

  filtrar(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
