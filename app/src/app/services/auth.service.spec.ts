import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { AuthResponse, User } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.keH6T3x1z7mmhKL1T3r09-sg_5FJAgkKmU5oqC1En6I';
  
  const mockAuthResponse: AuthResponse = {
    access_token: mockToken
  };

  const mockUser: User = {
    id: 1,
    username: 'testuser'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and store token', (done) => {
      service.login('testuser', 'password').subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(localStorage.getItem('debt_management_token')).toBe(mockToken);
        
        // Check that currentUser$ emits the user
        service.currentUser$.subscribe(user => {
          expect(user).toEqual(mockUser);
          done();
        });
      });

      const req = httpMock.expectOne('http://debt.local/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });
      req.flush(mockAuthResponse);
    });

    it('should handle login error', () => {
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.login('testuser', 'wrong').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/auth/login');
      req.flush('Invalid credentials', errorResponse);
    });
  });

  describe('register', () => {
    it('should register user', () => {
      const registerResponse = { message: 'User created successfully' };

      service.register('newuser', 'password').subscribe(response => {
        expect(response).toEqual(registerResponse);
      });

      const req = httpMock.expectOne('http://debt.local/api/users/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'newuser', password: 'password' });
      req.flush(registerResponse);
    });

    it('should handle register error', () => {
      const errorResponse = { status: 409, statusText: 'Conflict' };

      service.register('existing', 'password').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/users/register');
      req.flush('Username already exists', errorResponse);
    });
  });

  describe('logout', () => {
    it('should clear token and user data', () => {
      // Set up initial state
      localStorage.setItem('debt_management_token', 'token');

      service.logout();

      expect(localStorage.getItem('debt_management_token')).toBeNull();
      
      // Check that currentUser$ emits null
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('debt_management_token', 'test-token');

      expect(service.getToken()).toBe('test-token');
    });

    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('debt_management_token', 'token');

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when token is empty string', () => {
      localStorage.setItem('debt_management_token', '');

      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('loadUserFromToken', () => {
    it('should load user from valid token on service initialization', (done) => {
      localStorage.clear();
      localStorage.setItem('debt_management_token', mockToken);
      
      // Create new TestBed to get a fresh service instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      
      const newService = TestBed.inject(AuthService);
      
      newService.currentUser$.subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });
    });

    it('should handle invalid token and logout', () => {
      const invalidToken = 'invalid.token.here';
      localStorage.clear();
      localStorage.setItem('debt_management_token', invalidToken);
      
      // Create new TestBed to get a fresh service instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      
      const newService = TestBed.inject(AuthService);
      
      // The constructor should call logout due to invalid token
      expect(localStorage.getItem('debt_management_token')).toBeNull();
    });

    it('should not load user when no token exists', (done) => {
      localStorage.clear();
      
      // Create new TestBed to get a fresh service instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      
      const newService = TestBed.inject(AuthService);
      
      newService.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('handleAuthSuccess', () => {
    it('should store token and set current user', (done) => {
      service.login('testuser', 'password').subscribe(() => {
        expect(localStorage.getItem('debt_management_token')).toBe(mockToken);
        
        service.currentUser$.subscribe(user => {
          expect(user).toEqual(mockUser);
          done();
        });
      });

      const req = httpMock.expectOne('http://debt.local/api/auth/login');
      req.flush(mockAuthResponse);
    });
  });
});
