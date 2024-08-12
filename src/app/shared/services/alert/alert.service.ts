import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private _alert = inject(MatSnackBar);

    public open(message: string, action: string = 'Close', duration: number = 2000) {
        this._alert.open(message, action, {
            duration
        });
    };
}