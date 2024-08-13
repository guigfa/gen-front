import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Lesson } from '../../../../shared/models/lesson.model';
import { AjaxResponse } from '../../../../shared/models/response.model';
import { ObjectHelper } from '../../../../shared/utils/object-helper';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private _http = inject(HttpClient);
  private readonly _baseUrl = environment.url;
  private subject = new BehaviorSubject<boolean>(true);
  public subject$ = this.subject.asObservable();

  public setSubject(value: boolean) {
    this.subject.next(value);
  };

  public getLessons(query?: Partial<any>): Observable<Lesson[]> {
    query = { ...query, active: true };
    query = ObjectHelper.removeEmptyKeys(query);

    let params = new HttpParams();
    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params = params.append(key, value.toString());
            }
        });
    }

    return this._http.get<Lesson[]>(`${this._baseUrl}/lessons`, { params });
}

  public getLessonById(id: string): Observable<Lesson> {
    return this._http.get<Lesson>(`${this._baseUrl}/lessons/${id}`);
  }

  public createLesson(lesson: Partial<Lesson>): Observable<AjaxResponse> {
    lesson = ObjectHelper.removeEmptyKeys(lesson);

    return this._http.post<AjaxResponse>(`${this._baseUrl}/lessons`, lesson);
  }

  public updateLesson(lesson: Partial<Lesson>): Observable<AjaxResponse> {
    lesson = ObjectHelper.removeEmptyKeys(lesson);
    const id = lesson.id;
    delete lesson.courseId;
    delete lesson.id;
    return this._http.put<AjaxResponse>(`${this._baseUrl}/lessons/${id}`, lesson);
  }

  public deleteLesson(id: string): Observable<AjaxResponse> {
    return this._http.delete<AjaxResponse>(`${this._baseUrl}/lessons/${id}`);
  }
}
