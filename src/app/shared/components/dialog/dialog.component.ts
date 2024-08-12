import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models/course.model';
import { GridComponent } from '../grid/grid.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonsService } from '../../../main/pages/lessons/services/lessons.service';
import { FormComponent } from '../form/form.component';
import { Lesson } from '../../models/lesson.model';
import { AlertService } from '../../services/alert/alert.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [GridComponent, MatButtonModule, MatIcon, ReactiveFormsModule, FormComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  private _service = inject(LessonsService);
  private _alert = inject(AlertService);
  protected course!: Course;
  private _loading = false;
  protected displayedColumns = ['title', 'content', 'actions'];
  private _isEditing = false;
  protected add = false;
  protected form = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    level: new FormControl('', Validators.required),
    active: new FormControl(true),
    courseId: new FormControl(''),
    id: new FormControl('')
  })

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.course = data.course;
    this.form.patchValue({ courseId: this.course.id });
  }

  protected addLesson() {
    if(this._loading) return;
    this._loading = true;
    const action$ = this._isEditing 
      ? this._service.updateLesson({...this.form.value} as Lesson) 
      : this._service.createLesson(this.form.value as Lesson);

    action$
    .pipe(
      finalize(() => {
        this._disableFlags();
      })
    )
    .subscribe(response => {
        if(response) {
          this._alert.open(response.message);
        };
      });
  }

  private _disableFlags() {
    this._isEditing = false;
    this._loading = false;
    this.add = false;
  }

  protected deleteLesson(lesson: Lesson) {
    this._service.deleteLesson(lesson.id)
    .pipe(
      catchError(err => {
        this._alert.open(err.error.message);
        return of(null);
      }),
    )
    .subscribe(res => {
      if(res) {
        this._alert.open(res.message);
      }
    });
  }

  protected editLesson(lesson: Lesson) {
    this._isEditing = true;
    this.add = true;
    this.form.patchValue({
      title: lesson.title,
      content: lesson.content,
      level: lesson.level,
      active: true,
      id: lesson.id
    });
  }
}
