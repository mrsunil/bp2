import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
//import { ChartsModule } from "ng2-charts";
import { Chart } from "chart.js";
import { map } from "rxjs/operators";

@Component({
	selector: "atr-trading-dashboard",
	templateUrl: "./trading-dashboard.component.html",
	styleUrls: ["./trading-dashboard.component.scss"]
})
export class TradingDashboardComponent implements OnInit {

	company: string;

	constructor(private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.paramMap.pipe(
			map((params) => params['company']))
			.subscribe((company) => {
				this.company = company;
			});
	}

	public whiteColors: Array<any> = [
		{ // white
			backgroundColor: "rgba(255,255,255,1)",
			borderColor: "rgba(255,255,255,1)",
			pointBackgroundColor: "rgba(255,255,255,1)",
			pointBorderColor: "rgba(255,255,255,1)",
			pointHoverBackgroundColor: "rgba(255,255,255,1)",
			pointHoverBorderColor: "rgba(255,255,255,1)",
		},
		{ // white
			backgroundColor: "rgba(255,255,255,1)",
			borderColor: "rgba(255,255,255,1)",
			pointBackgroundColor: "rgba(255,255,255,1)",
			pointBorderColor: "rgba(255,255,255,1)",
			pointHoverBackgroundColor: "rgba(255,255,255,1)",
			pointHoverBorderColor: "rgba(255,255,255,1)",
		}
	];


	public chartFlashColorsV2: Array<any> = [
		{ // red flash
			backgroundColor: "rgba(155,54,65,1)",
			borderColor: "rgba(155,54,65,1)",
			pointBackgroundColor: "rgba(155,54,65,1)",
			pointBorderColor: "rgba(155,54,65,1)",
			pointHoverBackgroundColor: "rgba(155,54,65,1)",
			pointHoverBorderColor: "rgba(155,54,65,1)",
		},
		{ // green flash
			backgroundColor: "rgba(55,154,141,1)",
			borderColor: "rgba(55,154,141,1)",
			pointBackgroundColor: "rgba(55,154,141,1)",
			pointBorderColor: "rgba(55,154,141,1)",
			pointHoverBackgroundColor: "rgba(55,154,141,1)",
			pointHoverBorderColor: "rgba(55,154,141,1)",
		}
	];

	public chartFlashColors: Array<any> = [
		{ // green flash
			backgroundColor: "rgba(84,127,136,1)",
			borderColor: "rgba(84,127,136,1)",
			pointBackgroundColor: "rgba(84,127,136,1)",
			pointBorderColor: "rgba(84,127,136,1)",
			pointHoverBackgroundColor: "rgba(84,127,136,1)",
			pointHoverBorderColor: "rgba(84,127,136,1)"
		},
		{ // violet flash
			backgroundColor: "rgba(144,64,141,1)",
			borderColor: "rgba(144,64,141,1)",
			pointBackgroundColor: "rgba(144,64,141,1)",
			pointBorderColor: "rgba(144,64,141,1)",
			pointHoverBackgroundColor: "rgba(144,64,141,1)",
			pointHoverBorderColor: "rgba(144,64,141,1)",
		}
	];

	public violetColor: Array<any> = [
		{ // violet
			backgroundColor: "rgba(94,105,158,1)",
			borderColor: "rgba(94,105,158,1)",
			pointBackgroundColor: "rgba(94,105,158,1)",
			pointBorderColor: "rgba(94,105,158,1)",
			pointHoverBackgroundColor: "rgba(94,105,158,1)",
			pointHoverBorderColor: "rgba(94,105,158,1)",
		}
	];

	public chartColors: Array<any> = [
		{ // blue
			backgroundColor: "rgba(167,197,226,1)",
			borderColor: "rgba(167,197,226,1)",
			pointBackgroundColor: "rgba(167,197,226,1)",
			pointBorderColor: "rgba(167,197,226,1)",
			pointHoverBackgroundColor: "rgba(167,197,226,1)",
			pointHoverBorderColor: "rgba(167,197,226,1)"
		},
		{ // green
			backgroundColor: "rgba(151,177,80,1)",
			borderColor: "rgba(151,177,80,1)",
			pointBackgroundColor: "rgba(151,177,80,1)",
			pointBorderColor: "rgba(151,177,80,1)",
			pointHoverBackgroundColor: "rgba(151,177,80,1)",
			pointHoverBorderColor: "rgba(151,177,80,1)"
		},
		{ // violet
			backgroundColor: "rgba(94,105,158,1)",
			borderColor: "rgba(94,105,158,1)",
			pointBackgroundColor: "rgba(94,105,158,1)",
			pointBorderColor: "rgba(94,105,158,1)",
			pointHoverBackgroundColor: "rgba(94,105,158,1)",
			pointHoverBorderColor: "rgba(94,105,158,1)",
		}
	];

	//P&L
	public plBarChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: false,
		tooltips: true,
		events: ["click"],
		legend: { display: true },
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}
		},
		scales: {
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true
				},
				stacked: true,
				gridLines: {
					display: false
				}
			}],
			xAxes: [{
				display: true,
				stacked: true,
				gridLines: {
					display: false
				}

			}]
		},
		animation: {
			onComplete: function () {
				var chartInstance = this.chart;
				var ctx = chartInstance.ctx;
				var height = chartInstance.controller.boxes[0].bottom;
				ctx.font = "Roboto 13px  bold";
				ctx.textAlign = "center";
				ctx.fillStyle = '#ffffff';
				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach(function (bar, index) {
						ctx.fillText(dataset.data[index], bar._model.x, height - ((height - bar._model.y)) + 20);
					}), this);
				}), this);
			}
		}
	};

	public plBarChartLabels: string[] = ["YTD", "MTD", "Δ 5 Days", "Δ 1 Days"];
	public plBarChartType: string = "bar";
	public plBarChartLegend: boolean = true;
	public plBarChartData: any[] = [
		{ data: [310, 310, 70, 80], label: "Open", datalabels: { align: "center", anchor: "center" } },
		{ data: [403, 300, 81, 80], label: "Realised", datalabels: { align: "center", anchor: "center" } }
	];

	//open positions and stock
	public openAndStockBarChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: false,
		tooltips: false,
		events: ["click"],
		legend: { display: false },
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}
		},
		scales: {
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true
				},
				stacked: true,
				gridLines: {
					display: false
				}
			}],
			xAxes: [{
				display: true,
				stacked: true,
				gridLines: {
					display: false
				}

			}]
		},
	};

	public openAndStockBarChartLabels: string[] = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
	public openAndStockBarChartType: string = "bar";
	public openAndStockBarChartLegend: boolean = true;
	public openAndStockBarChartData: any[] = [
		{ data: [25, 38, 40, 47, 30, 20, 10], label: "Rapeseed", datalabels: { align: "center", anchor: "center" } },
		{ data: [-20, -30, -40, -30, -20, -15, -5], label: "Rapemeal", datalabels: { align: "center", anchor: "center" } },
		{ data: [10, 15, 30, 20, 10, 15, 5], label: "Rapeseed Oil", datalabels: { align: "center", anchor: "center" } }
	];

	//activity
	public activityBarChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: false,
		tooltips: false,
		events: ["click"],
		legend: { display: false },
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}
		},
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				},
				display: false
			}],
			xAxes: [{
				display: false,

			}]
		},
		animation: {
			onComplete: function () {
				var chartInstance = this.chart;
				var ctx = chartInstance.ctx;
				var height = chartInstance.controller.boxes[0].bottom;
				ctx.font = "70px Roboto";
				ctx.textAlign = "center";
				ctx.fillStyle = "#ffffff";
				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach(function (bar, index) {
						ctx.fillText(dataset.data[index], bar._model.x, height - ((height - bar._model.y) / 2) - 10);
					}), this);
				}), this);
				var ctxLabel = chartInstance.ctx;
				ctxLabel.font = "13px Roboto";
				ctxLabel.textAlign = "center";
				ctxLabel.fillStyle = "#ffffff";

				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach(function (bar, index) {

						ctxLabel.fillText(bar._model.datasetLabel, bar._model.x, height - ((height - bar._model.y) / 2) - 75);

					}), this);
				}), this);
			}
		}
	};

	public activityBarChartLabels: string[] = ['MissingInvoices'];
	public activityBarChartType: string = 'bar';
	public activityBarChartLegend: boolean = true;
	public activityBarChartData: any[] = [
		{ data: [250], label: 'New Trades', datalabels: { align: 'center', anchor: 'center' } },
		{ data: [204], label: 'Trades amended', datalabels: { align: 'center', anchor: 'center' } }
	];
	public contracts = [
		{ text: '98', cols: 1, rows: 1, fontColor: 'rgba(151, 177, 80, 1)', color: '#ffffff' }
	];

	public actions = [
		{ text: '7', cols: 1, rows: 1, fontColor: '#ffffff', color: 'rgba(55, 154, 141, 1)' },
		{ text: '25', cols: 1, rows: 1, fontColor: '#ffffff', color: 'rgba(151, 177, 80, 1)' },
		{ text: '20', cols: 1, rows: 1, fontColor: '#ffffff', color: 'rgba(94, 105, 158, 1)' },
		{ text: '15', cols: 1, rows: 1, fontColor: '#ffffff', color: 'rgba(93, 74, 95, 1)' },
	];
	public program = [
		{ text: 'Port', cols: 1, rows: 1, color: '#5d4a5f', fontColor: '#ffffff' },
		{ text: 'Jan', cols: 1, rows: 1, color: '#003300', fontColor: '#ffffff' },
		{ text: 'Feb', cols: 1, rows: 1, color: '#003300', fontColor: '#ffffff' },
		{ text: 'Mar', cols: 1, rows: 1, color: '#003300', fontColor: '#ffffff' },
		{ text: 'Apr', cols: 1, rows: 1, color: '#003300', fontColor: '#ffffff' },
		{ text: 'May', cols: 1, rows: 1, color: '#003300', fontColor: '#ffffff' },

		{ text: 'Odessa', cols: 1, rows: 1, color: '#5d4a5f', fontColor: '#ffffff' },
		{ text: '24 MT', cols: 1, rows: 1, color: '#d7ebe8', fontColor: '#000000' },
		{ text: '39 MT', cols: 1, rows: 1, color: '#b1d8d3', fontColor: '#000000' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
		{ text: '20 MT', cols: 1, rows: 1, color: '#d7ebe8', fontColor: '#000000' },

		{ text: 'Yuzhny', cols: 1, rows: 1, color: '#5d4a5f', fontColor: '#ffffff' },
		{ text: '24 MT', cols: 1, rows: 1, color: '#d7ebe8', fontColor: '#000000' },
		{ text: '39 MT', cols: 1, rows: 1, color: '#b1d8d3', fontColor: '#000000' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
		{ text: '20 MT', cols: 1, rows: 1, color: '#d7ebe8', fontColor: '#000000' },

		{ text: 'Novo', cols: 1, rows: 1, color: '#5d4a5f', fontColor: '#ffffff' },
		{ text: '20 MT', cols: 1, rows: 1, color: '#d7ebe8', fontColor: '#000000' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
		{ text: '39 MT', cols: 1, rows: 1, color: '#b1d8d3', fontColor: '#000000' },
		{ text: '39 MT', cols: 1, rows: 1, color: '#b1d8d3', fontColor: '#000000' },

		{ text: 'Kavkaz', cols: 1, rows: 1, color: '#5d4a5f', fontColor: '#ffffff' },
		{ text: '20 MT', cols: 1, rows: 1, color: '#d7ebe8', fontColor: '#000000' },
		{ text: '39 MT', cols: 1, rows: 1, color: '#b1d8d3', fontColor: '#000000' },
		{ text: '39 MT', cols: 1, rows: 1, color: '#b1d8d3', fontColor: '#000000' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
		{ text: '50 MT', cols: 1, rows: 1, color: '#379a8d', fontColor: '#ffffff' },
	];

	// events
	public chartClicked(e: any): void {
		this.snackBar.open('This feature is under development...coming soon', '', {
			duration: 4000,
			verticalPosition: 'top',
		});
	}

	public chartHovered(e: any): void {
	}

}
