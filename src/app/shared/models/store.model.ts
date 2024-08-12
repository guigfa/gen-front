import { Course } from "./course.model";

export interface Store {
    courses: Course[];
    length: number;
}