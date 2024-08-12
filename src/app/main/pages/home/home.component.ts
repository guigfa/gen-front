import { Component } from '@angular/core';
import { TabsComponent } from '../../../shared/components/tabs/tabs.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TabsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
