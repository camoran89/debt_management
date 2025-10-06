import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { DebtDetailComponent } from './debt-detail.component';
import { DebtService } from '../../services/debt.service';
import { Debt } from '../../models';

describe('DebtDetailComponent', () => {
  let component: DebtDetailComponent;
  let fixture: ComponentFixture<DebtDetailComponent>;
  let mockDebtService: jasmine.SpyObj<DebtService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockActivatedRoute: any;

  const mockDebt: Debt = {
    id: 1,
    amount: 100,
    description: 'Test debt',
    isPaid: false,
    createdAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const debtSpy = jasmine.createSpyObj('DebtService', ['getDebt', 'deleteDebt', 'payDebt']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
      declarations: [
        DebtDetailComponent
      ],
      providers: [
        { provide: DebtService, useValue: debtSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtDetailComponent);
    component = fixture.componentInstance;
    mockDebtService = TestBed.inject(DebtService) as jasmine.SpyObj<DebtService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load debt on init', () => {
    mockDebtService.getDebt.and.returnValue(of(mockDebt));

    component.ngOnInit();

    expect(mockDebtService.getDebt).toHaveBeenCalledWith(1);
    expect(component.debt).toEqual(mockDebt);
  });

  it('should handle error when loading debt', () => {
    mockDebtService.getDebt.and.returnValue(throwError(() => new Error('Load error')));
    spyOn(component, 'goBack');
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading debt:', jasmine.any(Error));
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should not load debt when id is null', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

    component.ngOnInit();

    expect(mockDebtService.getDebt).not.toHaveBeenCalled();
  });

  it('should pay debt', (done) => {
    component.debt = { ...mockDebt };
    const paidDebt = { ...mockDebt, isPaid: true };
    mockDebtService.payDebt.and.returnValue(of(paidDebt));

    component.payDebt();

    setTimeout(() => {
      expect(mockDebtService.payDebt).toHaveBeenCalledWith(1);
      expect(component.debt!.isPaid).toBe(true);
      expect(component.payingDebt).toBe(false);
      done();
    });
  });

  it('should handle error when paying debt', () => {
    component.debt = { ...mockDebt };
    mockDebtService.payDebt.and.returnValue(throwError(() => new Error('Pay error')));
    spyOn(console, 'error');

    component.payDebt();

    expect(console.error).toHaveBeenCalledWith('Error paying debt:', jasmine.any(Error));
    expect(component.payingDebt).toBe(false);
  });

  it('should not pay debt if debt is null', () => {
    component.debt = undefined;

    component.payDebt();

    expect(mockDebtService.payDebt).not.toHaveBeenCalled();
  });

  it('should not pay debt if already paid', () => {
    component.debt = { ...mockDebt, isPaid: true };

    component.payDebt();

    expect(mockDebtService.payDebt).not.toHaveBeenCalled();
  });

  it('should delete debt when confirmed', () => {
    component.debt = { ...mockDebt };
    mockDebtService.deleteDebt.and.returnValue(of(void 0));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'goBack');

    component.deleteDebt();

    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar esta deuda?');
    expect(mockDebtService.deleteDebt).toHaveBeenCalledWith(1);
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should not delete debt if not confirmed', () => {
    component.debt = { ...mockDebt };
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteDebt();

    expect(mockDebtService.deleteDebt).not.toHaveBeenCalled();
  });

  it('should handle error when deleting debt', () => {
    component.debt = { ...mockDebt };
    mockDebtService.deleteDebt.and.returnValue(throwError(() => new Error('Delete error')));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');

    component.deleteDebt();

    expect(console.error).toHaveBeenCalledWith('Error deleting debt:', jasmine.any(Error));
  });

  it('should not delete if debt is null', () => {
    component.debt = undefined;
    spyOn(window, 'confirm');

    component.deleteDebt();

    expect(window.confirm).not.toHaveBeenCalled();
    expect(mockDebtService.deleteDebt).not.toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    component.debt = { ...mockDebt };

    component.editDebt();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debt-form', 1]);
  });

  it('should not edit if debt is null', () => {
    component.debt = undefined;

    component.editDebt();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debts']);
  });
});
