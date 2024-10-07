import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  initiatePayment(orderData: any) {
    return this.http.post('/api/ccavenue/initiate-payment', orderData);
  }
}
