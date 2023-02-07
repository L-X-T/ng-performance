import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements AfterViewInit {
  title = 'Charts';
  chartsCount = 4;
  charts: { id: number; data: string }[] = [];

  @ViewChild('cnt', { read: ViewContainerRef }) vC!: ViewContainerRef;

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
    const chartRef = this.vC.createComponent(esm.ChartComponent);
    chartRef.instance.id = this.charts[0].id;
    chartRef.instance.data = this.charts[0].data;
  }
}
