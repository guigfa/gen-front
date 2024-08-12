import { Lesson } from "./lesson.model";

export interface Course {
    id: string;
    name: string;
    description: string;
    lessons: Lesson[];
    level: string;
}