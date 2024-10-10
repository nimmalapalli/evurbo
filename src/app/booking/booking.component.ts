import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MY_DATE_FORMATS } from '../customdate';


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
MatDialogModule




],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  today: Date = new Date();

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
  totalAmount: number = 0;
  userDetails:any;
  code:any;
  constructor(private fb: FormBuilder,private bookingservice:BookingserviceService,private snackBar:MatSnackBar,public dialog: MatDialog) {
    this.getgenderdeatails();
    this.generateTimeSlots();
  

    this.modelForm=this.fb.group({
      category:'MODEL'
    })
 this.gethubdeatails();
 this.getmodeldeatails()
  }
   // Update the combined form control value when the date changes
   onDateChange(event:any) {
    const selectedDate: Date  = event.value  ; // Access the date value properly
    const time = this.startDate ? this.startDate.toTimeString() : '00:00:00';
    this.startDate = new Date(selectedDate); // Set the selected date
    this.startDate.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1])); // Keep the time part
    this.userForm.get('startDate')?.setValue(this.startDate); // Update the form control
    this.calculateTotalAmount();

  }

  // Update the combined form control value when the time changes
  onTimeChange(selectedTime: string) {
    const [hour, minute] = this.convertTimeStringToHours(selectedTime);
    this.startDate.setHours(hour, minute);
    this.userForm.get('startDate')?.setValue(this.startDate);
    this.calculateTotalAmount();

  }
  onEndDateChange(event: any) {
    const selectedDate: Date | null = event.value;
    if (selectedDate) {
      const time = this.endDate ? this.endDate.toTimeString() : '00:00:00';
      this.endDate = new Date(selectedDate);
      this.endDate.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]));
      this.userForm.get('endDate')?.setValue(this.endDate);
    }
    this.calculateTotalAmount();
 
  }

  // Handle changes to the end time
  onEndTimeChange(selectedTime: string) {
    const [hour, minute] = this.convertTimeStringToHours(selectedTime);
    this.endDate.setHours(hour, minute);
    this.userForm.get('endDate')?.setValue(this.endDate);
    this.calculateTotalAmount();
  
  }
  // Helper function to convert '08:00 AM' to hours and minutes
  convertTimeStringToHours(time: string): [number, number] {
    const [hourMinute, modifier] = time.split(' ');
    let [hour, minute] = hourMinute.split(':').map(Number);
    
    if (modifier === 'PM' && hour !== 12) {
      hour += 12;
    } else if (modifier === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return [hour, minute];
  }
  updateDateWithTime(date: Date, time: string, type: 'start' | 'end') {
    const [hours, minutes] = this.convertTimeTo24Hour(time);
    date.setHours(hours);
    date.setMinutes(minutes);
    
    if (type === 'start') {
      this.startDate = date;
    } else {
      this.endDate = date;
    }
  }
  calculateTotalAmount() {
    if (this.startDate && this.endDate) {
      // Check if the end date is earlier than the start date
      if (this.endDate.getTime() < this.startDate.getTime()) {
        this.totalAmount = 0;
        this.snackBar.open('End date cannot be earlier than start date', 'Close', { duration: 3000 });
      } else {
        // Calculate the number of full days between the start and end dates
        const start = new Date(this.startDate);
        start.setHours(0, 0, 0, 0); // Reset to midnight for a full-day calculation
        const end = new Date(this.endDate);
        end.setHours(0, 0, 0, 0); // Reset to midnight for a full-day calculation
  
        const durationInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        // Set the daily rate
        const dailyRate = 299;
        
        // Calculate the total amount based on the daily rate
        this.totalAmount = durationInDays * dailyRate;
      }
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
 
    this.userForm = this.fb.group({
      "bookingID": 0,
      bookingNo: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', [Validators.required,ageValidator(18)]],
      email: ['', [Validators.required, Validators.email]],
      hasLicense: [false],  // Checkbox, starts unchecked
      licenseNo: [''] ,
      gender: [null, Validators.required],
      hub: [null,Validators.required],
      model: [null, Validators.required],
    
        startDate: ['', Validators.required],
        // startTime: ['', Validators.required],
 
 
        endDate:['', Validators.required],
        "bookingStatus": 0,
        // endTime: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue] 
    
    
    });

    this.userForm.get('hasLicense')?.valueChanges.subscribe((isChecked: boolean) => {
      const licenseNumberControl = this.userForm.get('licenseNo');
      if (isChecked) {
        licenseNumberControl?.setValidators([Validators.required, Validators.pattern('^[A-Z0-9-]{5,15}$')]); // Example pattern
      } else {
        licenseNumberControl?.clearValidators();
      }
      licenseNumberControl?.updateValueAndValidity();
    });
  
  }

  

  generateBookingNo() {
    // Example logic to generate a unique booking number
    const randomBookingNo = 'EVURBO' + Math.floor(Math.random() * 1000000);
    this.userForm.controls['bookingNo']?.setValue(randomBookingNo);
  }


  onSubmit() {

    if (this.userForm.valid) {
      const selectedHub: number = Number(this.userForm.get('hub')?.value);

      // You can also do this for other fields if needed
      const selectedGender: number = Number(this.userForm.get('gender')?.value);
      const selectedModel: number = Number(this.userForm.get('model')?.value);
  
      const data = {
        ...this.userForm.value,
        hub: selectedHub,
        gender: selectedGender,
        model: selectedModel
      };
    
      console.log(data)
      this.bookingservice.saveBooking(data).subscribe((res:any)=>{
        console.log(res);
        this.bookingData=res.data
        this.snackBar.open(JSON.stringify(res.message));
    this.dialog.open(BookingdialogComponent, {
          data: {name:this.bookingData},
          width:'400px',
          height:'250px'
        });

      })
    } else {
      console.log('Form Invalid');
    }
  }
  opendiaalog(){
    this.dialog.open(BookingdialogComponent, {
      data: {name:this.bookingData},
      width:'500px',
      height:'280px',
      panelClass:'dialog'
    });

 
  }
  generateTimeSlots() {
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // Start from midnight

    const endTime = new Date();
    endTime.setHours(23, 59, 59, 0); // End at 11:59:59 PM

    while (startTime <= endTime) {
      const hours = startTime.getHours();
      const minutes = startTime.getMinutes();
      const seconds = startTime.getSeconds();

      // Convert to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight and noon
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      const time = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
      this.timeSlots.push(time);

      // Increment by 1 minute (you can adjust the interval as needed)
      startTime.setMinutes(startTime.getMinutes() + 1);
    }
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
