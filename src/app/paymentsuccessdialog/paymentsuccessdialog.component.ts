import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-paymentsuccessdialog',
  standalone: true,
  imports: [PaymentsuccessdialogComponent,MatDialogModule,MatButtonModule],
  templateUrl: './paymentsuccessdialog.component.html',
  styleUrl: './paymentsuccessdialog.component.css'
})
export class PaymentsuccessdialogComponent {
constructor(   public dialogRef: MatDialogRef<PaymentsuccessdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { message: string }){

}
}
