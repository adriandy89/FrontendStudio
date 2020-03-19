import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean;
  isLogued: boolean;

  constructor(
    public _api: ApiService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("ACCESS_TOKEN")) {
      this.isLogued = true;
    }
    if (localStorage.getItem("IS_ADMIN")) {
      this.isAdmin = true;
    }
  }

  logout(): void {
    this.dialogService
      .openConfirmDialog("Cerrar Sesión?")
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this._api.logout();
          this.router.navigateByUrl("/login");
        }
      });
  }
}
