import { Component, OnInit } from "@angular/core";
import { ContratosService } from "src/app/services/contratos.service";
import { Router } from "@angular/router";
import { Contrato } from "src/app/models/interfaces";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from "src/app/services/api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-contrato-agregar',
  templateUrl: './contrato-agregar.component.html',
  styleUrls: ['./contrato-agregar.component.css']
})
export class ContratoAgregarComponent implements OnInit {

  error: boolean = false;
  contrato = <Contrato>{};
  telefonos = [];
  tiposContratos = [];
  tipoFotos = [];
  tipoAccesorios = [];
  selectContrato: string = "";
  radio: string;
  precioAutomatico: number = 0;
  precioFinal: number = 0;
  fotos = [];
  dimensionesActuales = [];
  dimensionActual = "";
  accesorios = [];
  accesoriosActuales = [];
  accesorioActual = " ";
  valido: boolean;
  minDate = new Date(Date.now());
  fechaCita;
  fechaEntrega;
  hora_cita: string;
  mensaje: string = "";
  dataSource: MatTableDataSource<any>;
  displayedColumns = ["hora_cita", "nombre", "tipo_contrato"];

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
    private contratosService: ContratosService,
    public router: Router,
    private _api: ApiService
  ) {
    this.notifier = notifier;
    this.telefonos.length = 1;
    this.radio = "";
    this.dataSource = new MatTableDataSource();
    this.minDate.setHours(0, 0, 0, 0);
    this.fechaCita = this.minDate;
    this.fechaEntrega = this.minDate;
  }

  ngOnInit(): void {
    if (this._api.getUsuario() == null) {
      this.router.navigateByUrl("/");
    }
    this.getNuevoNumeroContrato();
    this.getTiposContratos();
    this.getTiposFotos();
    this.getTiposAccesorios();
    this.getHoraTipoNombrePorFechaCita();
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

  async setContrato() {
    this.contrato.telefono = this.telefonos;
    this.contrato.precio = this.precioFinal;
    this.contrato.tipo_contrato = this.selectContrato;
    this.contrato.hora_cita = this.hora_cita;
    this.contrato.fecha_cita = this.fechaCita;
    this.contrato.fecha_entrega = this.fechaEntrega;
    this.contrato.estado = "Pendiente";
    this.contrato.fotos = await this.getFotos();
    this.contrato.accesorios = await this.getAccesorios();
    this.getNuevoNumeroContrato();
    if (this.contrato.numero_contrato != null) {
      this.spinner.show();
      this.contratosService.setContrato(this.contrato).subscribe(
        data => {
          this.spinner.hide();
          console.log("OK OK OK", data);
          this.showNotification( 'success', 'Nuevo Contrato Agregado!' )
          this.router.navigateByUrl("/contratos");
        },
        err => {
          this.spinner.hide();
          console.log("Ha ocurrido un Error: ", err)
          this.showNotification( 'error', 'Ha ocurrido un Error!' )
       }
      );
    }
  }

  getNuevoNumeroContrato() {
    this.contratosService.getNuevoNumeroContrato().subscribe(
      data => {
        if (data.error) {
          console.log(data);
          this.contrato.numero_contrato = null;
        } else {
          console.log(data.numero_contrato);
          this.contrato.numero_contrato = data.numero_contrato + 1;
        }
      },
      err => {
        console.error(err);
        this.contrato.numero_contrato = null;
      }
    );
  }

  getHoraTipoNombrePorFechaCita() {
    this.contratosService
      .getHoraTipoNombrePorFechaCita({ fecha_cita: this.fechaCita })
      .subscribe(
        data => {
          if (data.error) {
            console.log(data);
            this.dataSource = new MatTableDataSource();
            console.log(this.dataSource.data.length);
            this.validarFechas();
          } else {
            this.dataSource = new MatTableDataSource(data);
            console.log(data);
            this.validarFechas();
          }
        },
        err => {
          console.error(err)
          this.showNotification( 'error', 'Ha ocurrido un Error!' )
        }
      );
  }

  getTiposContratos() {
    this.contratosService.getTiposContratos().subscribe(
      data => {
        this.tiposContratos = data;
        console.log(this.tiposContratos);
      },
      err => {
        console.error(err);
        if (err.status == 401) {
          this.router.navigateByUrl("/login");
        }
      }
    );
  }

  getTiposFotos() {
    this.contratosService.getTiposFotos().subscribe(
      data => {
        this.tipoFotos = data;
        if (this.tipoFotos.length>0) {
        this.tipoFotos.forEach(foto => {
          let fot = { dimension: "", cantidad: 1 };
          fot.dimension = foto.dimension;
          fot.cantidad = 1;
          this.dimensionesActuales[this.dimensionesActuales.length] = fot;
        });
        console.log(this.dimensionesActuales);
        console.log(this.tipoFotos);
      }
      },
      err => {
        console.error(err);
        this.router.navigateByUrl("/login");
      }
    );
  }

  getTiposAccesorios() {
    this.contratosService.getTipoAccesorios().subscribe(
      data => {
        this.tipoAccesorios = data;
        if (this.tipoAccesorios.length>0) {
        this.tipoAccesorios.forEach(accesorio => {
          let acces = { tipo: "", cantidad: 1 };
          acces.tipo = accesorio.tipo;
          acces.cantidad = 1;
          this.accesoriosActuales[this.accesoriosActuales.length] = acces;
        });
        console.log(this.accesoriosActuales);
        console.log(this.tipoAccesorios);
      }
      },
      err => console.error(err)
    );
  }

  agregar() {
    if (this.telefonos.length < 5) {
      this.telefonos.length++;
    }
  }
  eliminar() {
    if (this.telefonos.length > 1) {
      this.telefonos.length--;
    }
  }

  calcularPrecio(): number {
    this.precioAutomatico = 0;
    if (this.selectContrato != "---") {
      for (let i = 0; i < this.tiposContratos.length; i++) {
        if (this.tiposContratos[i].tipo == this.selectContrato) {
          this.tiposContratos[i].fotos.forEach(foto => {
            this.precioAutomatico +=
              foto.cantidad * this.buscarPrecioFoto(foto.tipoFotos);
          });
          this.tiposContratos[i].accesorios.forEach(accesorio => {
            this.precioAutomatico +=
              accesorio.cantidad *
              this.buscarPrecioAccesorio(accesorio.tipoAccesorios);
          });
        }
      }
    } else {
      for (let i = 0; i < this.fotos.length; i++) {
        if (this.fotos[i].dimension != "" && this.fotos[i].cantidad > 0) {
          this.precioAutomatico +=
            this.fotos[i].cantidad *
            this.buscarPrecioFotoSinContrato(this.fotos[i].dimension);
        }
      }
      for (let i = 0; i < this.accesorios.length; i++) {
        if (this.accesorios[i].tipo != "" && this.accesorios[i].cantidad > 0) {
          this.precioAutomatico +=
            this.accesorios[i].cantidad *
            this.buscarPrecioAccesorioSinContrato(this.accesorios[i].tipo);
        }
      }
    }
    this.precioFinal = this.precioAutomatico;
    return this.precioAutomatico;
  }
  buscarPrecioFoto(id: string): number {
    let precio = 1;
    this.tipoFotos.forEach(foto => {
      if (foto._id == id) {
        precio = foto.precio;
      }
    });
    return precio;
  }
  buscarPrecioFotoSinContrato(dimension: string): number {
    let precio = 0;
    this.tipoFotos.forEach(foto => {
      if (foto.dimension == dimension) {
        precio = foto.precio;
      }
    });
    return precio;
  }
  buscarPrecioAccesorio(id: string): number {
    let precio = 1;
    this.tipoAccesorios.forEach(accesorio => {
      if (accesorio._id == id) {
        precio = accesorio.precio;
      }
    });
    return precio;
  }
  buscarPrecioAccesorioSinContrato(tipo: string): number {
    let precio = 0;
    this.tipoAccesorios.forEach(accesorio => {
      if (accesorio.tipo == tipo) {
        precio = accesorio.precio;
      }
    });
    return precio;
  }

  getFotos(): Array<any> {
    let fotos = [];
    if (this.selectContrato != "---" && this.tiposContratos.length>0) {
      for (let i = 0; i < this.tiposContratos.length; i++) {
        if (this.tiposContratos[i].tipo == this.selectContrato) {
          for (let j = 0; j < this.tiposContratos[i].fotos.length; j++) {
            let foto = { dimension: "", cantidad: 1 };
            foto.dimension = this.tiposContratos[i].fotos[j].tipoFotos.dimension
            foto.cantidad = this.tiposContratos[i].fotos[j].cantidad;
            fotos[fotos.length] = foto;
          }
        }
      }
    } else {
      for (let i = 0; i < this.fotos.length; i++) {
        let foto = { dimension: "", cantidad: 1 };
        foto.dimension = this.fotos[i].dimension;
        foto.cantidad = this.fotos[i].cantidad;
        fotos[i] = foto;
      }
    }
    return fotos;
  }

  getAccesorios(): Array<any> {
    let accesorios = [];
    if (this.selectContrato != "---" && this.tiposContratos.length>0) {
      for (let i = 0; i < this.tiposContratos.length; i++) {
        if (this.tiposContratos[i].tipo == this.selectContrato) {
          for (let j = 0; j < this.tiposContratos[i].accesorios.length; j++) {
            let accesorio = { tipo: "", cantidad: 1 };
            accesorio.tipo = this.tiposContratos[i].accesorios[j].tipoAccesorios.tipo
            accesorio.cantidad = this.tiposContratos[i].accesorios[j].cantidad
            accesorios[accesorios.length] = accesorio;
          }
        }
      }
    } else {
      for (let i = 0; i < this.accesorios.length; i++) {
        let accesorio = { tipo: "", cantidad: 1 };
        accesorio.tipo = this.accesorios[i].tipo;
        accesorio.cantidad = this.accesorios[i].cantidad;
        accesorios[i] = accesorio;
      }
    }
    return accesorios;
  }

  // Fotos

  agregarFoto() {
    if (this.fotos.length < this.tipoFotos.length) {
      this.dimensionActual = "";
      let fot = { dimension: "", cantidad: 1 };
      this.fotos[this.fotos.length] = fot;
    }
  }

  eliminarFoto() {
    if (this.fotos.length > 0) {
      if (
        this.fotos[this.fotos.length - 1] != undefined &&
        this.fotos[this.fotos.length - 1].dimension != ""
      ) {
        this.dimensionesActuales.push(this.fotos[this.fotos.length - 1]);
      }
      this.dimensionActual = "";
      this.fotos.length--;
    }
  }

  comprobarDimensionRepetida(valor) {
    this.dimensionesActuales = this.dimensionesActuales.filter(
      actual => actual.dimension != valor
    );
    if (this.dimensionActual != "") {
      this.tipoFotos.forEach(foto => {
        if (foto.dimension == this.dimensionActual) {
          this.dimensionesActuales.push(foto);
        }
      });
    }
    this.dimensionActual = "";
  }

  guardarDimensionActual(valor) {
    if (valor != undefined) {
      this.dimensionActual = valor;
    }
  }

  // Accesorios

  agregarAccesorio() {
    if (this.accesorios.length < this.tipoAccesorios.length) {
      this.accesorioActual = "";
      let acces = { tipo: "", cantidad: 1 };
      this.accesorios[this.accesorios.length] = acces;
    }
  }

  eliminarAccesorio() {
    if (this.accesorios.length > 0) {
      if (
        this.accesorios[this.accesorios.length - 1] != undefined &&
        this.accesorios[this.accesorios.length - 1].tipo != ""
      ) {
        this.accesoriosActuales.push(
          this.accesorios[this.accesorios.length - 1]
        );
      }
      this.accesorioActual = "";
      this.accesorios.length--;
    }
  }

  comprobarAccesorioRepetido(valor) {
    this.accesoriosActuales = this.accesoriosActuales.filter(
      actual => actual.tipo != valor
    );
    if (this.accesorioActual != "") {
      this.tipoAccesorios.forEach(accesorio => {
        if (accesorio.tipo == this.accesorioActual) {
          this.accesoriosActuales.push(accesorio);
        }
      });
    }
    this.accesorioActual = "";
  }

  guardarAccesorioActual(valor) {
    if (valor != undefined) {
      this.accesorioActual = valor;
    }
  }

  validar() {
    this.valido = true;
    this.fotos.forEach(foto => {
      if (foto.dimension == "" || foto.cantidad < 1) {
        this.valido = false;
        return this.valido;
      }
    });
    this.accesorios.forEach(accesorio => {
      if (accesorio.tipo == "" || accesorio.cantidad < 1) {
        this.valido = false;
        return this.valido;
      }
    });
    return this.valido;
  }

  validarFechas() {
    if (this.fechaCita > this.fechaEntrega) {
      this.valido = false;
      this.mensaje = '*"Fecha de Cita debe ser menor que la de Entrega"';
    } else {
      this.mensaje = " ";
    }
  }
}
