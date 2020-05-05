import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewClothBillComponent } from './preview-cloth-bill.component';

describe('PreviewClothBillComponent', () => {
  let component: PreviewClothBillComponent;
  let fixture: ComponentFixture<PreviewClothBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewClothBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewClothBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
