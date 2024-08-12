import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { AjaxResponse } from '../../../../shared/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private _http = inject(HttpClient);
  private readonly _baseUrl = environment.url;

  public getCourses(): Observable<AjaxResponse> {
    const query = {
      active: true,
    }
    return this._http.get<AjaxResponse>(`${this._baseUrl}/courses`, { params: query });
  }

  public getCourseById(id: string): Observable<Course> {
    return this._http.get<Course>(`${this._baseUrl}/courses/${id}`);
  }

  public createCourse(course: Course): Observable<AjaxResponse> {
    return this._http.post<AjaxResponse>(`${this._baseUrl}/courses`, course);
  }

  public updateCourse(course: Partial<Course>): Observable<AjaxResponse> {
    return this._http.put<AjaxResponse>(`${this._baseUrl}/courses/${course.id}`, course);
  }

  public deleteCourse(id: string): Observable<AjaxResponse> {
    return this._http.delete<AjaxResponse>(`${this._baseUrl}/courses/${id}`);
  }
}
