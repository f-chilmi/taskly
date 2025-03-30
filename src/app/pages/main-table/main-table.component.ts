import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TaskService } from '../../services/task.service';
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StaticDataService } from '../../services/static-data.service';
import { MultiSelectEditorComponent } from './components/multi-select-editor/multi-select-editor.component';
import { Inject, PLATFORM_ID } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { format } from 'date-fns';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskFiltersComponent } from '../../shared/task-filters/task-filters.component';
import { Observable } from 'rxjs';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-main-table',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    AgGridAngular,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    TaskFiltersComponent,
  ],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss',
})
export class MainTableComponent {
  isAgGridLoaded = false;
  gridApi!: GridApi;
  rowData: any[] = [];
  filteredData: any[] = [];
  colDefs: ColDef[] = [];
  isLoading = true;
  searchTerm = '';
  selectedDevelopers: Record<string, boolean> = {};
  selectAllDevelopers = false;

  gridOptions = {
    pagination: false,
    rowModelType: 'clientSide' as any,
    domLayout: 'autoHeight' as any,
    rowSelection: {
      mode: 'multiRow' as any,
    },
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private taskService: TaskService,
    private dialog: MatDialog,
    public staticData: StaticDataService
  ) {}

  tasks$!: Observable<any[]>;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isAgGridLoaded = true;
    }

    this.tasks$ = this.taskService.tasks$;

    this.tasks$.subscribe((data: any[]) => {
      this.rowData = this.filteredData = data;
      if (data.length) {
        this.colDefs = this.buildColDefs(data[0]);
      }
      this.isLoading = false;
    });

    this.taskService.getTasks().subscribe();
  }
  buildColDefs(data: any): ColDef[] {
    return [
      ...Object.keys(data).map((key) => {
        if (key === 'title') {
          return {
            field: key,
            headerName: 'Title',
            editable: true,
            minWidth: 250,
            flex: 3,
          };
        } else if (key === 'developer') {
          return {
            field: key,
            flex: 1,
            headerName: 'Developer',
            editable: true,
            cellRenderer: (params: any) => {
              if (!params.value) return '';

              return `<div class="flex items-center gap-2 justify-center">${params.value
                .split(', ')
                .map((assignee: any) => {
                  const initials = assignee[0].toUpperCase();
                  return `
                    <div matTooltip=${assignee[0]} class="assignee-avatar rounded-full w-[30px] h-[30px] flex items-center justify-center bg-[purple] text-white" title="${assignee[0]}" data-name="${assignee[0]}">
                      ${initials}
                    </div>
                  `;
                })}</div>`;
            },

            cellEditor: MultiSelectEditorComponent,
            cellEditorPopup: true,
            cellEditorParams: { values: this.staticData.developers },
          };
        } else if (['priority', 'status', 'type'].includes(key)) {
          return {
            field: key,
            flex: 1,
            headerName: this.capitalize(key),
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
              values: (this.staticData as any)[key + 'Options'] || [],
            },
            cellStyle: ({ value }: { value: any }) => ({
              backgroundColor:
                (this.staticData as any)[key + 'Colors']?.[value] ||
                'transparent',
              color: '#ffffff',
            }),
          };
        } else if (key === 'date') {
          return {
            field: key,
            flex: 1,
            headerName: 'Date',
            editable: true,
            cellEditor: 'agDateCellEditor',
            cellEditorParams: { format: 'dd MMM, yyyy' },
            valueGetter: (p: any) =>
              format(new Date(p.data[key]), 'dd MMM, yyy'),
          };
        } else if (key.includes('SP')) {
          return {
            field: key,
            flex: 1,
            headerName: this.capitalize(key),
            editable: true,
            valueGetter: (p: any) => p.data[key] + ' SP',
          };
        }
        return { field: key, headerName: this.capitalize(key), editable: true };
      }),
      {
        field: 'date',
        flex: 1,
        headerName: 'Date',
        editable: true,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: { format: 'dd MMM, yyyy' },
        valueGetter: (p: any) =>
          p.data.date ? format(new Date(p.data.date), 'dd MMM, yyy') : '',
      },
    ];
  }

  filterByAssignee(name: string) {
    this.filteredData = this.rowData.filter((item: any) =>
      item.assignees?.some((a: any) => a.name === name)
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  filterTasks() {
    this.filteredData = this.searchTerm
      ? this.rowData.filter((task) =>
          task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : this.rowData;
  }

  filterByDeveloper(dev: string) {
    this.selectedDevelopers[dev] = !this.selectedDevelopers[dev];
    this.applyFilterDevelopers();
  }

  toggleAllSelection() {
    this.selectAllDevelopers = !this.selectAllDevelopers;
    this.staticData.developers.forEach(
      (dev) => (this.selectedDevelopers[dev] = this.selectAllDevelopers)
    );
    this.applyFilterDevelopers();
  }

  applyFilterDevelopers() {
    const selectedDevs = Object.keys(this.selectedDevelopers).filter(
      (dev) => this.selectedDevelopers[dev]
    );
    this.filteredData = selectedDevs.length
      ? this.rowData.filter((task) =>
          selectedDevs.some((dev) => task.developer.includes(dev))
        )
      : this.rowData;
  }

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getSelectedDevelopersCount(): number {
    return Object.values(this.selectedDevelopers).filter((value) => value)
      .length;
  }

  clearSelection() {
    this.selectedDevelopers = {};
    this.filteredData = this.rowData;
  }
}
