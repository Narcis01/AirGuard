import { Component, OnInit, inject } from '@angular/core';
import { QualityData } from 'src/app/common/quality-data';
import { QualityDataService } from 'src/app/services/quality-data.service';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AddressService } from 'src/app/services/address.service';
import { Address } from 'src/app/common/address';


@Component({
	selector: 'app-air-chart',
	templateUrl: './air-chart.component.html',
	styleUrls: ['./air-chart.component.css'],
})
export class AirChartComponent implements OnInit {
	data!: QualityData[];
	address!: Address[];
	selectedAddress!: Address;
	temperatureChart: any = {};
	hydrogenChart: any = {};
	humidityChart: any = {};
	lightChart: any = {};
	dustChart: any = {};
	interval: any;
	calendar = inject(NgbCalendar);
	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);

	showLegendBool: boolean = false;
	showFilterBool: boolean = false;



	startDate = new Date();
	endDate = new Date();
	constructor(private qualityService: QualityDataService,
		private addressService: AddressService) { }

	ngOnInit(): void {

		/**
		 * Init addresses
		 */
		this.addressService.getAll().subscribe(
			data => {
				console.log(data);
				this.address = data;
				this.selectedAddress = data[0];
				/**
		 		* Get the data and init the charts
		 		*/

				this.startDate.setHours(0, 0, 0, 0);
				this.qualityService.getDataWithFilter(this.selectedAddress._id, this.startDate, this.endDate).subscribe(
					data => {
						this.data = data;
						this.initCharts();
					}
				);
			}

		);


		/**
		 * Update the charts every 5 seconds
		 */
		this.interval = setInterval(() => {
			// condition to not interrupt if you selected a range of dates
			if (!this.showFilterBool && !this.showLegendBool) {
				this.qualityService.getDataWithFilter(this.selectedAddress._id, this.startDate, this.endDate).subscribe(
					data => {
						this.data = data;
						this.initCharts();
					}
				);
			}
		}, 5000)
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}

	closeFilter() {
		this.showFilterBool = false;
	}
	closeLegend() {
		this.showLegendBool = false;
	}
	showLegend() {
		this.showLegendBool = true;
	}
	showFilter() {
		this.showFilterBool = true;
	}
	/**
	 * Select address function
	 */

	selectAddress(selected: Address) {
		this.selectedAddress = selected;
		this.qualityService.getDataWithFilter(selected._id, this.startDate, this.endDate).subscribe(
			data => {
				this.data = data;
				this.initCharts();
			}
		);
	}

	/**
	 * Show information for the selected interval of dates
	 */
	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
		console.log(this.fromDate);
		console.log(this.toDate);

		let startDate = new Date(`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`);
		if (this.toDate) {
			let endDate = new Date(`${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`);
			this.qualityService.getDataWithFilter(this.selectedAddress._id, startDate, endDate).subscribe(
				data => {
					this.data = data;
					this.initCharts();
				}
			)
		}
	}

	submitDate() {
		this.initCharts();
	}
	/**
	 * Reset the filter
	 */
	resetFilter() {
		let startDate = new Date();
		startDate.setHours(0, 0, 0, 0)
		let endDate = new Date();
		this.qualityService.getDataWithFilter("", startDate, endDate).subscribe(
			data => {
				this.data = data;
				this.initCharts();
			}
		);
		this.initCharts();
	}
	/**
	 * Setup for calendar 
	 */
	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}
	/**
	 * This method populates the charts 
	 * We can not make it simpler because the charts would not work
	 */
	initCharts() {
		console.log(this.data);
		this.temperatureChart = {
			animationEnabled: true,
			theme: "dark2",
			title: {
				text: "Temperature"
			},
			axisX: {
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "Celsius",
				crosshair: {
					enabled: true
				}
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "bottom",
				horizontalAlign: "right",
				dockInsidePlotArea: true,
				itemclick: function (e: any) {
					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
						e.dataSeries.visible = false;
					} else {
						e.dataSeries.visible = true;
					}
					e.chart.render();
				}
			},
			data: [
				{
					type: "line",
					color: "red",
					//showInLegend: true,
					name: "",
					lineDashType: "line",
					dataPoints: this.data.map(item => ({ x: new Date(item.date), y: item.temperature }))
				}]
		};
		this.hydrogenChart = {
			animationEnabled: true,
			theme: "dark2",
			title: {
				text: "Hydrogen"
			},
			axisX: {
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "ppm",
				crosshair: {
					enabled: true
				}
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "bottom",
				horizontalAlign: "right",
				dockInsidePlotArea: true,
				itemclick: function (e: any) {
					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
						e.dataSeries.visible = false;
					} else {
						e.dataSeries.visible = true;
					}
					e.chart.render();
				}
			},
			data: [
				{
					type: "line",
					color: "orange",
					//showInLegend: true,
					name: "",
					lineDashType: "line",
					dataPoints: this.data.map(item => ({ x: new Date(item.date), y: item.co2 }))
				}]
		};

		this.humidityChart = {
			animationEnabled: true,
			theme: "dark2",
			title: {
				text: "Humidity"
			},
			axisX: {
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "%",
				crosshair: {
					enabled: true
				}
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "bottom",
				horizontalAlign: "right",
				dockInsidePlotArea: true,
				itemclick: function (e: any) {
					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
						e.dataSeries.visible = false;
					} else {
						e.dataSeries.visible = true;
					}
					e.chart.render();
				}
			},
			data: [
				{
					type: "line",
					color: "lime",
					//showInLegend: true,
					name: "",
					lineDashType: "line",
					dataPoints: this.data.map(item => ({ x: new Date(item.date), y: item.humidity }))
				}]
		};

		this.lightChart = {
			animationEnabled: true,
			theme: "dark2",
			title: {
				text: "Light"
			},
			axisX: {
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "LUX",
				crosshair: {
					enabled: true
				}
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "bottom",
				horizontalAlign: "right",
				dockInsidePlotArea: true,
				itemclick: function (e: any) {
					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
						e.dataSeries.visible = false;
					} else {
						e.dataSeries.visible = true;
					}
					e.chart.render();
				}
			},
			data: [
				{
					type: "line",
					color: "yellow",
					//showInLegend: true,
					name: "",
					lineDashType: "line",
					dataPoints: this.data.map(item => ({ x: new Date(item.date), y: item.light }))
				}]
		};

		this.dustChart = {
			animationEnabled: true,
			theme: "dark2",
			title: {
				text: "Dust"
			},
			axisX: {
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "grams/m3",
				crosshair: {
					enabled: true
				}
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "bottom",
				horizontalAlign: "right",
				dockInsidePlotArea: true,
				itemclick: function (e: any) {
					if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
						e.dataSeries.visible = false;
					} else {
						e.dataSeries.visible = true;
					}
					e.chart.render();
				}
			},
			data: [
				{
					type: "line",
					color: "dodgerblue",
					//showInLegend: true,
					name: "",
					lineDashType: "line",
					dataPoints: this.data.map(item => ({ x: new Date(item.date), y: item.dust }))
				}]
		}
	}

}
