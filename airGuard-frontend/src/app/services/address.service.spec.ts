import { TestBed } from '@angular/core/testing';

import { AddressService } from './address.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Address } from '../common/address';

describe('AddressService', () => {
  let service: AddressService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AddressService
      ]
    });
    service = TestBed.inject(AddressService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all addresses', () => {
    service.getAll().subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response.length).toBe(2);
      });

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/address/getAll');
    expect(req.request.method).toEqual('GET');
    req.flush({
      data: [
        {
          location: "loc1",
          room: "rom1",
          _id: "1"
        },
        {
          location: "loc2",
          room: "rom2",
          _id: "2"
        }
      ]
    })
  });

  it('should save an address', () => {
    let address: Address = new Address;
    service.save(address).subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response.address).toBeDefined();
      } 
    )

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/address/create');
    expect(req.request.method).toEqual('POST');
    req.flush({
      address: {
        location: "location",
        room: "room",
        _id: "1"
      }
    })
  });

  it('should delete an address', () => {
    const id = "1";
    service.delete(id).subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response).toEqual({message: "Address deleted"})
      }
    )

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/address/delete/1');
    expect(req.request.method).toEqual('DELETE');
    req.flush(
      {
        message: "Address deleted"
      }
    )
  })
});
