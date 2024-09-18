import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QalistComponent } from './qalist.component';

describe('QalistComponent', () => {
  let component: QalistComponent;
  let fixture: ComponentFixture<QalistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QalistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
