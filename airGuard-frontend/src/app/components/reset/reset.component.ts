import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Address } from 'src/app/common/address';
import { Token } from 'src/app/common/token';
import { User } from 'src/app/common/user';
import { AddressService } from 'src/app/services/address.service';
import { AuthService } from 'src/app/services/auth.service';
import { QualityDataService } from 'src/app/services/quality-data.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  address!: Address[];
  selectedAddress!: Address;
  username: string = "";
  password: string = "";
  user: User = new User;
  token: Token = new Token;

  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(private authService: AuthService,
    private addressService: AddressService) { }
  ngOnInit(): void {
    this.addressService.getAll().subscribe(
      data => {
        this.address = data
        this.selectedAddress = data[0];
      })
  }
  /**
   * Try to login, if it is logged in, it deletes all the data from db and shows a success message
   *               if not, it shows a fail message
   */
  onSubmit() {
    console.log(this.username);
    console.log(this.password);

    this.user.username = this.username;
    this.user.password = this.password;

    this.authService.login(this.user).subscribe({
      next: (data) => {
        this.token = data;
        console.log(this.token.token)
        this.authService.reset(this.token.token, this.selectedAddress._id).subscribe({
          next: (data) => {
            this.showSuccessMessage = true;
            this.showErrorMessage = false;
          }
        })
      },
      error: (error) => {
        console.log(error);
        this.showErrorMessage = true;
        this.showSuccessMessage = false;
      }
    })

  }

  /**
  * Select address function
  */

  selectAddress(selected: Address) {
    this.selectedAddress = selected;
  }
}
