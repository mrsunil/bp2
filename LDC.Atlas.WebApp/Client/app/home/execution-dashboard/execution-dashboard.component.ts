import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Chart } from "chart.js";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "atr-execution-dashboard",
	templateUrl: "./execution-dashboard.component.html",
	styleUrls: ["./execution-dashboard.component.scss"]
})
export class ExecutionDashboardComponent implements OnInit {
    company: string;
    constructor(private router: Router,
		private route : ActivatedRoute,
        private snackBar: MatSnackBar) {
        this.company = this.route.snapshot.paramMap.get("company");

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
		{ // grey
			backgroundColor: "rgba(148,159,177,0.2)",
			borderColor: "rgba(148,159,177,1)",
			pointBackgroundColor: "rgba(148,159,177,1)",
			pointBorderColor: "#fff",
			pointHoverBackgroundColor: "#fff",
			pointHoverBorderColor: "rgba(148,159,177,0.8)"
		}
	];

	//missing invoices
	public barChartOptions: any = {
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
				ctx.font = "48px Roboto";
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
					Chart.helpers.each(meta.data.forEach((bar, index) => {
						ctxLabel.fillText(bar._model.datasetLabel, bar._model.x, height - ((height - bar._model.y) / 2) - 55);
					}), this);
				}), this);
			}
		}
	};

	public barChartLabels: string[] = ["MissingInvoices"];
	public barChartType: string = "bar";
	public barChartLegend: boolean = true;
	public barChartData: any[] = [
		{ data: [125], backgroundColor: "#36A2EB", label: "Purchases", datalabels: { align: "center", anchor: "center" } },
		{ data: [90], backgroundColor: "#FF3784", label: "Sales", datalabels: { align: "center", anchor: "center" } }
	];

	//washouts
	public washoutsBarChartOptions: any = {
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
				},
				//position: "top",
				//scaleLabel: {
				//	display: true,
				//	labelString: "MT",
				//	fontFamily: "Roboto",
				//	fontColor: "black",
				//},
			}],
			xAxes: [{
				display: true,
				stacked: true,
				gridLines: {
					display: false
				},
				//position: "right",
				//scaleLabel: {
				//	display: true,
				//	labelString: "Month",
				//	fontFamily: "Roboto",
				//	fontColor: "black",
				//},

			}]
		},
	};

	public washoutsBarChartLabels: string[] = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
	public washoutsBarChartType: string = "bar";
	public washoutsBarChartLegend: boolean = true;
	public washoutsBarChartData: any[] = [
		{ data: [25, 38, 40, 47, 30, 20, 10], label: "Purchases", datalabels: { align: "center", anchor: "center" } },
		{ data: [-20, -30, -40, -30, -20, -15, -5], label: "Sales", datalabels: { align: "center", anchor: "center" } }
	];

	//open position
	public openPositionsBarChartOptions: any = {
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
					beginAtZero: true,
					mirror: true
				},
				display: false
			}],
			xAxes: [{
				display: true,

			}]
		},
		animation: {
			onComplete: function () {
				var chartInstance = this.chart;
				var ctx = this.chart.ctx;
				ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, "normal", Chart.defaults.global.defaultFontFamily);
				ctx.textAlign = "left";
				ctx.textBaseline = "bottom";
			}
		}
	};

	public openPositionsBarChartLabels: string[] = ["Purchase", "Sales", "Inventory"];
	public openPositionsBarChartType: string = "horizontalBar";
	public openPositionsBarChartLegend: boolean = true;
	public openPositionsBarChartData: any[] = [
		{
			data: [125, -55, 18],
			backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
			label: "Open-Positions",
			datalabels: { align: "center", anchor: "center" }
		}
	];

	//trades to fix invoices
	public tradeToFixChartOptions: any = {
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
				gridLines: {
					display: false
				}
			}],
			xAxes: [{
				display: true,
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
				ctx.fillStyle = "#ffffff";
				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach(function (bar, index) {
						ctx.fillText(dataset.data[index], bar._model.x, height - ((height - bar._model.y)) + 20);
					}), this);
				}), this);
			}
		}
	};

	public tradeToFixChartLabels: string[] = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
	public tradeToFixChartType: string = "bar";
	public tradeToFixChartLegend: boolean = true;
	public tradeToFixChartData: any[] = [
		{ data: [250, 380, 400, 470, 500, 596, 602], label: "tradesToFix", datalabels: { align: "center", anchor: "center" } }
	];

	//charters
	public chartersBarChartOptions: any = {
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
				ctx.font = "28px Roboto";
				ctx.textAlign = "center";
				ctx.fillStyle = "#ffffff";
				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach((bar, index) => {
						ctx.fillText(dataset.data[index] + "k $", bar._model.x, height - ((height - bar._model.y) / 2) - 10);
					}), this);
				}), this);
				var ctxLabel = chartInstance.ctx;
				ctxLabel.font = "10px Roboto";
				ctxLabel.textAlign = "center";
				ctxLabel.fillStyle = "#ffffff";

				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach((bar, index) => {
						ctxLabel.fillText(bar._model.datasetLabel, bar._model.x, height - ((height - bar._model.y) / 2) - 45);
					}), this);
				}), this);
			}
		}
	};

	public chartersBarChartLabels: string[] = ["MissingInvoices"];
	public chartersBarChartType: string = "bar";
	public chartersBarChartLegend: boolean = true;
	public chartersBarChartData: any[] = [
		{ data: [140], label: "Accruals Payable", datalabels: { align: "center", anchor: "center" } },
		{ data: [120], label: "Accruals Receivable", datalabels: { align: "center", anchor: "center" } }
	];

	//Contract Management
	public contractManagementBarChartOptions: any = {
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
				ctx.fillStyle = "#305670";
				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach((bar, index) => {
						ctx.fillText(dataset.data[index], bar._model.x, height - ((height - bar._model.y) / 2) - 10);
					}), this);
				}), this);
				var ctxLabel = chartInstance.ctx;
				ctxLabel.font = "10px Roboto";
				ctxLabel.textAlign = "center";
				ctxLabel.fillStyle = "#990304";

				Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					Chart.helpers.each(meta.data.forEach((bar, index) => {
						ctxLabel.fillText(bar._model.datasetLabel, bar._model.x, height - ((height - bar._model.y) / 2) - 75);
					}), this);
				}), this);
			}
		}
	};

	public contractManagementBarChartLabels: string[] = ["MissingInvoices"];
	public contractManagementBarChartType: string = "bar";
	public contractManagementBarChartLegend: boolean = true;
	public contractManagementBarChartData: any[] = [
		{ data: [56], label: "Pending documentation", datalabels: { align: "center", anchor: "center" } },
		{ data: [34], label: "Ready to be closed", datalabels: { align: "center", anchor: "center" } }
	];


	// events
	public missingInvoicesChartClicked(e: any): void {
		if (e.active.length > 0) {
			var chartElement = e.active[0]._chart.getElementAtEvent(event);
			var dataSetSelectedLabel = chartElement[0]._model.datasetLabel;
			this.router.navigate(["/"+ this.company +"/execution/invoicing/missinginvoices/dealtype/" + dataSetSelectedLabel]);
		}
		else {
			this.goToMissingInvoices();
		}
	}
	public goToMissingInvoices() {
		this.router.navigate(["/" + this.company +"/execution/invoicing/missinginvoices"]);
	}

	public chartClicked(e: any): void {
		this.snackBar.open("This feature is under development...coming soon", "", {
			duration: 4000,
			verticalPosition: "top"
		});
	}

	public chartHovered(e: any): void {
	}

	ngOnInit() {
		Chart.helpers.merge(Chart.defaults.global, {
			aspectRatio: 4 / 3,
			tooltips: false,
			layout: {
				padding: {
					top: 42,
					right: 16,
					bottom: 32,
					left: 8
				}
			},
			elements: {
				line: {
					fill: false
				},
				point: {
					hoverRadius: 7,
					radius: 5
				}
			},
			plugins: {
				legend: false,
				title: false
			}
		});
	}
}
