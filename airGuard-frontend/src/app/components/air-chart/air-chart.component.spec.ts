import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AirChartComponent } from './air-chart.component';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { QualityDataService } from 'src/app/services/quality-data.service';
import { AddressService } from 'src/app/services/address.service';

describe('AirChartComponent', () => {
  let component: AirChartComponent;
  let fixture: ComponentFixture<AirChartComponent>;
  let el: DebugElement;
  let qualityDataService: any;
  let addressService: any;
  beforeEach(waitForAsync(() => {
    const qualityDataServiceSpy = jasmine.createSpyObj('QualityDataService', ['getData', 'getDataWithFilter']);
    const addressServiceSpy = jasmine.createSpyObj('AddressService', ['getAll'])
    TestBed.configureTestingModule({
      declarations: [AirChartComponent],
      imports: [HttpClientTestingModule, CanvasJSAngularChartsModule],
      providers: [{provide: QualityDataService, useValue: qualityDataServiceSpy},
                  {provide: AddressService, useValue: addressServiceSpy}]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AirChartComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        qualityDataService = TestBed.inject(QualityDataService);
        addressService = TestBed.inject(AddressService)
      })
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data from service and init the charts', () => {
    let dataStub = [{ temperature: 25, co2: 400, humidity: 50, light: 1000, dust: 10 },
    { temperature: 20, co2: 500, humidity: 40, light: 700, dust: 5 }];
    let addressStub = [{ _id:"23", location: " ", room: " " }]
    qualityDataService.getData.and.returnValue(of(dataStub));
    qualityDataService.getDataWithFilter.and.returnValue(of(dataStub));
    addressService.getAll.and.returnValue(of(addressStub))
    fixture.detectChanges();

    const charts = el.queryAll(By.css('canvasjs-chart'));

    expect(charts.length).toBe(5);

    const temperatures = charts[0].componentInstance.options.data[0].dataPoints.map((point: any) => point.y);
    expect(temperatures[0]).toEqual(25);
    expect(temperatures[1]).toEqual(20);
  })
});
