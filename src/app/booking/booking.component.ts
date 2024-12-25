import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import {MatIconModule} from '@angular/material/icon'; 
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {MatCardModule} from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar'
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { BookingserviceService } from '../services/bookingservice.service';


import { CustomDateAdapter } from '../custom-date-adapter'; // Import your custom adapter
import { startDateBeforeEndDateValidator } from '../startDateValidator';

import { PaymentService } from '../services/paymentservice/payment.service';

import Swal from 'sweetalert2';

import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';



declare var Razorpay: any;
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YY', // Define the parsing format for input
  },
  display: {
    dateInput: 'DD/MM/YY', // Define the display format for input
    monthYearLabel: 'MMM YYYY', // Format for the month/year label
    dateA11yLabel: 'LL', // Accessible label
    monthYearA11yLabel: 'MMMM YYYY', // Accessible month/year label
  },
};
export function ageValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateOfBirth = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = today.getMonth() - dateOfBirth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age < minAge ? { 'ageInvalid': true } : null;
    }

    return age < minAge ? { 'ageInvalid': true } : null;
  };
}


@Component({
  selector: 'app-booking',
  standalone: true,

  imports: [RouterOutlet,BookingComponent,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatSelectModule,
    MatDatepicker,
    MatNativeDateModule,
    MatCheckbox,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
  MatFormFieldModule,
  MatDatepickerModule,
MatDatepickerToggle,
MatIconModule,
ReactiveFormsModule,
NgIf,
MatCardModule,
NgFor,
MatSnackBarModule,
CommonModule,


MatDialogModule,





],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      { provide: DateAdapter, useClass: CustomDateAdapter }, // Use custom date adapter
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Use custom date formats
    ],
   
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  title='evuro'
  today: Date = new Date();
  showError = false;
  bookingData:any;
  userForm!: FormGroup;

  modelDetails:any;
  hubDetails:any;
  modelForm!:FormGroup;
  startDate: Date = new Date();
  endDate: Date = new Date();
  genderDetails:any;
  ratePerHour: number = 100; // Example rate per hour in INR
  totalAmount: number | undefined;
  userDetails:any;
  code:any;
  isStartDateSelected: boolean = false;
  isEndDateSelected: boolean = false;
  isStarttimeSelected: boolean = false;
  filteredEndTimes: string[] = [];
  startTime!: string;
  endTime!: string;
  minEndDate: Date;
  mobileNo!:Number;
  activeBookingDetails: any = {};
  filteredTimeSlots: string[] = [];
  timeSlots: string[] = [];

  timeSlotsAll: string[] = []; 
  dailyRate = 299;
  constructor(private fb: FormBuilder,private bookingservice:BookingserviceService,private snackBar:MatSnackBar,public dialog: MatDialog,private paymentService: PaymentService,private titleservice:Title,private router:Router) {
    this.getgenderdeatails();
 
    this.titleservice.setTitle('Evurbo');


    this.modelForm=this.fb.group({
      category:'MODEL'
    })
 this.gethubdeatails();
 this.getmodeldeatails();
 this.updateTimeSlotsForToday()
 this.userForm = this.fb.group({
  "bookingID": 0,
  bookingNo: [''],
  firstName: [this.userDetails?.firstName , Validators.required],
  lastName: [this.userDetails?.lastName, Validators.required],
  mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  dob: [this.userDetails?.dateofBirth, [Validators.required,ageValidator(18)]],
  email: [this.userDetails?.emailID, [Validators.required, Validators.email]],
 // Checkbox, starts unchecked
  licenseNo: ['',[Validators.required, Validators.pattern('^[A-Z0-9-]{5,16}$'), Validators.maxLength(16),Validators.minLength(15)]] ,
  gender: [null, Validators.required],
  hub: [null,Validators.required],
  model: [null, Validators.required],

    startDate: ['', Validators.required],
    // startTime: ['', Validators.required],


    endDate:['',[ Validators.required, this.timeValidator, startDateBeforeEndDateValidator() ]],
    "bookingStatus": 0,
    // endTime: ['', Validators.required],
    bookingAmount:'',
    isAgreeTNC: [false, Validators.requiredTrue] ,
    startTime: ['', Validators.required],
    endTime: ['', [Validators.required]]


});

// this.populateTimeSlots()
// this.filterTimeSlots()
this.userForm.get('startTime')?.valueChanges.subscribe(() => {
  this.isStarttimeSelected = true;
  this.filterEndTimes();
});
this.userForm.get('endTime')?.valueChanges.subscribe(() => {
  this.isEndDateSelected = true;
  this.filterEndTimes();
});

  this.userForm.get('endDate')?.valueChanges.subscribe(() => {
  this.updateEndTimes();
});
this.minEndDate = this.calculateTomorrowDate();
  }
  calculateTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day to current date
    return tomorrow;
  }



  updateTimeSlotsForToday() {
    const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // If current minute is past 30, move to the next hour
  const startHour = (currentMinute >= 1) ? currentHour + 1 : currentHour;

  // Generate time slots starting from the next hour or the current hour if not passed the half
  this.timeSlots = this.generateTimeSlots(startHour, 20); // Show slots from current hour or next, up to 8 PM
  this.isStarttimeSelected = true;
  }

  // Update time slots for tomorrow and onwards (only 8 AM to 8 PM)
  updateTimeSlotsForFuture() {
    // Generate time slots between 8 AM and 8 PM for future dates
    this.timeSlots = this.generateTimeSlots(8, 20);
    this.isStarttimeSelected = true;
  }

// Helper function to generate time slots between a start hour and an end hour with hourly intervals
generateTimeSlots(startHour: number, endHour: number): string[] {
  const timeSlots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    // Add time slot at the start of each hour (e.g., 08:00, 09:00, ...)
    const time = `${this.formatTime(hour)}:00`;
    timeSlots.push(time);
  }
  return timeSlots;
}

  // Helper function to format hours and minutes to two digits (e.g., 08, 09, 00, 30)
  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }
   // Update the combined form control value when the date changes
   onDateChange(event:any) {
    const selectedDate = new Date(event.value);
    const now = new Date();

    // If the selected date is today, filter out past hours
    if (selectedDate.toDateString() === now.toDateString()) {
      this.updateTimeSlotsForToday();
    } else {
      // If the selected date is tomorrow or later, show all time slots
      this.updateTimeSlotsForFuture();
    }
   
    const time = this.startDate ? this.startDate.toTimeString() : '00:00:00';
    this.startDate = new Date(selectedDate); // Set the selected date
    this.startDate.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1])); // Keep the time part
    this.userForm.get('startDate')?.setValue(this.startDate); // Update the form control
    this.calculateTotalAmount();
    this.isStarttimeSelected = true; 
    this.filteredEndTimes = [...this.timeSlots]; 
    if (this.startDate) {
      const newMinDate = new Date(this.startDate);
      newMinDate.setDate(newMinDate.getDate() + 1);
      this.minEndDate = newMinDate;
    }

  }

  openDialog(bookingData: any) {
    Swal.fire({
      title: 'Booking Information',
      html: `
        <div class="details">
          <p><strong>Booking Number:</strong> ${bookingData?.bookingNo}</p>
          <p><strong>Booking Start Date:</strong> ${new Date(bookingData?.startDate).toLocaleDateString()}</p>
          <p><strong>Booking End Date:</strong> ${new Date(bookingData?.endDate).toLocaleDateString()}</p>
          <p><strong>Booking Amount:</strong> ₹${bookingData?.bookingAmount}</p>
          <p><strong>PaymentId:</strong> ${this.paymentID}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect after confirmation
        window.location.href = 'https://evurbo.energy';
      }
    });
  }
  onEndDateChange(event: any) {
    const selectedDate: Date | null = event.value;
    if (selectedDate) {
      const time = this.endDate ? this.endDate.toTimeString() : '00:00:00';
      this.endDate = new Date(selectedDate);
      this.endDate.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]));
      this.userForm.get('endDate')?.setValue(this.endDate);
    }
 
    this.isEndDateSelected = true; 
    this.updateEndTimes();
    this.calculateTotalAmount();
 
  }

  // Custom validator for checking time mismatch when both dates are the same
  timeValidator: ValidatorFn = (group: AbstractControl): {[key: string]: boolean} | null => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startDate && endDate && startTime && endTime && startDate.getTime() === endDate.getTime()) {
      const startHour = parseInt(startTime.split(':')[0], 10);
      const startMinute = parseInt(startTime.split(':')[1], 10);
      const endHour = parseInt(endTime.split(':')[0], 10);
      const endMinute = parseInt(endTime.split(':')[1], 10);

      if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
        return { timeMismatch: true };
      }
    }
    return null;
  };


  // Filter out times before the current hour
  private filterTimeSlots(): void {
    const currentHour = new Date().getHours();
    this.filteredTimeSlots = this.timeSlots.filter((time) => {
      const hour = parseInt(time.split(':')[0], 10); // Extract hour from "hour:00"
      return hour >= currentHour;
    });
  }
  // Implement your method to generate time slots
  getTimeSlots(): string[] {
    const slots: string[] = [];
    // Generate your time slots here
    return slots;
  }
  // Handle changes to the end time
 
  // Function to generate time slots
  // private generateTimeSlots(): void {
  //   for (let hour = 0; hour < 24; hour++) {
  //     const time = this.formatTime(hour);
  //     this.timeSlots.push(time);
  //   }
  // }

  // Helper function to format the hour as hh:mm

// Handles start time change
// onTimeChange(selectedTime: string): void {
//   console.log(selectedTime)
//   const [hour, minute] = selectedTime.split(':').map(Number);
//   this.startDate.setHours(hour, minute);
//   this.userForm.get('startDate')?.setValue(this.startDate);
//   this.isStarttimeSelected = true;
//   this.calculateTotalAmount();
//   this.updateEndTimes();
// }

// // Handles end time change
// onEndTimeChange(selectedTime: string): void {
//   console.log(selectedTime)
//   const [hour, minute] = selectedTime.split(':').map(Number);
//   this.endDate.setHours(hour, minute);
//   this.userForm.get('endDate')?.setValue(this.endDate);
//   this.calculateTotalAmount();
// }
  endDateValidator(control: { value: string | number | Date; }): { [key: string]: boolean } | null {
    const startDateTime = new Date(this.startDate);
    const endDateTime = new Date(control.value);

    // Check if the end date is at least 24 hours after the start date
    if (endDateTime.getTime() < startDateTime.getTime() + 24 * 60 * 60 * 1000) {
      return { minGap: true }; // Error if less than 24 hours
    }
    return null; // Valid
  }
  updateEndTimes() {
    if (this.startDate && this.endDate && this.startDate.getTime() === this.endDate.getTime()) {
      // Filter end times to be only after the start time when dates are the same
      const startHour = parseInt(this.startTime.split(':')[0], 10);
      const startMinute = parseInt(this.startTime.split(':')[1], 10);
      this.filteredEndTimes = this.timeSlots.filter((time) => {
        const [endHour, endMinute] = time.split(':').map(t => parseInt(t, 10));
        return endHour > startHour || (endHour === startHour && endMinute > startMinute);
      });
    } else {
      // If the dates are different, show all time options
      this.filteredEndTimes = [...this.timeSlots];
    }
  }

  calculateTotalAmount(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      // Ensure that the end date is after or the same as the start date
      if (end < start) {
  
        this.totalAmount = undefined;
        return;
      }

      // Calculate difference in days
      const timeDifference = end.getTime() - start.getTime();
      const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert time difference to days
      
      // If the day difference is positive or zero, calculate total
      if (dayDifference >= 0) {
        this.totalAmount = dayDifference * this.dailyRate;
      } else {
        this.totalAmount = undefined;
      }
      this.userForm.controls['bookingAmount'].setValue(this.totalAmount);
    }
  }
  
  
  
  // Filter function for end date picker to disable dates before start date
  endDateFilter = (date: Date | null): boolean => {
    return date ? date >= this.startDate : false;
  };
  

  convertTimeTo24Hour(time: string): [number, number] {
    const [timeString, modifier] = time.split(' ');
    let [hours, minutes] = timeString.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return [hours, minutes];
  }
  ngOnInit() {


  }

  timeMismatchValidator(control: { value: any; }) {
    const startTime = this.userForm.get('startTime')?.value;
    const endTime = control.value;

    if (startTime && endTime && startTime === endTime) {
      return { timeMismatch: true };
    }
    return null; // No error
  }
  filterEndTimes() {
    // Logic to filter available end times based on selected start time
    if (this.startTime) {
      this.filteredEndTimes = this.timeSlots.filter(time => time > this.startTime);
    } else {
      this.filteredEndTimes = [...this.timeSlots];
    }
  }

  onTimeChange(value: string) {
    console.log('Start time changed:', value);
    this.userForm.get('startTime')?.setValue(value);
  }

  onEndTimeChange(value: string) {
    console.log('End time changed:', value);
    this.userForm.get('endTime')?.setValue(value);
  }

  generateBookingNo() {
    // Example logic to generate a unique booking number
    const randomBookingNo = 'EVURBO' + Math.floor(Math.random() * 1000000);
    this.userForm.controls['bookingNo']?.setValue(randomBookingNo);
  }

  onSubmit() {
    this.showError = true;
 
  
    // Check if the form is valid and startDate is not greater than endDate
    const startDate = new Date(this.userForm.get('startDate')?.value);
    const endDate = new Date(this.userForm.get('endDate')?.value);
  
    // Custom validation: if startDate is greater than endDate
    if (startDate > endDate) {
      // Optionally, set a custom error on the form
      this.userForm.get('endDate')?.setErrors({ startDateAfterEndDate: true });
   
      alert('Start Date cannot be greater than End Date');
      return; // Exit the method, preventing the API call
    }
  
    // Check if the form is valid
    if (this.userForm.valid) {
      const selectedHub: number = Number(this.userForm.get('hub')?.value);
      const selectedGender: number = Number(this.userForm.get('gender')?.value);
      const selectedModel: number = Number(this.userForm.get('model')?.value);
      const selectedBookingAmount: number = Number(this.userForm.get('bookingAmount')?.value);
  
      const data = {
        ...this.userForm.value,
        hub: selectedHub,
        gender: selectedGender,
        model: selectedModel,
        bookingAmount: selectedBookingAmount
      };
  
      console.log('Form Data:', data);
  
     
      this.bookingservice.saveBooking(data).subscribe((res: any) => {
        console.log(res);
        this.bookingData = res.data;
        if (res.statusCode === 200) { 
          this.payment();
        
        } 
        // else if (res.statusCode === 400) {
        //   this.snackBar.open(res.message, 'Close', { 
        //     duration: 3000,
        //     panelClass: ['error-snackbar'] 
        //   });
        
        // }

       
     

        
      });
    }
  }
  paymentID:any;
  bookingID=0;
   paymentform!: FormGroup;
   showConfirmation: boolean = false;
   populateTimeSlots(): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const startTimeLimit = 8;  // Start time at 8 AM
    const endTimeLimit = 20;   // End time at 8 PM

    // Loop through the range of hours from 8 AM to 8 PM (1-hour intervals)
    for (let i = startTimeLimit; i <= endTimeLimit; i++) {
      const hour = i < 10 ? '0' + i : i;  // Format hour to 2 digits
      this.timeSlots.push(`${hour}:00`);
    }

    // Disable past time slots based on the current hour
    this.timeSlots = this.timeSlots.filter(time => {
      const [hour, minute] = time.split(':');
      if (parseInt(hour) < currentHour) {
        return false;  // Disable past hours
      }
      if (parseInt(hour) === currentHour && parseInt(minute) <= currentDate.getMinutes()) {
        return false;  // Disable past minutes in the current hour
      }
      return true;
    });
  }

 
   confirmPayment() {
     this.showConfirmation = true;
   }
 
   onConfirm(answer: boolean) {
     if (answer) {
    
     }
     this.showConfirmation = false;
   }
 

   payment() {
  
     const bookingAmount = this.bookingData?.bookingAmount; 
     console.log(bookingAmount);
     const orderId = this.bookingData?.orderReferenceID;
     

     if (!bookingAmount || !orderId) {
       alert('Required payment details are missing.');
       return;
     }
     
   
     this.initiateRazorpayPayment(orderId, bookingAmount, 'INR');
  
   }
   
   initiateRazorpayPayment(orderId: string, amount: number, currency: string) {
    
   
     const bookingNo = this.bookingData?.bookingNo;
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
         debugger
         console.log(response)
      
         this.verifyPayment(bookingNo, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
       },
       prefill: {},
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
    this.paymentService.verifyPayment(bookingID, orderReferenceID, paymentID, signature).subscribe(
      (verificationResponse: any) => {
        console.log(verificationResponse);
  
     
        if (verificationResponse && verificationResponse.data) {
          this.paymentID = verificationResponse.data;
  
       
          this.openDialog(this.bookingData);
          this.snackBar.open('Payment verification successful!');
        } else {
          // Else condition: PaymentID is not present or invalid
          this.snackBar.open('Payment verification failed: Invalid payment ID.');
        }
      },
      (error) => {
        // Error case: Handle API call error
       this.snackBar.open('Error during payment verification: ' + error.message);
      }
    );
  }
  



 



  gethubdeatails(){
    const data = { Category:'HUB'}
    this.bookingservice.lookupModel(data).subscribe((res:any)=>{
    
      this.hubDetails=res.data;
    })
  }


  getmodeldeatails(){
    const data ={ Category:'MODEL'
    }
    this.bookingservice.lookupModel(data).subscribe((res:any)=>{
    
      this.modelDetails=res.data;
    })
  }
  getgenderdeatails(){
    const data ={ Category:'GENDER'
    }
    this.bookingservice.lookupModel(data).subscribe((res:any)=>{
     
      this.genderDetails=res.data;
    })
  }
  getuserdeatails(event: any) {
    let data = { mobileNo: event.target.value };
  
    this.bookingservice.getuserDetails(data).subscribe((res: any) => {
      // Check if the user data is available in the response
      if (res && res.data && res.data.mobileNo) {
        console.log(res.data);
        this.userDetails = res.data; // Store user details separately
        this.mobileNo = res.data.mobileNo; // Assuming the mobile number is available here
        this.userForm.patchValue({
          firstName: this.userDetails.firstName, // Assuming the API returns `name`
          email: this.userDetails.emailID,
          lastName: this.userDetails.lastName,
          dob:this.userDetails.dateofBirth
        });
        // After fetching user details, call getActiveuserBooking
        this.getActiveuserBooking();
      }})
  }
  

  getActiveuserBooking() {
    // Use the stored mobile number from getuserdeatails
    let data = { mobileNo: this.mobileNo };

    this.bookingservice.getActiveUser(data).subscribe(
      (res: any) => {
        console.log(res.data);

        // If res.data is null, show the no data message
        if (res.data == "") {
      
        } else {
          this.activeBookingDetails = res.data; // Store active booking details separately
          
          // Show success message with active booking details
          this.snackBar.open('Active booking fetched successfully: ' + JSON.stringify(this.activeBookingDetails), 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      },
      (error: any) => {
        console.error(error);

        // Show error message using MatSnackBar in case of failure
        this.snackBar.open('Failed to fetch active booking. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }
  


  
  
}
