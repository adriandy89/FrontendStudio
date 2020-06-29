import { Component, OnInit, ViewChild } from "@angular/core";
import { ContratosService } from "../../services/contratos.service";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { Chart } from 'angular-highcharts';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  chart

  fechaCita
  fechaCita2
  ingresos= 0
  total=0
  pendientes=0
  terminados=0
  entregados=0
  nuevos=0

  constructor(
    private spinner: NgxSpinnerService,
    private contratosService: ContratosService,
    private router: Router,
    private _api: ApiService
  ) {
    let minDate = new Date(Date.now());
    minDate.setHours(0, 0, 0, 0);
    this.fechaCita = minDate;
    this.fechaCita2 = minDate;
   }

  ngOnInit(): void {
    let user= this._api.getUsuario()
    if (user == null) {
      this.router.navigateByUrl("/");
    }
    else if (user.dataUser.isAdmin == false) {
      this.router.navigateByUrl("/contratos");
    }else {this.getEstadisticas()}
  }

  getEstadisticas() {
    if (this.fechaCita>this.fechaCita2) {
      this.fechaCita2=this.fechaCita
    }
    this.spinner.show();
    this.contratosService.getEstadisticas({ fecha_cita: this.fechaCita, fecha_cita2: this.fechaCita2 }).subscribe(
      data => {
        this.spinner.hide();
        console.log(data)
        if (!data.error) {
          this.ingresos= data.ingresos
          this.total= data.total
          this.pendientes= data.pendientes
          this.terminados= data.terminados
          this.entregados= data.entregados
          this.nuevos= data.nuevos
          this.grafico()
        }
        else{
          this.ingresos= 0
          this.total= 0
          this.pendientes= 0
          this.terminados= 0
          this.entregados= 0
          this.nuevos= 0
          this.grafico()
        }
      },
      err => {
        this.spinner.hide();
        console.log("Ha ocurrido un Error: ", err)
        this.router.navigateByUrl("/login")
      }
    );
  }

  grafico(){
    this.chart = new Chart({
      chart: {
        type: 'pie'
    },
    title: {
        text: `<b>${new Date(this.fechaCita).getFullYear()}/${new Date(this.fechaCita).getMonth()}/${new Date(this.fechaCita).getDate()} -
        ${new Date(this.fechaCita2).getFullYear()}/${new Date(this.fechaCita2).getMonth()}/${new Date(this.fechaCita2).getDate()}. <i>Contratos:</i></b> ${this.total}`
    },
    subtitle: {
        text: 'Formato: Año/Mes/Día'
    },

    accessibility: {
        announceNewData: {
            enabled: true
        },
        point: {
            valueDescriptionFormat: '%'
        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y:.1f}%'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'
    },

    series: [
        {
            type: 'pie',
            name: "Contratos",
            colorByPoint: true,
            data: [
                {
                    name: "Pendientes",
                    y: this.pendientes*100/this.total,
                    color: "orange"
                },
                {
                    name: "Terminados",
                    y: this.terminados*100/this.total,
                    color: "blue"
                },
                {
                    name: "Entregados",
                    y: this.entregados*100/this.total,
                    color: "green"
                }
            ]
        }
    ]
    });
  }

}
