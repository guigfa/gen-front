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
import { catchError, EMPTY, finalize, of, Subscription, switchMap } from 'rxjs';
import { CoursesService } from '../../../main/pages/courses/services/courses.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [GridComponent, MatButtonModule, MatIcon, ReactiveFormsModule, FormComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  private _lessonService = inject(LessonsService);
  private _courseService = inject(CoursesService);
  private _alert = inject(AlertService);
  protected course!: Course;
  private _subscription!: Subscription;
  private _loading = false;
  protected displayedColumns = ['title', 'content', 'actions'];
  protected _isEditing = false;
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
    if (this._loading) return;
    this._loading = true;
  
    const action$ = this._isEditing
      ? this._lessonService.updateLesson({ ...this.form.value } as Lesson)
      : this._lessonService.createLesson(this.form.value as Lesson);
  
    this._subscription = action$.pipe(
      switchMap(response => {
        if (response) {
          this._alert.open(response.message);
          return this._courseService.getCourseById(this.course.id);
        }
        return EMPTY; 
      }),
      finalize(() => {
        this._disableFlags(); 
      })
    ).subscribe(({ data }) => {
      if (data) {
        data.lessons = data.lessons.filter((lesson: Lesson) => lesson.active);
        this.course.lessons = data.lessons;
      }
    });
  }
  
  private _disableFlags() {
    this._isEditing = false;
    this._loading = false;
    this.add = false;
  }

  protected deleteLesson(lesson: Lesson) {
    this._subscription = this._lessonService.deleteLesson(lesson.id)
    .pipe(
      catchError(err => {
        this._alert.open(err.error.message);
        return of(null);
      }),
    )
    .subscribe(res => {
      if(res) {
        this.course.lessons = this.course.lessons.filter(l => l.id !== lesson.id);
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

  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }
}
