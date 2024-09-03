import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManagerComponent } from './report-manager.component';

describe('ReportManagerComponent', () => {
  let component: ReportManagerComponent;
  let fixture: ComponentFixture<ReportManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
