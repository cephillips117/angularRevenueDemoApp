import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';

/** Required imports for moment */
import * as moment from 'moment';
import { Moment } from 'moment';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-revenue-input',
  templateUrl: './revenue-input.component.html',
  styleUrls: ['./revenue-input.component.scss'],
  // Providers required for moment adapter and year picker
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class RevenueInputComponent implements OnInit {
  // Date Obj
  revDate = new FormControl();
  // Revenue Obj
  revAmt = new FormControl();
  // Local copy of the sessionStorage array
  storedArray = [];
  // Values to be submitted
  subDate: number;
  subAmt: number;
  errorMsg: 'ERROR: Not enough data points';
  /**
   * Function to change the date picker to a year picker
   * @param normalizedYear
   * @param datepicker
   */
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    let ctrlValue: any;
    if (this.revDate.value) {
      ctrlValue = this.revDate.value;
    } else {
      // If no date is input the date picker will initialize a date of today.
      ctrlValue = moment();
    }
    ctrlValue.year(normalizedYear.year());
    this.revDate.setValue(ctrlValue);
    datepicker.close();
  }
  /**
   * Submit the entered values
   * Date and Revenue
   */
  pushIt() {
     // Update the local array based on session storage
    this.getStored();
     // Local Array to push
    const tempAr = [];
    // Use moment to format the DateObj to YYYY format and parse to int
    this.subDate = parseInt(moment(this.revDate.value._d).format('YYYY'), 10);
    // Retrive the revenue amount from the form control and parse to float
    this.subAmt = parseFloat(this.revAmt.value);
    /**
     * Check to make sure the user has not submitted the same date twice
     */
    if (this.storedArray.length === 0 || !this.checkForDouble(this.subDate)) {
      tempAr.push(this.subDate);
      tempAr.push(this.subAmt);
      // Push to local storage array
      this.storedArray.push(tempAr);
      // Sort Array before storing values in session
      this.storedArray = this.storedArray.sort(this.compareValues);
      sessionStorage.setItem('RevenueObj', JSON.stringify(this.storedArray));
      // Send success message
      this.sendMsg(true);
    } else {
      // Send error message
      this.sendMsg(false);
    }
  }
  /**
   * Function for Array.sort to sort our Revenue by year
   * @param a
   * @param b
   */
  compareValues(a, b) {
    if (a[0] < b[0]) {return -1; }
    if (a[0] > b[0]) {return 1; }
    return 0;
  }
  /**
   * Display message on Success or Error
   * @param value
   */
  sendMsg(value: boolean) {
    if (value) {
      this.messageBar.open('SUCCESS:  ' + this.subDate + ' revenue added', '', {
        duration: 3000
      });
    } else {
      this.messageBar.open('ERROR: Duplicate Submission ', '', {
        duration: 3000
      });
    }
  }
  /**
   * Check for data points then navigate to the chart page.
   */
  plotRev() {
    if (this.storedArray.length < 2) {
      this.messageBar.open('ERROR: Not enough data points ' + this.storedArray.length + ' entered, at least 2 are required.', '', {
        duration: 3000
      });
    } else {
      this.router.navigate(['/revenue-display']);
    }
  }
  /**
   * Check for sessionStorage values
   */
  getStored(): void {
    // Check if there is already stored data
    if (sessionStorage.getItem('RevenueObj')) {
      this.storedArray = JSON.parse(sessionStorage.getItem('RevenueObj'));
    }
    // this.storedAr = JSON.parse(sessionStorage.getItem('RevenueObj'));
  }
  /**
   * Clear stored session values
   */
  clearStored() {
    if (sessionStorage.getItem('RevenueObj')) {
      sessionStorage.removeItem('RevenueObj');
      this.storedArray = [];
      this.messageBar.open('CLEARED: All revenue data deleted', '', {
        duration: 3000
      });
    } else {
      this.messageBar.open('ERROR: No revenue data to delete please input more data', '', {
        duration: 3000
      });
    }
  }
  /**
   * Reset the form control fields
   */
  resetFields() {
    this.revDate = new FormControl();
    this.revAmt = new FormControl();
  }
  /**
   * Search for a duplicate year
   * @param year
   */
  checkForDouble(year: number) {
    let doubleFound = false;
    this.storedArray.forEach(element => {
      if (year === element[0]) {
        doubleFound = true;
      }
    });
    return doubleFound;
  }
  constructor(public messageBar: MatSnackBar, public router: Router) {
    this.getStored();
  }
  ngOnInit() {}
}
