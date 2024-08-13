import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { catchError, filter, finalize, Observable, of, Subscription, switchMap } from 'rxjs';
import { CreateComponent } from '../../../shared/components/dialog/create/create.component';
import { DeleteComponent } from '../../../shared/components/dialog/delete/delete.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { Lesson } from '../../../shared/models/lesson.model';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { LessonsService } from './services/lessons.service';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [AsyncPipe, GridComponent, MatIconModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatSelectModule, TitleCasePipe],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnInit, OnDestroy {
  protected displayedColumns = ['title', 'content', 'level', 'actions'];
  protected form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    level: new FormControl(''),
    active: new FormControl(true),
    courseId: new FormControl(''),
    id: new FormControl()
  });
  protected filterForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    level: new FormControl(''),
  });
  protected levelOptions = ['beginner', 'intermediate', 'advanced'];
  private _dialog = inject(DialogService);
  private _service = inject(LessonsService);
  private _alert = inject(AlertService);
  private _route = inject(ActivatedRoute);
  protected lessons!: Lesson[];
  private _subscription!: Subscription;
  protected courseId!: string;
  protected filtering = false;

  ngOnInit() {
    this.courseId = this._route.snapshot.params['id'];
    this._subscription = this._service.subject$.pipe(
      filter(response => !!response),  
      switchMap(() => this._getLessons()),
      finalize(() => this._service.setSubject(false))  
    ).subscribe(lessons => {
      this.lessons = lessons;
    });
  }

  private _getLessons(query?: Partial<Lesson>): Observable<Lesson[]> {
    return this._service.getLessons(query);
  }

  protected deleteLesson(lesson: Lesson): void {
    const dialogRef = this._dialog.open(DeleteComponent, {});
  
    this._subscription = dialogRef.pipe(
      switchMap(confirmed => {
        if (confirmed) {
          return this._service.deleteLesson(lesson.id).pipe(
            switchMap(() => this._getLessons())
          );
        }
        return of(null); 
      })
    ).subscribe(lessons => {
      if (lessons) {
        this.lessons = lessons;
        this._alert.open('Lesson deleted successfully');
      }
    });
  }
  

  editLesson(lesson: Lesson): void {
    this.form.patchValue(lesson);
  
    this._subscription = this._dialog.open(CreateComponent, {
      form: this.form,
      title: 'Edit Lesson',
    }).pipe(
      switchMap((updatedLesson: Lesson) => {
        if(!updatedLesson) {
          return of(null);
        }
        return this._service.updateLesson(updatedLesson).pipe(
          catchError(error => {
            this._alert.open('Failed to update lesson');
            return of(null); 
          })
        )
    }),
      catchError(error => {
        this._alert.open('Failed to open dialog');
        return of(null); 
      })
    ).subscribe(response => {
      if(response) {
        this._alert.open('Lesson updated successfully');
        this._subscription = this._getLessons().subscribe(lessons => this.lessons = lessons);
        this.form.reset();
      }
    });
  }

  protected filter() {
    this._subscription = this._getLessons({...this.filterForm.value as any}).subscribe(lessons => {
      if(!lessons.length) {
        this._alert.open('No lessons found');
        return;
      }
      this.filtering = true;
      this.lessons = lessons;
    });
  }

  protected clearFilter() {
    this.filterForm.reset();
    this.filtering = false;
    this._subscription = this._getLessons().subscribe(lessons => this.lessons = lessons);
  }

  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }
}
