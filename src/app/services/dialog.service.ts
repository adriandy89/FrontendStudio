import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg){
    return this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '360px',
      minWidth: '260px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data:{
        message: msg
      }
    });
  }
}
