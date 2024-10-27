import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PaymentgatewayComponent } from '../paymentgateway/paymentgateway.component';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../services/paymentservice/payment.service';

declare var Razorpay: any;
@Component({
  selector: 'app-bookingdialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule,PaymentgatewayComponent,MatButtonModule,ReactiveFormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bookingdialog.component.html',
  styleUrl: './bookingdialog.component.css'
})
export class BookingdialogComponent {
  readonly dialogRef = inject(MatDialogRef<BookingdialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  paymentid:any;

  paymentform!: FormGroup;
  showConfirmation: boolean = false;

  constructor(private _pf: FormBuilder, private paymentService: PaymentService) {
 
    console.log(this.data)
  }

  confirmPayment() {
    this.showConfirmation = true;
  }

  onConfirm(answer: boolean) {
    if (answer) {
      this.payment();
    }
    this.showConfirmation = false;
  }

  payment() {
    const bookingAmount = this.data.name.bookingAmount; // Get booking amount from data
    const amountInPaise = bookingAmount ; // Convert to paise
  
    this.paymentService.createOrder({ amount: amountInPaise }).subscribe((res: any) => {
      if (res && res.id && res.amount && res.currency) {
        this.initiateRazorpayPayment(res.id, amountInPaise, res.currency);
      } else {
        console.error('Invalid response from createOrder:', res);
      }
    }, (error) => {
      console.error('Error creating order:', error);
    });
  }
  initiateRazorpayPayment(orderId: string, amount: number, currency: string) {
   
    const RazorpayOptions = {
      key: 'rzp_test_7xBELXxLBhucXw',
      amount: amount,
      currency: currency,
      name: 'Evurbo',
      description: 'Wallet Payment',
      order_id: orderId,
      handler: (response:any) => {
        this.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
      },
      prefill: {
        name: 'Rajkiran',
        email: 'Connect@evurbo.com',
        contact: '8179567666'
      },
      theme: {
        color: '#F37254'
      }
    };

    const rzp1 = new Razorpay(RazorpayOptions);
    rzp1.open();
 
 
  }
  verifyPayment(orderId: string, paymentId: string, signature: string) {
    this.paymentService.verifyPayment(orderId, paymentId, signature).subscribe((verificationResponse: any) => {
      if (verificationResponse.success) {
        alert('Payment Successful!');
      } else {
        alert('Payment Verification Failed!');
      }
    });
  }
}
