import { Component, AfterViewInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revenue-display',
  templateUrl: './revenue-display.component.html',
  styleUrls: ['./revenue-display.component.scss']
})
export class RevenueDisplayComponent implements AfterViewInit {
  // Line chart declaration
  options = {
    title : { text : 'Workiva Revenue' },
      yAxis: {
        title: {
            text: 'Revenue'
        }
      },
      xAxis: {
        title: {
            text: 'Year'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        valueDecimals: 2,
        valuePrefix: '$',
        valueSuffix: ' USD'
      },
      series: [{
        data: []
      }]
  };
  // Chart instance
  chart: any;
  // Listener added to make the chart responsive
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.constructor();
  }
  // Go back to input page
  backToInput() {
    this.router.navigate(['/revenue-input']);
  }
  // Save the chart instance
  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }
  /**
   * In order to draw the chart full width we have to wait
   * for the dom to load then draw the chart
   */
  ngAfterViewInit() {
    this.constructor();
  }
  constructor(public router: Router) {
    // Load data from sessionStorage to plot chart
    this.options.series[0].data = JSON.parse(sessionStorage.getItem('RevenueObj'));
  }
}
