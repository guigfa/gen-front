import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private _dialog: MatDialog) { }

  public open(component: any, data: any, config: MatDialogConfig = {}): Observable<any> {
    const dialogConfig = {
      ...config,
      data
    };
    return this._dialog.open(component, dialogConfig).afterClosed();
  }
}
