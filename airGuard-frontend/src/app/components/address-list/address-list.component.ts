import { Component, OnInit } from '@angular/core';
import { Address } from 'src/app/common/address';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {

  addresses!: Address[];
  room: String = '';
  location: String = '';
  formAddress: Address = new Address;
  constructor(private addressService: AddressService) { }

  ngOnInit(): void {
    this.addressService.getAll().subscribe(
      data => this.addresses = data
    );
  }

  onSubmit() {
    this.formAddress.location = this.location;
    this.formAddress.room = this.room;

    this.addressService.save(this.formAddress).subscribe({
      next: (data) => {
        console.log("Address saved", data);
        //init the list again
        this.addressService.getAll().subscribe(
          data => this.addresses = data
        );
        this.room = '';
        this.location = '';
      },
      error: (error) => {
        console.log("Failed to save", error);
      }
    })
  }

  deleteAddress(id: String){
    this.addressService.delete(id).subscribe({
      next: (data) => {
        console.log("Address deleted");
        this.addressService.getAll().subscribe(
          data => this.addresses = data
        );
      },
      error: (error) => {
        console.log("Failed to delete", error);
      }
    })
  }
}
