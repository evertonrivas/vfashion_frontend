import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesforceComponent } from './salesforce.component';

describe('SalesforceComponent', () => {
  let component: SalesforceComponent;
  let fixture: ComponentFixture<SalesforceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesforceComponent]
    });
    fixture = TestBed.createComponent(SalesforceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
