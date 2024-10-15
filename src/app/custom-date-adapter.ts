import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  // Override format to display the date in dd/mm/yy format
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of year

    // Return date in dd/mm/yy format
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }

  // Override parse to convert the input string back into a Date object
  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = +parts[0];
        const month = +parts[1] - 1; // Months are 0-based
        const year = +('20' + parts[2]); // Assuming 'yy' is in the range of 2000-2099
        return new Date(year, month, day);
      }
    }
    return null; // Return null if the input is not valid
  }
}
