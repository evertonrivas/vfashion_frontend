import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnComponent } from './devolution.component';

describe('ReturnComponent', () => {
  let component: ReturnComponent;
  let fixture: ComponentFixture<ReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnComponent]
    });
    fixture = TestBed.createComponent(ReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
