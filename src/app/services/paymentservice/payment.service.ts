import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  private apiUrl = 'https://ccavenue-xw9x.onrender.com/api'; // Update with your backend API URL

  constructor(private http: HttpClient) {}

  // Create a new order
  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/create-order`, data);
  }

  // Verify payment
  verifyPayment(orderId: string, paymentId: string, signature: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifyOrder`, {
      order_id: orderId,
      payment_id: paymentId
    }, {
      headers: {
        'x-razorpay-signature': signature
      }
    });
  }
}
