import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-taskly',
  imports: [RouterOutlet, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedIndex = event.url.includes('/kanban') ? 1 : 0;
      }
    });
  }

  title = 'taskly';
  selectedIndex = 0;

  theme: 'light' | 'dark' = 'dark';

  onTabChange(event: any) {
    const routes = ['/tasks', '/kanban'];
    this.router.navigate([routes[event.index]]);
  }
}
