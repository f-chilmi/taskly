import { Component, computed, signal } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { StaticDataService } from '../../services/static-data.service';
import { TaskService } from '../../services/task.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { TaskFiltersComponent } from '../../shared/task-filters/task-filters.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatTooltipModule,
    TaskFiltersComponent,
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  constructor(
    public staticData: StaticDataService,
    private taskService: TaskService
  ) {}

  searchTerm = '';
  selectedDevelopers: Record<string, boolean> = {};
  selectAllDevelopers = false;

  tasks = signal<{ [key: string]: any[] }>({});
  originalTasks = signal<{ [key: string]: any[] }>({});

  tasksData$!: Observable<any[]>;

  ngOnInit() {
    this.tasksData$ = this.taskService.tasks$;

    this.tasksData$.subscribe((data: any[]) => {
      const groupedTasks = this.groupTasksByStatus(data);
      this.tasks.set(groupedTasks);
      this.originalTasks.set(groupedTasks);
    });

    this.taskService.getTasks().subscribe();
  }

  private groupTasksByStatus(tasks: any[]): { [key: string]: any[] } {
    return tasks.reduce((acc, task) => {
      const status = task.status || 'Unknown';
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {} as { [key: string]: any[] });
  }

  onDrop(event: CdkDragDrop<any[]>, newStatus: string) {
    const tasksValue = { ...this.tasks() };

    if (event.previousContainer === event.container) {
      moveItemInArray(
        tasksValue[event.container.id],
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = {
        ...tasksValue[event.previousContainer.id][event.previousIndex],
        status: newStatus,
      };

      transferArrayItem(
        tasksValue[event.previousContainer.id],
        tasksValue[event.container.id],
        event.previousIndex,
        event.currentIndex
      );

      this.taskService.updateTask(task);
    }

    this.tasks.set(tasksValue); // Perbarui signal dengan nilai yang dimodifikasi
  }

  getStatusColor(status: string): string {
    return this.staticData.statusColors?.[status] || 'transparent';
  }

  getDevelopers(devs: string): string[] {
    return devs.split(',').map((dev) => dev.trim());
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  filteredTasks = computed(() => {
    let tasks = Object.values(this.tasks()).flat();

    if (this.searchTerm) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const selectedDevs = Object.keys(this.selectedDevelopers).filter(
      (dev) => this.selectedDevelopers[dev]
    );

    if (selectedDevs.length > 0) {
      tasks = tasks.filter((task) =>
        selectedDevs.some((dev) => task.developer.includes(dev))
      );
    }

    return this.groupTasksByStatus(tasks);
  });

  filterTasks() {
    let tasksToFilter = Object.values(this.originalTasks()).flat(); // Gunakan data asli

    if (this.searchTerm) {
      tasksToFilter = tasksToFilter.filter((task) =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const selectedDevs = Object.keys(this.selectedDevelopers).filter(
      (dev) => this.selectedDevelopers[dev]
    );

    if (selectedDevs.length > 0) {
      tasksToFilter = tasksToFilter.filter((task) =>
        selectedDevs.some((dev) => task.developer.includes(dev))
      );
    }

    const groupedTasks = this.groupTasksByStatus(tasksToFilter);
    this.tasks.set(groupedTasks);
  }
  filterByDeveloper(dev: string) {
    this.selectedDevelopers[dev] = !this.selectedDevelopers[dev];
    this.filterTasks();
  }

  toggleAllSelection() {
    this.selectAllDevelopers = !this.selectAllDevelopers;
    this.staticData.developers.forEach(
      (dev) => (this.selectedDevelopers[dev] = this.selectAllDevelopers)
    );
    this.filterTasks();
  }

  applyFilterDevelopers() {
    this.filterTasks();
  }
}
