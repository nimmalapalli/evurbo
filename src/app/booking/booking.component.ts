import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
import { PaymentgatewayComponent } from '../paymentgateway/paymentgateway.component';
import { BookingserviceService } from '../services/bookingservice.service';
import { BookingdialogComponent } from '../bookingdialog/bookingdialog.component';

import { CustomDateAdapter } from '../custom-date-adapter'; // Import your custom adapter
import { startDateBeforeEndDateValidator } from '../startDateValidator';
import { PaymentsuccessdialogComponent } from '../paymentsuccessdialog/paymentsuccessdialog.component';

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
PaymentgatewayComponent,
BookingdialogComponent,
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
  today: Date = new Date();
  showError = false;
  bookingData:any;
  userForm!: FormGroup;
  timeSlots: string[] = [];
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

  // Assuming daily rate is constant
  dailyRate = 299;
  constructor(private fb: FormBuilder,private bookingservice:BookingserviceService,private snackBar:MatSnackBar,public dialog: MatDialog) {
    this.getgenderdeatails();
    this.generateTimeSlots();


    this.modelForm=this.fb.group({
      category:'MODEL'
    })
 this.gethubdeatails();
 this.getmodeldeatails();

 this.userForm = this.fb.group({
  "bookingID": 0,
  bookingNo: [''],
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  dob: ['', [Validators.required,ageValidator(18)]],
  email: ['', [Validators.required, Validators.email]],
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
   // Update the combined form control value when the date changes
   onDateChange(event:any) {
    const selectedDate: Date  = event.value  ; // Access the date value properly
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

  // Implement your method to generate time slots
  getTimeSlots(): string[] {
    const slots: string[] = [];
    // Generate your time slots here
    return slots;
  }
  // Handle changes to the end time
 
  // Function to generate time slots
  private generateTimeSlots(): void {
    for (let hour = 0; hour < 24; hour++) {
      const time = this.formatTime(hour);
      this.timeSlots.push(time);
    }
  }

  // Helper function to format the hour as hh:mm
  private formatTime(hour: number): string {
    return hour < 10 ? `0${hour}:00` : `${hour}:00`; // Return in hh:mm format
  }

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
    this.userForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
  
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
  
      // Call the API
      this.bookingservice.saveBooking(data).subscribe((res: any) => {
        console.log(res);
        this.bookingData = res.data;
        this.snackBar.open(JSON.stringify(res.message));
  
        this.dialog.open(BookingdialogComponent, {
          data: { name: this.bookingData },
          width:'520px',
          height:'380px',
          panelClass: 'custom-dialog-panel',
          backdropClass: 'custom-dialog-backdrop',
        });
        this.userForm.reset()
      });
    } else {
      console.log('Form is invalid. Errors:', this.userForm.errors);
      // Optionally, you can show an error to the user here if needed
    }
  }
  
  opendiaalog(){
    this.dialog.open(BookingdialogComponent, {
      data: {name:this.bookingData},
      width:'520px',
      height:'380px',
      panelClass: 'custom-dialog-container',
    });

 
  }
 


  gethubdeatails(){
    const data = { Category:'HUB'}
    this.bookingservice.lookupModel(data).subscribe((res:any)=>{
    
      this.hubDetails=res.data;
    })
  }

  onPaymentSuccess(): void {
    this.dialog.open(PaymentsuccessdialogComponent, {
      width: '400px',
      data: { message: 'Payment Successful!' },
    });
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
  getuserdeatails(event:any){
    let data ={ mobileNo:event.target.value
    }
 
    this.bookingservice.getuserDetails(data).subscribe((res:any)=>{
       console.log(res.data)
      this.userDetails=res.data;
    })
  }
  restrictInput(event: any, pattern: RegExp): void {
    const regex = new RegExp(pattern, 'g');
    const input = event.target.value.replace(regex, '');
    this.userForm.controls['mobileNo'].setValue(input, { emitEvent: false });
  }
  restrictInput1(event: any, pattern: RegExp, controlName: string): void {
    const regex = new RegExp(pattern, 'g');
    const input = event.target.value.replace(regex, '');
    this.userForm.controls['firstName'].setValue(input, { emitEvent: false });
  }
  restrictInput2(event: any, pattern: RegExp, controlName: string): void {
    const regex = new RegExp(pattern, 'g');
    const input = event.target.value.replace(regex, '');
    this.userForm.controls['lastName'].setValue(input, { emitEvent: false });
  }
  restrictInput3(event: any, pattern: RegExp, controlName: string): void {
    const regex = new RegExp(pattern, 'g');
  const input = event.target.value.replace(regex, '');
    this.userForm.controls['licenseNo'].setValue(input, { emitEvent: false });
  }
  
  
}
