import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatisticsComponent } from './statistics.component';
import { DebugElement } from '@angular/core';
import { QualityDataService } from 'src/app/services/quality-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { QualityData } from 'src/app/common/quality-data';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let el: DebugElement;
  let qualityService: any;
  beforeEach(waitForAsync(() => {
    const qualityServiceSpy = jasmine.createSpyObj('QualityDataService', ['getDataWithFilter']);
    TestBed.configureTestingModule({
      declarations: [StatisticsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: QualityDataService, useValue: qualityServiceSpy }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      qualityService = TestBed.inject(QualityDataService)
    });

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the average value correctly', () => {
    let dataStub: QualityData[] = [
      { co2: 3, dust: 3, humidity: 3, temperature: 3, light: 3, date: new Date },
      { co2: 5, dust: 5, humidity: 5, temperature: 5, light: 5, date: new Date },
      { co2: 7, dust: 7, humidity: 7, temperature: 7, light: 7, date: new Date }];

    qualityService.getDataWithFilter.and.returnValue(of(dataStub));

    component.calculateAverage(dataStub);

    expect(component.avCo2).toBe(5);
    expect(component.avTemp).toBe(5);
    expect(component.avDust).toBe(5);
    expect(component.avHumidity).toBe(5);
    expect(component.avLight).toBe(5);

  })
});
