import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEntitiesComponent } from './import-entities.component';

describe('ImportEntitiesComponent', () => {
  let component: ImportEntitiesComponent;
  let fixture: ComponentFixture<ImportEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportEntitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
