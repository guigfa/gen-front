import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CoursesComponent } from "../../../main/pages/courses/courses.component";
import { LessonsComponent } from '../../../main/pages/lessons/lessons.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [MatTabsModule, CoursesComponent, LessonsComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {

}
