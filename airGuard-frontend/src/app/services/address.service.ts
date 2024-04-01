import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Address } from '../common/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient:HttpClient) { }

  getAddressUrl:String = "http://localhost:3000/api/v1/address/getAll";
  postAddressUrl: String = "http://localhost:3000/api/v1/address/create";
  deleteAddressUrl: String = "http://localhost:3000/api/v1/address/delete"

  getAll(): Observable<Address[]> {
    return this.httpClient.get<GetAddressResponse>(`${this.getAddressUrl}`).pipe(
      map(data => data.data)
    )
  }

  save(address: Address): Observable<any>{
    return this.httpClient.post(`${this.postAddressUrl}` ,address);
  }

  delete(id: String): Observable<any>{
    return this.httpClient.delete(`${this.deleteAddressUrl}/${id}`);
  }

}

interface GetAddressResponse{
  data:Address[]
}