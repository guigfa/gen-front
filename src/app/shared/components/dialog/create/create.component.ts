import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormComponent } from '../../form/form.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  protected form!: FormGroup;
  protected title!: string;
  private _loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CreateComponent>) {
    this.form = data.form;
    this.title = data.title;
  }

  protected create(form: FormGroup) {
    if(this._loading) return;
    this._loading = true;
    this.dialogRef.close({ ...form });
  }
}
