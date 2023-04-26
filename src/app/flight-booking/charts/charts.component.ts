import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartComponent } from '../chart/chart.component';

@Component({
  standalone: true,
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  imports: [CommonModule, ChartComponent]
})
export class ChartsComponent {
  title = 'Charts';
  chartsCount = 4;
  charts: { id: number; data: string }[] = [];

  constructor() {
    for (let index = 1; index <= this.chartsCount; index++) {
      let dataNumber = index % 3;
      if (!dataNumber) {
        dataNumber = 3;
      }
      this.charts.push({ id: index, data: 'data' + dataNumber });
    }
  }
}
