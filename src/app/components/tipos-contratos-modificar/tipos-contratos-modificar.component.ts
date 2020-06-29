import { Component, OnInit } from '@angular/core';
import { TiposContratosService } from 'src/app/services/tipos-contratos.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-tipos-contratos-modificar',
  templateUrl: './tipos-contratos-modificar.component.html',
  styleUrls: ['./tipos-contratos-modificar.component.css']
})
export class TiposContratosModificarComponent implements OnInit {

  contrato= <any>{}
  tipo: string
  descripcion: string
  radio: string;
  precioAutomatico: number = 0;
  precioFinal: number = 0;
  fotos = [];
  accesorios = [];
  tipoFotos = [];
  tipoAccesorios = [];
  dimensionesActuales = [];
  accesoriosActuales = [];
  dimensionActual = "";
  accesorioActual = " ";
  valido: boolean;

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
    private tiposContratosService: TiposContratosService,
    public router: Router,
    private _api: ApiService
  ) {
    this.notifier = notifier;
    this.radio = "";
   }

  ngOnInit() {
    let user= this._api.getUsuario()
    if (user == null) {
      this.router.navigateByUrl("/");
    }
    else if (user.dataUser.isAdmin == false) {
      this.router.navigateByUrl("/contratos");
    }else {
      this.getTiposFotos();
      this.getTiposAccesorios();
      this.getContrato();
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

  getContrato() {
    this.spinner.show();
    this.tiposContratosService.getContrato(this.contratosService.getContratoId()).subscribe(
      async data => {
        this.spinner.hide();
        this.contrato = data;
        this.tipo= this.contrato.tipo;
        this.precioFinal= this.contrato.precio;
        this.descripcion= this.contrato.descripcion;
        this.radio = "manual";
        this.fotos= this.contrato.fotos;
        this.accesorios= this.contrato.accesorios;
        console.log(this.contrato);
        await this.quitarAccesorioQueNoExiste();
        await this.quitarFotoQueNoExiste()
        this.tipoFotos.forEach(tipoFoto => {
          this.fotos.forEach(foto => {
            if (foto.tipoFotos == tipoFoto._id) {
              foto.dimension= tipoFoto.dimension
              this.comprobarDimensionRepetida(foto.dimension)
            }
          });
        });
        this.tipoAccesorios.forEach(tipoAcc => {
          this.accesorios.forEach(Acc => {
            if (Acc.tipoAccesorios == tipoAcc._id) {
              Acc.tipo= tipoAcc.tipo
              this.comprobarAccesorioRepetido(Acc.tipo)
            }
          });
        });
      },
      err => {
        this.spinner.hide();
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Ha ocurrido un Error!' )
     }
    );
  }

  //------------------
  updateContrato() {
    this.spinner.show();
    this.contrato.tipo = this.tipo;
    this.contrato.precio = this.precioFinal;
    this.contrato.descripcion = this.descripcion;
    this.contrato.fotos = this.getFotos();
    this.contrato.accesorios = this.getAccesorios();
    this.tiposContratosService.updateContrato(this.contratosService.getContratoId(), this.contrato).subscribe(
      data => {
        this.spinner.hide();
        console.log("OK OK OK", data);
        this.showNotification( 'success', 'Tipo de Contrato Modificado!' )
        this.router.navigateByUrl("/tiposcontratos");
      },
      err => {
        this.spinner.hide();
        console.log("Ha ocurrido un Error: ", err)
        this.showNotification( 'error', 'Ha ocurrido un Error!' )
     }
    );
  }

  calcularPrecio(): number {
    this.precioAutomatico = 0;
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
    this.precioFinal = this.precioAutomatico;
    return this.precioAutomatico;
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
  buscarPrecioAccesorioSinContrato(tipo: string): number {
    let precio = 0;
    this.tipoAccesorios.forEach(accesorio => {
      if (accesorio.tipo == tipo) {
        precio = accesorio.precio;
      }
    });
    return precio;
  }

  getTiposFotos() {
    this.contratosService.getTiposFotos().subscribe(
      data => {
        if (!data.error) {
          this.tipoFotos = data;
          if (this.tipoFotos.length>0) {
            this.tipoFotos.forEach(foto => {
              let fot = { dimension: "", cantidad: 1, id: "" };
              fot.dimension = foto.dimension;
              fot.cantidad = 1;
              fot.id= foto._id;
              this.dimensionesActuales[this.dimensionesActuales.length] = fot;
          });
          }
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  getTiposAccesorios() {
    this.contratosService.getTipoAccesorios().subscribe(
      data => {
        console.log(data)
        if(!data.error){
          this.tipoAccesorios = data;
          if (this.tipoAccesorios.length>0) {
            this.tipoAccesorios.forEach(accesorio => {
              let acces = { tipo: "", cantidad: 1, id: "" };
              acces.tipo = accesorio.tipo;
              acces.cantidad = 1;
              acces.id = accesorio._id;
              this.accesoriosActuales[this.accesoriosActuales.length] = acces;
            });
          }
        }
      },
      err => console.error(err)
    );
  }

  getFotos(): Array<any> {
    let fotos = [];
      for (let i = 0; i < this.fotos.length; i++) {
        let foto = { fotoId: "", cantidad: 1 };
        foto.fotoId = this.getFotoId(this.fotos[i].dimension);
        foto.cantidad = this.fotos[i].cantidad;
        fotos[i] = foto;
      }
    return fotos;
  }
  getFotoId(dimens: string): string {
      for (let i = 0; i < this.tipoFotos.length; i++) {
        if (dimens==this.tipoFotos[i].dimension) {
          return this.tipoFotos[i]._id;
        }
      }
    return "";
  }

  getAccesorios(): Array<any> {
    let accesorios = [];
      for (let i = 0; i < this.accesorios.length; i++) {
        let accesorio = { accesorioId: "", cantidad: 1 };
        accesorio.accesorioId = this.getAccesorioId(this.accesorios[i].tipo);
        accesorio.cantidad = this.accesorios[i].cantidad;
        accesorios[i] = accesorio;
      }
    return accesorios;
  }
  getAccesorioId(tip: string): string {
    for (let i = 0; i < this.tipoAccesorios.length; i++) {
      if (tip==this.tipoAccesorios[i].tipo) {
        return this.tipoAccesorios[i]._id;
      }
    }
  return "";
}

// Fotos

agregarFoto() {
  if (this.fotos.length < this.tipoFotos.length) {
    this.dimensionActual = "";
    let fot = { dimension: "", cantidad: 1, id: ""};
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
    let acces = { tipo: "", cantidad: 1, id: "" };
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

quitarAccesorioQueNoExiste(){
  for (let i = 0; i < this.accesorios.length; i++) {
    let ex = false
    if (this.tipoAccesorios.length>0) {
      this.tipoAccesorios.forEach(Acc => {
        if (Acc._id == this.accesorios[i].tipoAccesorios) {
          ex=true
        }
      })
      if (!ex) {
        this.accesorios = this.accesorios.filter(e => e.tipoAccesorios!=this.fotos[i].tipoAccesorios)
      }
    }
  }
}
quitarFotoQueNoExiste(){
  for (let i = 0; i < this.fotos.length; i++) {
    let ex = false
    if (this.tipoFotos.length>0) {
      this.tipoFotos.forEach(Acc => {
        if (Acc._id == this.fotos[i].tipoFotos) {
          ex=true
        }
      })
    }
    if (!ex) {
      this.fotos = this.fotos.filter(e => e.tipoFotos!=this.fotos[i].tipoFotos)
    }
  }
}


}
