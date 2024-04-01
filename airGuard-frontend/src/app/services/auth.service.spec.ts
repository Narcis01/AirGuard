import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../common/user';

describe('AuthService', () => {
  let service: AuthService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', () => {
    service.login(new User)
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(response).toEqual({ token: "token" })
      });

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/login');
    expect(req.request.method).toEqual("POST");
    req.flush({ token: "token" });
  })

  it('should reset', () => {
    let token = "fake_token";
    let addressId = "fake_id";
    service.reset(token, addressId)
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(response).toEqual("reset with success")
      })

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/reset/fake_id');
    expect(req.request.method).toEqual('GET');

    req.flush('reset with success')
  })

});
