import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FotosService } from 'src/app/services/fotos.service';
import { ContratosService } from 'src/app/services/contratos.service';
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
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css'],
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
export class FotosComponent implements OnInit {

  isAdm= false
  Foto
  dimension: string
  precio: number
  descripcion: string
  modificar: boolean
  agregar: boolean
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ["dimension", "precio", "descripcion"];
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
    private fotoService: FotosService,
    private contratosService: ContratosService,
    public router: Router,
    private _api: ApiService,
    private dialogService: DialogService
  ) {
    this.notifier = notifier;
    this.modificar= false
    this.agregar= false
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    let user= this._api.getUsuario()
    if (user == null) {
      this.router.navigateByUrl("/");
    }
    else {
      this.getTiposFotos()
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

  agregarFoto(){
    let data = <any>{};
    data.dimension= this.dimension
    data.precio= this.precio
    data.descripcion= this.descripcion
    this.fotoService.setFoto(data).subscribe(
      dat => {
        this.getTiposFotos()
        this.agregarFalse()
        console.log("OK OK OK", dat);
        this.showNotification( 'success', 'Foto Agregada!' )
      },
      err => {
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Ha ocurrido un Error!' )
     }
    )
  }

  agregarFalse(){
    this.agregar=false
    this.dimension= null
    this.precio= null
    this.descripcion= null
  }

  agregarTrue(){
    this.agregar=true
    this.dimension= null
    this.precio= null
    this.descripcion= null
  }

  eliminarFoto(id: string) {
    this.spinner.show();
    this.dialogService.openConfirmDialog('Seguro que deseas Eliminar el Tipo de Foto?').afterClosed().subscribe( res => {
      if (res) {
        this.fotoService.deleteFoto(id).subscribe(
          data => {
            this.spinner.hide();
            this.getTiposFotos()
            this.modificar=false
            this.agregarFalse()
            console.log(data)
            this.showNotification( 'success', 'Foto Eliminada!' )
          },
          err => {
            this.spinner.hide();
            console.log("Ha ocurrido un Error: ", err)
            this.showNotification( 'error', 'Ha ocurrido un Error!' )
         }
        )
        }
    })
  }

  modificarFoto(id: string) {
    this.spinner.show();
    this.dialogService.openConfirmDialog('Seguro que deseas Modificar el Tipo de Foto?').afterClosed().subscribe( res => {
      if (res) {
        this.fotoService.getFoto(id).subscribe(
          data => {
            this.spinner.hide();
            this.Foto= data
            console.log(this.Foto)
            this.dimension= this.Foto.dimension
            this.precio= this.Foto.precio
            this.descripcion= this.Foto.descripcion
            this.modificar=true
          },
          err => {
            this.spinner.hide();
            console.log(err)
          }
        )
        }
    })

  }
  actualizar(){
    if (this.Foto) {
      this.Foto.dimension= this.dimension
      this.Foto.precio= this.precio
      this.Foto.descripcion= this.descripcion
      this.fotoService.updateFoto(this.Foto._id, this.Foto).subscribe(
        data => {
          this.getTiposFotos()
          console.log("OK OK OK", data);
          this.showNotification( 'success', 'Foto Modificada!' )
          this.modificar= false
          this.dimension= null
          this.precio= null
          this.descripcion= null
        },
        err => {
          console.log("Ha ocurrido un Error: ", err)
          this.showNotification( 'error', 'Ha ocurrido un Error!' )
       }
      )
    }
  }


  getTiposFotos() {
    this.spinner.show();
    this.contratosService.getTiposFotos().subscribe(
      data => {
        this.spinner.hide();
        if (data.error) {
          console.log(data);
          this.dataSource = new MatTableDataSource();
        } else {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource.data)
        }
      },
      err => {
        this.spinner.hide();
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Ha ocurrido un Error!' )
     }
    );
}

}
