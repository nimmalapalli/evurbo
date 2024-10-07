import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-paymentgateway',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatButtonModule,CommonModule,NgIf],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './paymentgateway.component.html',
  styleUrl: './paymentgateway.component.css'
})
export class PaymentgatewayComponent {

  constructor(private paymentService: PaymentService) {}

  initiatePayment() {
    const orderDetails = {
      order_id: 'ORD12345',  // Replace with your dynamic order details
      amount: '5000'
    };

    this.paymentService.initiatePayment(orderDetails).subscribe((response: any) => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction';

      const input1 = document.createElement('input');
      input1.type = 'hidden';
      input1.name = 'encRequest';
      input1.value = response.encRequest;
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'hidden';
      input2.name = 'access_code';
      input2.value = response.accessCode;
      form.appendChild(input2);

      document.body.appendChild(form);
      form.submit();
    });
  }
}
