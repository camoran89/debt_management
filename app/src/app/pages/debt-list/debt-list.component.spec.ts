import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { of, throwError } from 'rxjs';

import { DebtListComponent } from './debt-list.component';
import { DebtService } from '../../services/debt.service';
import { AuthService } from '../../services/auth.service';
import { Debt } from '../../models';

describe('DebtListComponent', () => {
  let component: DebtListComponent;
  let fixture: ComponentFixture<DebtListComponent>;
  let mockDebtService: jasmine.SpyObj<DebtService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockDebts: Debt[] = [
    {
      id: 1,
      amount: 100,
      description: 'Test debt 1',
      isPaid: false,
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      amount: 200,
      description: 'Test debt 2',
      isPaid: true,
      createdAt: '2023-01-02T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const debtSpy = jasmine.createSpyObj('DebtService', ['getDebts', 'payDebt']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);


    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule
      ],
      declarations: [
        DebtListComponent
      ],
      providers: [
        { provide: DebtService, useValue: debtSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtListComponent);
    component = fixture.componentInstance;
    mockDebtService = TestBed.inject(DebtService) as jasmine.SpyObj<DebtService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    mockDebtService.getDebts.and.returnValue(of(mockDebts));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load debts on init', () => {
    expect(mockDebtService.getDebts).toHaveBeenCalled();
    expect(component.debts).toEqual(mockDebts);
  });

  it('should filter debts by all', () => {
    component.selectedFilter = 'all';
    component.filterDebts();
    expect(component.filteredDebts.length).toBe(2);
  });

  it('should filter debts by pending', () => {
    component.selectedFilter = 'pending';
    component.filterDebts();
    expect(component.filteredDebts.length).toBe(1);
    expect(component.filteredDebts[0].isPaid).toBe(false);
  });

  it('should filter debts by paid', () => {
    component.selectedFilter = 'paid';
    component.filterDebts();
    expect(component.filteredDebts.length).toBe(1);
    expect(component.filteredDebts[0].isPaid).toBe(true);
  });

  it('should navigate to debt form when adding debt', () => {
    component.addDebt();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debt-form']);
  });

  it('should navigate to debt detail when viewing debt', () => {
    const debt = mockDebts[0];
    component.viewDetail(debt);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debt-detail', debt.id]);
  });

  it('should pay debt and reload list', () => {
    mockDebtService.payDebt.and.returnValue(of(mockDebts[0]));
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.payDebt(mockDebts[0], event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(mockDebtService.payDebt).toHaveBeenCalledWith(1);
    expect(mockDebtService.getDebts).toHaveBeenCalledTimes(2); // Initial load + reload
  });

  it('should handle error when paying debt', () => {
    mockDebtService.payDebt.and.returnValue(throwError(() => new Error('Payment error')));
    spyOn(console, 'error');
    const event = new Event('click');

    component.payDebt(mockDebts[0], event);

    expect(console.error).toHaveBeenCalledWith('Error paying debt:', jasmine.any(Error));
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error when loading debts', () => {
    mockDebtService.getDebts.and.returnValue(throwError(() => new Error('Load error')));
    spyOn(console, 'error');

    component.loadDebts();

    expect(console.error).toHaveBeenCalledWith('Error loading debts:', jasmine.any(Error));
  });
});
