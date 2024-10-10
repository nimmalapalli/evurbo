import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY', // Date format displayed in the input field
    monthYearLabel: 'MMM YYYY', // Format for the month/year label in the date picker
    dateA11yLabel: 'LL', // Accessible label for the input field
    monthYearA11yLabel: 'MMMM YYYY', // Accessible label for the month/year picker
  }
};
