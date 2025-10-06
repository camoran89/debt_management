import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.authForm.get('username')?.value).toBe('');
    expect(component.authForm.get('password')?.value).toBe('');
  });

  it('should start in login mode', () => {
    expect(component.isLoginMode).toBe(true);
  });

  it('should toggle between login and register modes', () => {
    component.toggleMode();
    expect(component.isLoginMode).toBe(false);
    
    component.toggleMode();
    expect(component.isLoginMode).toBe(true);
  });

  it('should reset form when toggling mode', () => {
    component.authForm.patchValue({ username: 'test', password: 'test' });
    component.toggleMode();
    expect(component.authForm.get('username')?.value).toBe(null);
    expect(component.authForm.get('password')?.value).toBe(null);
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should call login service when in login mode and form is valid', () => {
    mockAuthService.login.and.returnValue(of({ access_token: 'test-token' }));
    
    component.authForm.patchValue({ username: 'testuser', password: 'testpass' });
    component.isLoginMode = true;
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'testpass');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debts']);
  });

  it('should call register service when in register mode and form is valid', () => {
    mockAuthService.register.and.returnValue(of({}));
    
    component.authForm.patchValue({ username: 'testuser', password: 'testpass' });
    component.isLoginMode = false;
    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith('testuser', 'testpass');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debts']);
  });

  it('should handle authentication error', () => {
    mockAuthService.login.and.returnValue(throwError(() => new Error('Auth error')));
    spyOn(console, 'error');
    
    component.authForm.patchValue({ username: 'testuser', password: 'testpass' });
    component.onSubmit();

    expect(component.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Authentication error:', jasmine.any(Error));
  });

  it('should set loading state during authentication', () => {
    mockAuthService.login.and.returnValue(of({ access_token: 'test-token' }));
    
    component.authForm.patchValue({ username: 'testuser', password: 'testpass' });
    component.onSubmit();

    expect(component.loading).toBe(false); // Should be false after success
  });

  it('should validate required fields', () => {
    const usernameControl = component.authForm.get('username');
    const passwordControl = component.authForm.get('password');

    expect(usernameControl?.hasError('required')).toBe(true);
    expect(passwordControl?.hasError('required')).toBe(true);

    usernameControl?.setValue('test');
    passwordControl?.setValue('test');

    expect(usernameControl?.hasError('required')).toBe(false);
    expect(passwordControl?.hasError('required')).toBe(false);
  });
});
