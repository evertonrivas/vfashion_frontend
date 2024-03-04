import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePricesComponent } from './table-prices.component';

describe('TablePricesComponent', () => {
  let component: TablePricesComponent;
  let fixture: ComponentFixture<TablePricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePricesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablePricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
