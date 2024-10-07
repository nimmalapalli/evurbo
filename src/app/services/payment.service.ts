import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  apiurl = `http://localhost:8000/api`;
  constructor(private http: HttpClient) {}

  initiatePayment(orderData: any) {
    return this.http.post(this.apiurl+'/ccavenue/initiate-payment', orderData);
  }
}
