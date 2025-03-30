import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskModalComponent } from './components/new-task/new-task-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StaticDataService } from '../../services/static-data.service';
import { MultiSelectEditorComponent } from './components/multi-select-editor/multi-select-editor.component';
import { Inject, PLATFORM_ID } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { WINDOW } from '../../tokens/window.token';

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
    // pagination: true,
    // paginationPageSize: 50,
    // paginationPageSizeSelector: [10, 25, 50],
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

  private _window = inject(WINDOW);

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // const { AgGridAngular } = await import('ag-grid-angular');
      this.isAgGridLoaded = true;

      console.log(69, isPlatformBrowser(this.platformId), this.isAgGridLoaded);
    }
    // if (this._window) {
    //   console.log(
    //     'Running in browser:'

    //     // this._window.navigator.userAgent
    //   );
    // } else {
    //   console.log('Running in SSR, window is not available.');
    // }
    this.taskService.getTasks().subscribe({
      next: ({ data }) => {
        this.rowData = this.filteredData = data;
        if (data.length) this.colDefs = this.buildColDefs(data[0]);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      },
    });
  }

  loadAgGrid() {
    this.taskService.getTasks().subscribe({});
  }

  buildColDefs(data: any): ColDef[] {
    return [
      ...Object.keys(data).map((key) => {
        if (key === 'developer') {
          return {
            field: key,
            headerName: 'Developer',
            editable: true,
            cellEditor: MultiSelectEditorComponent,
            cellEditorPopup: true,
            cellEditorParams: { values: this.staticData.developers },
          };
        } else if (['priority', 'status', 'type'].includes(key)) {
          return {
            field: key,
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
            headerName: 'Date',
            editable: true,
            cellEditor: 'agDateCellEditor',
            cellEditorParams: { format: 'dd MMM, yyyy' },
          };
        }
        return { field: key, headerName: this.capitalize(key), editable: true };
      }),
      {
        field: 'date',
        headerName: 'Date',
        editable: true,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: { format: 'dd MMM, yyyy' },
      },
    ];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  openNewTaskModal() {
    this.dialog
      .open(NewTaskModalComponent, { width: '700px', height: '60vh' })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        const newData = {
          ...result,
          'Actual SP': result.actualSP,
          'Estimated SP': result.estimatedSP,
          developer: result.developer.join(', '),
        };
        this.rowData.unshift(newData);
        this.filteredData = [...this.rowData];
      });
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

  clearSelection() {}
}
