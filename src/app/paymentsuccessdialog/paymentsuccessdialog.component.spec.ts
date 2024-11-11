import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsuccessdialogComponent } from './paymentsuccessdialog.component';

describe('PaymentsuccessdialogComponent', () => {
  let component: PaymentsuccessdialogComponent;
  let fixture: ComponentFixture<PaymentsuccessdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsuccessdialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsuccessdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
