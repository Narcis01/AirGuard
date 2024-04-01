import { Component, OnInit } from '@angular/core';
import { QualityDataService } from 'src/app/services/quality-data.service';
import { QualityData } from 'src/app/common/quality-data';
import { Address } from 'src/app/common/address';
import { AddressService } from 'src/app/services/address.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  address!: Address[];
  selectedAddress!: Address;
  yearSelected: number = 2024;
  data!: QualityData[];
  avTemp: number = 0;
  avCo2: number = 0;
  avDust: number = 0;
  avLight: number = 0;
  avHumidity: number = 0;
  constructor(private qualityService: QualityDataService,
    private addressService: AddressService) { }

  ngOnInit(): void {
    this.addressService.getAll().subscribe(
      data => {
        this.address = data
        this.selectedAddress = data[0];

        let startDate = new Date('2024-01-01');
        let endDate = new Date('2024-12-31');
        this.qualityService.getDataWithFilter(this.selectedAddress._id, startDate, endDate).subscribe(
          data => {
            this.data = data
            this.calculateAverage(this.data);
          }
        );
      }
    )


  }

  /**
   * Get data for the selected year
   * @param year - the year we want statistics about
   */
  selectYear(year: number) {
    this.yearSelected = year;
    let startDate = new Date(`${year}-01-01`);
    let endDate = new Date(`${year}-12-31`);
    this.qualityService.getDataWithFilter(this.selectedAddress._id, startDate, endDate).subscribe(
      data => {
        this.data = data
        this.calculateAverage(this.data);
      }
    );
  }

  /**
   * Ths method calculates the average for all the params
   * @param data - array of data from current year
   */
  calculateAverage(data: QualityData[]) {
    if (data.length > 0) {
      this.avTemp = data.map(item => item.temperature).reduce((sum, current) => sum + current) / data.length;
      this.avCo2 = data.map(item => item.co2).reduce((sum, current) => sum + current) / data.length;
      this.avDust = data.map(item => item.dust).reduce((sum, current) => sum + current) / data.length;
      this.avLight = data.map(item => item.light).reduce((sum, current) => sum + current) / data.length;
      this.avHumidity = data.map(item => item.humidity).reduce((sum, current) => sum + current) / data.length;
    } else {
      this.avCo2 = 0;
      this.avDust = 0;
      this.avHumidity = 0;
      this.avTemp = 0;
      this.avLight = 0;
    }
  }

  /**
   * Select address function
   */

  selectAddress(selected: Address) {
    this.selectedAddress = selected;
    this.qualityService.getDataForAddress(selected._id).subscribe(
      data => {
        this.data = data;
        this.calculateAverage(this.data);
      }
    );
  }
}
