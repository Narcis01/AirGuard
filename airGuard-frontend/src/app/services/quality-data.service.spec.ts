import { TestBed } from '@angular/core/testing';

import { QualityDataService } from './quality-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('QualityDataService', () => {
  let service: QualityDataService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        QualityDataService
      ]
    });
    service = TestBed.inject(QualityDataService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve data', () => {
    service.getData().subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response.length).toBe(2);
      });


    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/data');
    expect(req.request.method).toEqual('GET');
    req.flush({
      message: [
        {
          temperature: 10,
          humidity: 11,
          co2: 12,
          light: 12,
          dust: 23
        },
        {
          temperature: 20,
          humidity: 21,
          co2: 22,
          light: 12,
          dust: 23
        }
      ]})

  })
  it('should retrive data in a range', () => {
    let addressId = "fake_id";
    service.getDataWithFilter(addressId,new Date('2023-12-12'), new Date('2023-12-14')).subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response.length).toBe(2);
      });


    const req = httpTestingController.expectOne(`http://localhost:3000/api/v1/data/fake_id?startDate=${new Date('2023-12-12')}&endDate=${new Date('2023-12-14')}`);
    expect(req.request.method).toEqual('GET');
    req.flush({
      message: [
        {
          temperature: 10,
          humidity: 11,
          co2: 12,
          light: 12,
          dust: 23,
          date: "2023-12-13T08:26:43.115Z"
        },
        {
          temperature: 20,
          humidity: 21,
          co2: 22,
          light: 12,
          dust: 23,
          date: "2023-12-13T08:26:43.115Z"

        }
      ]})
  })
});
