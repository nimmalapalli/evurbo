import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class BookingserviceService {

  apiurl = environment.BaseURL;
  // apiurl='http://localhost:8000/api'
  constructor(private http:HttpClient) {
   }
   lookupModel(data:any): Observable<any> {



    return this.http.post(this.apiurl+'/Lookup', data);
  }
   saveBooking(userbooking:any):Observable<any> {

    return this.http.post(this.apiurl+'/Booking/Webbooking',userbooking);
   }

  getuserDetails(data:any){
    return this.http.post(this.apiurl+'/Booking/getmemberdetails',data);
  }

  getActiveUser(data:any){
    return this.http.post(this.apiurl+'/Booking/getuseractivebookings',data);
  }

  getBookingPrice(data:any){
    return this.http.post(this.apiurl+'/Booking/getprice',data);
  }
}
