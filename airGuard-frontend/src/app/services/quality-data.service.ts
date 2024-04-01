import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QualityData } from '../common/quality-data';

@Injectable({
  providedIn: 'root'
})
export class QualityDataService {

  getDataUrl: string = "http://localhost:3000/api/v1/data";

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<QualityData[]> {
    return this.httpClient.get<GetDataResponse>(this.getDataUrl).pipe(
      map(data => data.message)
    )
  }

  getDataForAddress(id: String): Observable<QualityData[]> {
    return this.httpClient.get<GetDataResponse>(`${this.getDataUrl}/${id}`).pipe(
      map(data => data.message)
    )
  }
  /**
   * 
   * @param startDate start of the interval we want to receive information
   * @param endDate end of the interval 
   * @returns QualityData array
   */
  getDataWithFilter(addressId: String,startDate: Date, endDate: Date): Observable<QualityData[]> {
    return this.httpClient.get<GetDataResponse>(`${this.getDataUrl}/${addressId}?startDate=${startDate}&endDate=${endDate}`).pipe(
      map(data => data.message)
    )
  }
}


interface GetDataResponse{ 
  message:QualityData[]
}