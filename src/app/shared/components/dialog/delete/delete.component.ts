import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  constructor(public dialogRef: MatDialogRef<DeleteComponent>){}

  protected close(action?: boolean) {
    this.dialogRef.close(action);
  }
}
