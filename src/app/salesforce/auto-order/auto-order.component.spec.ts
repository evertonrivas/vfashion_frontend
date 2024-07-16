import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoOrderComponent } from './auto-order.component';

describe('AutoOrderComponent', () => {
  let component: AutoOrderComponent;
  let fixture: ComponentFixture<AutoOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoOrderComponent]
    });
    fixture = TestBed.createComponent(AutoOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
