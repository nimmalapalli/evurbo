import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentgatewayComponent } from './paymentgateway.component';

describe('PaymentgatewayComponent', () => {
  let component: PaymentgatewayComponent;
  let fixture: ComponentFixture<PaymentgatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentgatewayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentgatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
