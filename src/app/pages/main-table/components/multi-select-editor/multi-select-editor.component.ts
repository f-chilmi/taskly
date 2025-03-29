import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-multi-select-editor',
  templateUrl: './multi-select-editor.component.html',
  styleUrl: './multi-select-editor.component.scss',
  imports: [MatCheckboxModule, CommonModule],
})
export class MultiSelectEditorComponent implements ICellEditorAngularComp {
  params: any;
  selectedValues: string[] = [];

  constructor(private eRef: ElementRef) {}

  agInit(params: any): void {
    this.params = params;
    this.selectedValues = params.value ? [...params.value.split(', ')] : [];
  }

  getValue() {
    return this.selectedValues.join(', '); // Return array of selected values
  }

  onSelectionChange(dev: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedValues.push(dev);
    } else {
      this.selectedValues = this.selectedValues.filter((d) => d !== dev);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.params.stopEditing();
    }
  }
}
