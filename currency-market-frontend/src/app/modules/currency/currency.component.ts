import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrenciesService } from '../../core/services/currencies.service';
import { Currency } from '../../shared/models/currencies.interface';
import { BehaviorSubject } from 'rxjs';
import * as Chart from 'chart.js'

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit, AfterViewInit {
  currency$ = new BehaviorSubject<Currency>(null);
  currencyHistory: any[] = [];
  canvas: any;
  ctx: any;
  currencyChart: Chart;

  constructor(private readonly route: ActivatedRoute, private router: Router, private readonly currenciesService: CurrenciesService) { }

  ngOnInit() {
    const currencyCode = this.route.snapshot.paramMap.get('code');
    this.currenciesService.getLatestCurrency(currencyCode).subscribe(response => {
       this.currency$.next(response);
    });

    this.getCurrencyHistory(currencyCode);
  }

  ngAfterViewInit(): void {
    const currencyCode = this.route.snapshot.paramMap.get('code');
    this.canvas = document.getElementById('currencyChart');
    this.ctx = this.canvas.getContext('2d');
    this.generateCurrencyChart(this.ctx, currencyCode);
  }

  getCurrencyHistory(currency: string) {
    this.currenciesService.getCurrencyHistory(currency).subscribe(currencyHistory =>{
      this.getCurrencyAskHistorySeries(currencyHistory);
      this.currencyChart.data.datasets[0].data = this.currencyHistory;
      this.currencyChart.update();
      this.getCurrencyBidHistorySeries(currencyHistory);
      this.currencyChart.data.datasets[1].data = this.currencyHistory;
      this.currencyChart.update();
    })
  }

  getCurrencyAskHistorySeries(currencyHistory: Currency[]) {
    this.currencyHistory = [];
    currencyHistory.forEach(p => this.currencyHistory.push({x: p.createdAt.toString(), y: p.ask}));
  }

  getCurrencyBidHistorySeries(currencyHistory: Currency[]) {
    this.currencyHistory = [];
    currencyHistory.forEach(p => this.currencyHistory.push({x: p.createdAt.toString(), y: p.bid}));
  }

  generateCurrencyChart(ctx, currencyCode: string) {
    this.currencyChart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
              label: 'Sprzedaż',
              backgroundColor: "blue",
              borderColor: "lightblue",
              fill: false,
              lineTension: 0,
              radius: 5,
              borderWidth: 1,
              
          },
          {
            label: 'Kupno',
            backgroundColor: "green",
            borderColor: "lime",
            fill: false,
            lineTension: 0,
            radius: 5,
            borderWidth: 1,
            
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          position: "top",
          text: "Historia zmiany kursu waluty " + currencyCode,
          fontSize: 18,
          fontColor: "#111"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#333",
            fontSize: 16
          }
        },
        scales:{
          xAxes: [{
            type: 'time',
            time: {
                unit: 'month'
            }
        }]
        }
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/list']);
  }

}
