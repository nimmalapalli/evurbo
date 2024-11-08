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
 bookingID=0;
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
      // this.payment();
    }
    this.showConfirmation = false;
  }


  payment() {
    // Check if necessary data exists
    const bookingAmount = this.data?.name?.bookingAmount; // Get the booking amount from the data
    console.log(bookingAmount);
    const orderId = this.data?.name?.orderReferenceID;
    
    // Ensure data is available before proceeding
    if (!bookingAmount || !orderId) {
      alert('Required payment details are missing.');
      return;
    }
    
    // Initiating Razorpay Payment with dynamic booking amount
    this.initiateRazorpayPayment(orderId, bookingAmount, 'INR');
  }
  
  initiateRazorpayPayment(orderId: string, amount: number, currency: string) {
   
  
    const bookingNo = this.data?.name?.bookingNo;
    console.log(amount)
    // Razorpay payment options
    const RazorpayOptions = {
      key: 'rzp_live_Ar5CUQL7iuaNPb', // Use a dynamic value (avoid hardcoding) for production
      amount: amount.toString(), // Razorpay expects amount in paise, so convert it to paise
      currency: currency,
      name: 'Evurbo',
      description: 'Wallet Payment',
      order_id: orderId,
      handler: (response: any) => {
        console.log(response)
        this.verifyPayment(bookingNo, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
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
    
    // Open the Razorpay modal for payment
    rzp1.open();
    
    // Handle any errors that may occur
    rzp1.on('payment.failed', (response: any) => {
      alert('Payment Failed: ' + response.error.description);
    });
  }
  
  
  verifyPayment(bookingID: number, orderReferenceID: string, paymentID: string, signature: string) {
  
  
    // Call the payment service to verify the payment
    this.paymentService.verifyPayment(bookingID, orderReferenceID, paymentID, signature).subscribe((verificationResponse: any) => {
      console.log(verificationResponse)
      alert(verificationResponse.name)
    }, (error) => {
      // Handle the error case
      alert('Error during payment verification: ' + error.message);
    });
  }
  
}
