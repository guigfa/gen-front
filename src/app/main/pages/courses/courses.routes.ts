import { Routes } from "@angular/router";
import { CoursesComponent } from "./courses.component";
import { LessonsComponent } from "../lessons/lessons.component";

export const COURSES_ROUTES: Routes = [
    {
        path: '',
        component: CoursesComponent
    },
    {
        path: ':id',
        component: LessonsComponent
    }
]