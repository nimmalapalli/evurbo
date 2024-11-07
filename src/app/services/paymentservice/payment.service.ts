import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  apiurl = environment.BaseURL;

  constructor(private http: HttpClient) {}



  // Verify payment
  verifyPayment(bookingID:number,orderReferenceID: string, paymentID: string, signature: string): Observable<any> {
    return this.http.post(`${this.apiurl}/Booking/updatebookingpaymentstatus`, {
      bookingID:bookingID,
      orderReferenceID: orderReferenceID,
      paymentID: paymentID,
      signature:signature
    }, {
     
    });
  }
}
