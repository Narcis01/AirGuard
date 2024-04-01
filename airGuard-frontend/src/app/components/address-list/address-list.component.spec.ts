import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressListComponent } from './address-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddressService } from 'src/app/services/address.service';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { Address } from 'src/app/common/address';

describe('AddressListComponent', () => {
  let component: AddressListComponent;
  let fixture: ComponentFixture<AddressListComponent>;
  let el: DebugElement;
  let addressService: any;

  beforeEach(() => {
    const addressServiceSpy = jasmine.createSpyObj('AddressService', ['save', 'delete', 'getAll']);
    TestBed.configureTestingModule({
      declarations: [AddressListComponent],
      imports: [HttpClientTestingModule],
      providers: [{provide: AddressService, useValue: addressServiceSpy}]
    });
    fixture = TestBed.createComponent(AddressListComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    addressService = TestBed.inject(AddressService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form data', () => {
    const addressStub: Address = { _id: '1', location: 'location', room: 'room' };
    const addressListStub: Address[] = [{_id: '1', location: 'location', room: 'room'}, {_id: '2', location: 'location', room: 'room'}]
    addressService.save.and.returnValue(of(addressStub));
    addressService.getAll.and.returnValue(of(addressListStub));
    component.location = 'location';
    component.room = 'room';
    component.onSubmit();

    expect(addressService.save).toHaveBeenCalledWith(component.formAddress);
    expect(component.location).toEqual('');
    expect(component.room).toEqual('');
  });

  it('should delete address', () => {
    const mockAddressId = '1';
    const addressListStub: Address[] = [{_id: '1', location: 'location', room: 'room'}, {_id: '2', location: 'location', room: 'room'}]
    addressService.delete.and.returnValue(of({message: "Address deleted"}));
    addressService.getAll.and.returnValue(of(addressListStub));
    component.deleteAddress(mockAddressId);

    expect(addressService.delete).toHaveBeenCalledWith(mockAddressId);
  });
});
