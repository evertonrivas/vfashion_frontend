import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlimvComponent } from './flimv.component';

describe('FlimvComponent', () => {
  let component: FlimvComponent;
  let fixture: ComponentFixture<FlimvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlimvComponent]
    });
    fixture = TestBed.createComponent(FlimvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
