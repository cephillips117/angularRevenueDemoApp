# Angular Workiva App
Author: Christopher Phillips

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3. 
## Pages
The app has 2 pages 
1. `http://localhost:4200/revenue-input` - This is the data entry page containig 2 input boxs
2. `http://localhost:4200/revenue-display` - This is the revenue chart display page. 

## Data Storage
This app stores all entered revenue in sessionStorage. I've provided an icon on the input page to delete all stored data if desired otherwise the data will be removed from the browser when the tab is closed.

## Libraries Used
1. Angular Material for the components:  `https://material.angular.io/`
2. Bootstrap grid structure for responsiveness: `https://getbootstrap.com/`
3. Highcharts to display the data: `https://www.highcharts.com/`
4. Highcharts Angular wrapper: `https://github.com/gevgeny/angular2-highcharts`

## Install dependencies
Run `npm install`

## Running the application

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. This will automatically send you to the revenue input page by default
