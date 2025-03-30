import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { format } from 'date-fns';
import { StaticDataService } from '../../services/static-data.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-filters',
  templateUrl: './task-filters.component.html',
  styleUrls: ['./task-filters.component.scss'],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
})
export class TaskFiltersComponent {
  @Input() searchTerm = '';
  @Output() searchTermChange = new EventEmitter<string>();

  @Input() selectedDevelopers: { [key: string]: boolean } = {};
  @Output() selectedDevelopersChange = new EventEmitter<{
    [key: string]: boolean;
  }>();

  @Input() developers: string[] = [];

  constructor(
    private dialog: MatDialog,
    private staticData: StaticDataService,
    private taskService: TaskService
  ) {}

  filterTasks() {
    this.searchTermChange.emit(this.searchTerm);
  }

  applyFilterDevelopers() {
    this.selectedDevelopersChange.emit(this.selectedDevelopers);
  }

  getSelectedDevelopersCount(): number {
    return Object.values(this.selectedDevelopers).filter((v) => v).length;
  }

  openNewTaskModal() {
    this.dialog
      .open(TaskModalComponent, {
        width: '700px',
        height: '60vh',
        data: {
          developers: this.staticData.developers,
          priorityOptions: this.staticData.priorityOptions,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        const newData = {
          ...result,
          'Actual SP': result.actualSP,
          'Estimated SP': result.estimatedSP,
          developer: result.developer.join(', '),
          date: format(new Date(result.date), 'dd MMM, yyy'),
        };
        this.taskService.addTask(newData);
      });
  }
}
