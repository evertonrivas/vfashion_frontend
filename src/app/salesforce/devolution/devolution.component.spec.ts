import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolutionComponent } from './devolution.component';

describe('ReturnComponent', () => {
  let component: DevolutionComponent;
  let fixture: ComponentFixture<DevolutionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevolutionComponent]
    });
    fixture = TestBed.createComponent(DevolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
