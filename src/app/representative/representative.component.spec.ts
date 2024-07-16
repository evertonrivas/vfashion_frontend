import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativeComponent } from './representative.component';

describe('RepresentativeComponent', () => {
  let component: RepresentativeComponent;
  let fixture: ComponentFixture<RepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepresentativeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
