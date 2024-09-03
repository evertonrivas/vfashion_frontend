import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentComponet } from './moment.component';

describe('MomentComponet', () => {
  let component: MomentComponet;
  let fixture: ComponentFixture<MomentComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MomentComponet]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MomentComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
