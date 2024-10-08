import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { FormComponent } from '../../../shared/components/form/form.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { Course } from '../../../shared/models/course.model';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { CoursesService } from './services/courses.service';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DeleteComponent } from '../../../shared/components/dialog/delete/delete.component';
import { CreateComponent } from '../../../shared/components/dialog/create/create.component';
import { LessonsService } from '../lessons/services/lessons.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, FormComponent, MatButtonModule, RouterLink, MatIconModule, GridComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit, OnDestroy {
  protected displayedColumns = ['name', 'description', 'actions'];
  private _coursesService = inject(CoursesService);
  private _lessonsService = inject(LessonsService);
  private _dialog = inject(DialogService);
  private _alert = inject(AlertService);
  protected courses!: Course[];
  protected form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    active: new FormControl(true),
  })
  private _subscription!: Subscription;


  ngOnInit() {
    this._subscription = this._getCourses().subscribe(courses => this.courses = courses);
  }

  private _getCourses(): Observable<Course[]> {
    return this._coursesService.getCourses().pipe(map(course => {
      course.data = course.data.map((course: Course) => {
        course.lessons = course.lessons.filter(lesson => lesson.active);
        return course;
      });
      return course.data;
    }));
  }

  create(course: Course) {
    this._subscription = this._coursesService.createCourse(course)
      .pipe(
        catchError(error => {
          this._alert.open('An error occurred while creating the course');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this._getCourses().subscribe(courses => this.courses = courses);
          this._alert.open('Course created successfully');
          this.form.patchValue({
            name: '',
            description: '',
            active: true
          });
        }
      })
  }

  update(course: Course) {
    this._subscription = this._coursesService.updateCourse(course)
      .pipe(
        catchError(error => {
          this._alert.open('An error occurred while updating the course');
          return of(error.message);
        })
      )
      .subscribe(response => {
        if (response.data === 200) {
          this._alert.open('Course updated successfully');
          this.form.reset();
        }
      })
  }

  protected deleteCourse(course: Course) {
    const dialogRef = this._dialog.open(DeleteComponent, {});
  
    this._subscription = dialogRef.pipe( 
      switchMap(confirmed => {
        if (!confirmed) {
          return EMPTY;
        }
        return this._coursesService.deleteCourse(course.id).pipe(
          switchMap(() => this._getCourses())
        );
      })
    ).subscribe(courses => {
      if (courses) {
        this.courses = courses;
        this._alert.open('Course deleted successfully');
      }
    });
  }

  addLessons(course: Course) {
    this._subscription = this._dialog.open(DialogComponent, { course })
      .pipe(
        switchMap(() => this._getCourses()),
        catchError(err => {
          this._alert.open('An error occurred while adding lessons to the course');
          return of([]);
        }
      ))
      .subscribe(courses => {
        this._lessonsService.setSubject(true);
        this.courses = courses;
      });
  }

  editCourse(course: Course) {
    this.form.patchValue(course);
    this._subscription = this._dialog.open(CreateComponent, {
      form: this.form,
      title: 'Edit Course'
    }).subscribe(response => {
      if (!response) return;
      response = {
        ...response,
        id: course.id
      };
      this._subscription = this._coursesService.updateCourse(response).pipe(
        catchError(err => {
          this._alert.open(err.error.message || 'An error occurred while updating the course');
          return of(null);
        })
      ).subscribe(res => {
        if (res) {
          this._alert.open(res.message);
          this._getCourses().subscribe(courses => this.courses = courses);
        }
      })
    })
  }

  openCreateModal() {
    this._subscription = this._dialog.open(CreateComponent, {
      form: this.form,
      title: 'Create Course'
    }).pipe(  
      switchMap(response => {
        if (!response) {
          return EMPTY;
        }
        return this._coursesService.createCourse(response).pipe(
          catchError(err => {
            this._alert.open(err.error.message || 'An error occurred while creating the course');
            return of(null); 
          })
        );
      }),
      switchMap(res => {
        if (res) {
          this._alert.open(res.message);
          return this._getCourses(); 
        }
        return EMPTY; 
      })
    ).subscribe(courses => {
      if (courses) {
        this.courses = courses;
      }
    });
  }

  clean() {
    this.form.reset();
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
