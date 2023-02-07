import { AfterViewInit, Component, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartComponent } from '../chart/chart.component';

@Component({
  standalone: true,
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  imports: [CommonModule, ChartComponent]
})
export class ChartsComponent implements AfterViewInit {
  title = 'Charts';
  chartsCount = 4;
  charts: { id: number; data: string }[] = [];

  @ViewChildren('cnt', { read: ViewContainerRef }) vCs!: QueryList<ViewContainerRef>;

  constructor() {
    for (let index = 1; index <= this.chartsCount; index++) {
      let dataNumber = index % 3;
      if (!dataNumber) {
        dataNumber = 3;
      }
      this.charts.push({ id: index, data: 'data' + dataNumber });
    }
  }

  async ngAfterViewInit() {
    const esm = await import('../chart/chart.component');
    /*const chartRef = this.vCs.createComponent(esm.ChartComponent);
    chartRef.instance.id = this.charts[0].id;
    chartRef.instance.data = this.charts[0].data;*/

    this.vCs.map((viewContainerRef: ViewContainerRef, index: number) => {
      const chartRef = viewContainerRef.createComponent(esm.ChartComponent);
      chartRef.instance.id = this.charts[index].id;
      chartRef.instance.data = this.charts[index].data;
    });
  }
}
