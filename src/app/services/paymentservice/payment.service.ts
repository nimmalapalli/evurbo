import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}

  initiatePayment(orderDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/initiate`, orderDetails);
  }
}
