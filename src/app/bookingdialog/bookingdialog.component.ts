import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PaymentgatewayComponent } from '../paymentgateway/paymentgateway.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bookingdialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule,PaymentgatewayComponent,MatButtonModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './bookingdialog.component.html',
  styleUrl: './bookingdialog.component.css'
})
export class BookingdialogComponent {
  readonly dialogRef = inject(MatDialogRef<BookingdialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  constructor(){
    console.log(this.data)
  }

  showConfirmation: boolean = false;

  // Trigger when "Pay Now" button is clicked
  confirmPayment(): void {
    this.showConfirmation = true;
  }

  // Handle Yes or No confirmation
  onConfirm(answer: boolean): void {
    if (answer) {
      console.log('Payment Confirmed');
      // Here you can call the payment API or redirect
    } else {
      console.log('Payment Cancelled');
    }
    this.showConfirmation = false;  // Reset the confirmation dialog
  }
}
