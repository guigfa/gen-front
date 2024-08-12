import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, TitleCasePipe],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  @Input({ required: true }) displayedColumns!: string[];
  @Input({ required: true }) dataSource!: any;
  @Input({ required: true }) type: string = 'course';
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() add = new EventEmitter();

  constructor() {
  }
}
