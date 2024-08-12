import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe, NgIf, TitleCasePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatIconModule, TitleCasePipe, NgIf, MatButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Output() submit = new EventEmitter();
  protected controls!: string[];
  protected levelOptions = ['beginner', 'intermediate', 'advanced'];

  ngOnInit(): void {
    this.controls = Object.keys(this.form.controls);
  }

  clean() {
    this.form.reset();
    this.form.get('active')?.setValue(true);
  }

  create() {
    if(this.form.invalid) return;
    this.submit.emit({...this.form.value});
    this.clean();
  }

 
}
