import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
interface PaymentResponse {
  redirectUrl: string;
}
@Component({
  selector: 'app-paymentgateway',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatButtonModule,CommonModule,NgIf],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './paymentgateway.component.html',
  styleUrl: './paymentgateway.component.css'
})
export class PaymentgatewayComponent {

  constructor(private paymentService: PaymentService,private router:Router) {}
  orderDetails = {
    amount: 1000,
    currency: 'INR',
    // Add other required details here
  };



  initiatePayment() {
    this.paymentService.initiatePayment(this.orderDetails).subscribe(
      (response:any) => {
    console.log(response);
    const externalUrl = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encodeURIComponent(response.encRequest)}&access_code=${encodeURIComponent(response.accessCode)}`;
     console.log(externalUrl)
    // window.location.href = externalUrl;
      }
     
    );
  }

}
