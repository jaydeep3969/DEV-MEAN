import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewElectronicBillComponent } from './preview-electronic-bill.component';

describe('PreviewElectronicBillComponent', () => {
  let component: PreviewElectronicBillComponent;
  let fixture: ComponentFixture<PreviewElectronicBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewElectronicBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewElectronicBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
