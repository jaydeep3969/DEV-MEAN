import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAutomobileBillComponent } from './preview-automobile-bill.component';

describe('PreviewAutomobileBillComponent', () => {
  let component: PreviewAutomobileBillComponent;
  let fixture: ComponentFixture<PreviewAutomobileBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewAutomobileBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAutomobileBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
