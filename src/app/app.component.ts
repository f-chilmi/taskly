import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-taskly',
  imports: [RouterOutlet, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private router: Router) {}

  title = 'taskly';

  theme: 'light' | 'dark' = 'dark';

  onTabChange(event: any) {
    const routes = ['/tasks', '/kanban'];
    this.router.navigate([routes[event.index]]);
  }
}
