import { Routes } from '@angular/router';
import { MainTableComponent } from './pages/main-table/main-table.component';
import { KanbanComponent } from './pages/kanban/kanban.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: MainTableComponent },
  { path: 'kanban', component: KanbanComponent },
];
