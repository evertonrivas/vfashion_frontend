import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProductsComponent } from './import-products.component';

describe('ImportProductsComponent', () => {
  let component: ImportProductsComponent;
  let fixture: ComponentFixture<ImportProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
