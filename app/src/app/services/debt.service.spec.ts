import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DebtService } from './debt.service';
import { AuthService } from './auth.service';
import { Debt, CreateDebtDto, UpdateDebtDto } from '../models';

describe('DebtService', () => {
  let service: DebtService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockToken = 'mock-jwt-token';
  const mockDebt: Debt = {
    id: 1,
    amount: 100,
    description: 'Test debt',
    isPaid: false,
    createdAt: '2023-01-01T00:00:00Z'
  };

  const mockDebts: Debt[] = [
    mockDebt,
    {
      id: 2,
      amount: 200,
      description: 'Another debt',
      isPaid: true,
      createdAt: '2023-01-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(DebtService);
    httpMock = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    mockAuthService.getToken.and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHeaders', () => {
    it('should return headers with authorization token', () => {
      // This is tested indirectly through other methods since getHeaders is private
      service.getDebts().subscribe();

      const req = httpMock.expectOne('http://debt.local/api/debts');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush([]);
    });

    it('should handle null token', () => {
      mockAuthService.getToken.and.returnValue(null);

      service.getDebts().subscribe();

      const req = httpMock.expectOne('http://debt.local/api/debts');
      expect(req.request.headers.get('Authorization')).toBe('Bearer null');
      req.flush([]);
    });
  });

  describe('getDebts', () => {
    it('should fetch all debts', () => {
      service.getDebts().subscribe(debts => {
        expect(debts).toEqual(mockDebts);
      });

      const req = httpMock.expectOne('http://debt.local/api/debts');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockDebts);
    });

    it('should handle error when fetching debts', () => {
      const errorResponse = { status: 500, statusText: 'Server Error' };

      service.getDebts().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/debts');
      req.flush('Server error', errorResponse);
    });
  });

  describe('getDebt', () => {
    it('should fetch single debt by id', () => {
      service.getDebt(1).subscribe(debt => {
        expect(debt).toEqual(mockDebt);
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/1');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockDebt);
    });

    it('should handle error when fetching single debt', () => {
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.getDebt(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/999');
      req.flush('Debt not found', errorResponse);
    });
  });

  describe('createDebt', () => {
    it('should create new debt', () => {
      const createDto: CreateDebtDto = {
        description: 'New debt',
        amount: 150
      };

      service.createDebt(createDto).subscribe(debt => {
        expect(debt.description).toBe(createDto.description);
        expect(debt.amount).toBe(createDto.amount);
      });

      const req = httpMock.expectOne('http://debt.local/api/debts');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      
      const newDebt = { ...mockDebt, ...createDto };
      req.flush(newDebt);
    });

    it('should handle error when creating debt', () => {
      const createDto: CreateDebtDto = {
        description: '',
        amount: -1
      };
      const errorResponse = { status: 400, statusText: 'Bad Request' };

      service.createDebt(createDto).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/debts');
      req.flush('Invalid data', errorResponse);
    });
  });

  describe('updateDebt', () => {
    it('should update debt', () => {
      const updateData: Partial<CreateDebtDto> = {
        description: 'Updated debt'
      };
      const updatedDebt = { ...mockDebt, ...updateData };

      service.updateDebt(1, updateData).subscribe(debt => {
        expect(debt).toEqual(updatedDebt);
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(updatedDebt);
    });

    it('should handle error when updating debt', () => {
      const updateData: Partial<CreateDebtDto> = {
        amount: -1
      };
      const errorResponse = { status: 400, statusText: 'Bad Request' };

      service.updateDebt(1, updateData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/1');
      req.flush('Invalid amount', errorResponse);
    });
  });

  describe('payDebt', () => {
    it('should mark debt as paid', () => {
      const paidDebt = { ...mockDebt, isPaid: true };

      service.payDebt(1).subscribe(debt => {
        expect(debt).toEqual(paidDebt);
        expect(debt.isPaid).toBe(true);
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/1/pay');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(paidDebt);
    });

    it('should handle error when paying debt', () => {
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.payDebt(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/999/pay');
      req.flush('Debt not found', errorResponse);
    });
  });

  describe('deleteDebt', () => {
    it('should delete debt', () => {
      service.deleteDebt(1).subscribe(result => {
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(null);
    });

    it('should handle error when deleting debt', () => {
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.deleteDebt(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/999');
      req.flush('Debt not found', errorResponse);
    });

    it('should handle forbidden delete operation', () => {
      const errorResponse = { status: 403, statusText: 'Forbidden' };

      service.deleteDebt(1).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne('http://debt.local/api/debts/1');
      req.flush('Not authorized to delete this debt', errorResponse);
    });
  });
});
