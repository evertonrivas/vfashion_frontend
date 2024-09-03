import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepComissionComponent } from './rep-comission.component';

describe('RepComissionComponent', () => {
  let component: RepComissionComponent;
  let fixture: ComponentFixture<RepComissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepComissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepComissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
