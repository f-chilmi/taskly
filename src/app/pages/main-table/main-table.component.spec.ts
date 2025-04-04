import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTableComponent } from './main-table.component';

describe('MainTableComponent', () => {
  let component: MainTableComponent;
  let fixture: ComponentFixture<MainTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
