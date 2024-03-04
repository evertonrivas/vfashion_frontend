import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelStagesComponent } from './funnel-stages.component';

describe('FunnelStagesComponent', () => {
  let component: FunnelStagesComponent;
  let fixture: ComponentFixture<FunnelStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelStagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FunnelStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
