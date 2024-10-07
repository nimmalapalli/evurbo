import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingdialogComponent } from './bookingdialog.component';

describe('BookingdialogComponent', () => {
  let component: BookingdialogComponent;
  let fixture: ComponentFixture<BookingdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingdialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
