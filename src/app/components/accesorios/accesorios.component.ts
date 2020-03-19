import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { AccesoriosService } from 'src/app/services/accesorios.service';
import { DialogService } from 'src/app/services/dialog.service';
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

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.css'],
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
export class AccesoriosComponent implements OnInit {

  isAdm= false
  Accesorio
  tipo: string
  precio: number
  descripcion: string
  modificar: boolean
  agregar: boolean
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ["tipo", "precio", "descripcion"];
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
    private accesorioService: AccesoriosService,
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
      this.getTiposAccesorios()
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

  gestionarAccesorio(){
    this.agregar= false
  }

  agregarAccesorio(){
    let data = <any>{};
    data.tipo= this.tipo
    data.precio= this.precio
    data.descripcion= this.descripcion
    this.accesorioService.setAccesorio(data).subscribe(
      dat => {
        this.getTiposAccesorios()
        this.agregarFalse()
        this.showNotification( 'success', 'Accesorio Agregado!' )
        console.log("OK OK OK", dat);
      },
      err => {
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Ha ocurrido un Error!' )
     }
    )
  }

  agregarFalse(){
    this.agregar=false
    this.tipo= null
    this.precio= null
    this.descripcion= null
  }

  agregarTrue(){
    this.agregar=true
    this.tipo= null
    this.precio= null
    this.descripcion= null
  }

  eliminarAccesorio(id: string) {
    this.dialogService.openConfirmDialog('Seguro que deseas Eliminar el Accesorio?').afterClosed().subscribe( res => {
      if (res) {
        this.accesorioService.deleteAccesorio(id).subscribe(
          data => {
            this.getTiposAccesorios()
            this.modificar=false
            this.agregarFalse()
            console.log(data)
            this.showNotification( 'success', 'Accesorio Eliminado!' )
          },
          err => {
            console.log("Ha ocurrido un Error: ", err)
            this.showNotification( 'error', 'Ha ocurrido un Error!' )
         }
        )
        }
    })
  }

  modificarAccesorio(id: string) {
    this.dialogService.openConfirmDialog('Seguro que deseas Modificar el Accesorio?').afterClosed().subscribe( res => {
      if (res) {
        this.accesorioService.getAccesorio(id).subscribe(
          data => {
            this.Accesorio = data
            console.log(this.Accesorio)
            this.tipo= this.Accesorio.tipo
            this.precio= this.Accesorio.precio
            this.descripcion= this.Accesorio.descripcion
            this.modificar=true
          },
          err => console.log(err)
        )
        }
    })
  }
  actualizar(){
    if (this.Accesorio) {
      this.Accesorio.tipo= this.tipo
      this.Accesorio.precio= this.precio
      this.Accesorio.descripcion= this.descripcion
      this.accesorioService.updateAccesorio(this.Accesorio._id, this.Accesorio).subscribe(
        data => {
          this.getTiposAccesorios()
          console.log("OK OK OK", data);
          this.showNotification( 'success', 'Accesorio Modificado!' )
          this.modificar= false
          this.tipo= null
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


  getTiposAccesorios() {
    this.contratosService.getTipoAccesorios().subscribe(
      data => {
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
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Ha ocurrido un Error!' )
     }
    );
}

}
