import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelsComponent } from './funnels.component';

describe('FunnelsComponent', () => {
  let component: FunnelsComponent;
  let fixture: ComponentFixture<FunnelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FunnelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
