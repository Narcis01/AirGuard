import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResetComponent } from './reset.component';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';

describe('ResetComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;
  let el: DebugElement;
  let authService: any;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'reset'])

    TestBed.configureTestingModule({
      declarations: [ResetComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ResetComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      authService = TestBed.inject(AuthService);
    });

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass with correct username and password', () => {
    authService.login.and.returnValue(of({ token: 'fake_token' }));
    authService.reset.and.returnValue(of({ messge: 'reset' }));

    expect(component.showErrorMessage).toBe(false);
    expect(component.showSuccessMessage).toBe(false);
    component.selectedAddress = { _id: "id", location: " ", room: " " }
    component.onSubmit();

    expect(component.showErrorMessage).toBe(false);
    expect(component.showSuccessMessage).toBe(true);


  })

  it('should fail with wrong username and password', () => {
    authService.login.and.returnValue(throwError(() => new Error("Login error")));

    expect(component.showErrorMessage).toBe(false);
    expect(component.showSuccessMessage).toBe(false);
    component.onSubmit();

    expect(component.showErrorMessage).toBe(true);
    expect(component.showSuccessMessage).toBe(false);

  })
});


