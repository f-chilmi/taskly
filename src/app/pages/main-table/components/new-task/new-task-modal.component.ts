import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MatNativeDateModule,
  NativeDateAdapter,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaticDataService } from '../../../../services/static-data.service';
import { CommonModule } from '@angular/common';

import { MAT_DATE_FORMATS } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS = {
  parse: { dateInput: 'dd MMM, yyyy' },
  display: {
    dateInput: 'dd MMM, yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'DD MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    provideNativeDateAdapter(),
  ],
})
export class NewTaskModalComponent {
  newTaskForm = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    developer: new FormControl<string[] | null>([], Validators.required),
    priority: new FormControl<string | null>(null, Validators.required),
    status: new FormControl<string | null>(null, Validators.required),
    type: new FormControl<string | null>(null, Validators.required),
    date: new FormControl<Date | null>(null, Validators.required),
    estimatedSP: new FormControl<number | null>(null, Validators.required),
    actualSP: new FormControl<number | null>(null, Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<NewTaskModalComponent>,
    public staticData: StaticDataService
  ) {}

  save() {
    if (this.newTaskForm.valid) {
      console.log(65, this.newTaskForm.value);
      this.dialogRef.close(this.newTaskForm.value);
    }
  }
}
