import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEmailComponent } from './customer-email.component';

describe('CustomerEmailComponent', () => {
  let component: CustomerEmailComponent;
  let fixture: ComponentFixture<CustomerEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerEmailComponent]
    });
    fixture = TestBed.createComponent(CustomerEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
