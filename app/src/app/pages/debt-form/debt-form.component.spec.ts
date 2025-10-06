import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { DebtFormComponent } from './debt-form.component';
import { DebtService } from '../../services/debt.service';
import { Debt } from '../../models';

describe('DebtFormComponent', () => {
  let component: DebtFormComponent;
  let fixture: ComponentFixture<DebtFormComponent>;
  let mockDebtService: jasmine.SpyObj<DebtService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockDebt: Debt = {
    id: 1,
    amount: 100,
    description: 'Test debt',
    isPaid: false,
    createdAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const debtSpy = jasmine.createSpyObj('DebtService', ['getDebt', 'createDebt', 'updateDebt']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        DebtFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DebtService, useValue: debtSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtFormComponent);
    component = fixture.componentInstance;
    mockDebtService = TestBed.inject(DebtService) as jasmine.SpyObj<DebtService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values in create mode', () => {
    expect(component.debtForm.get('description')?.value).toBe('');
    expect(component.debtForm.get('amount')?.value).toBe('');
    expect(component.isEditMode).toBe(false);
  });

  it('should enter edit mode when id parameter is present', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockDebtService.getDebt.and.returnValue(of(mockDebt));

    component.ngOnInit();

    expect(component.isEditMode).toBe(true);
    expect(component.debtId).toBe(1);
    expect(mockDebtService.getDebt).toHaveBeenCalledWith(1);
  });

  it('should load debt data in edit mode', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockDebtService.getDebt.and.returnValue(of(mockDebt));

    component.ngOnInit();

    expect(component.debtForm.get('description')?.value).toBe(mockDebt.description);
    expect(component.debtForm.get('amount')?.value).toBe(mockDebt.amount);
  });

  it('should handle error when loading debt in edit mode', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockDebtService.getDebt.and.returnValue(throwError(() => new Error('Load error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading debt:', jasmine.any(Error));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debts']);
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(mockDebtService.createDebt).not.toHaveBeenCalled();
    expect(mockDebtService.updateDebt).not.toHaveBeenCalled();
  });

  it('should create debt when form is valid in create mode', () => {
    mockDebtService.createDebt.and.returnValue(of(mockDebt));
    
    component.debtForm.patchValue({
      description: 'Test debt',
      amount: 100
    });
    component.onSubmit();

    expect(mockDebtService.createDebt).toHaveBeenCalledWith({
      description: 'Test debt',
      amount: 100
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debts']);
  });

  it('should update debt when form is valid in edit mode', () => {
    component.isEditMode = true;
    component.debtId = 1;
    mockDebtService.updateDebt.and.returnValue(of(mockDebt));
    
    component.debtForm.patchValue({
      description: 'Updated debt',
      amount: 150
    });
    component.onSubmit();

    expect(mockDebtService.updateDebt).toHaveBeenCalledWith(1, {
      description: 'Updated debt',
      amount: 150
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debts']);
  });

  it('should handle error when saving debt', () => {
    mockDebtService.createDebt.and.returnValue(throwError(() => new Error('Save error')));
    spyOn(console, 'error');
    
    component.debtForm.patchValue({
      description: 'Test debt',
      amount: 100
    });
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error saving debt:', jasmine.any(Error));
    expect(component.loading).toBe(false);
  });

  it('should navigate back to debts list', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/debts']);
  });

  it('should validate form fields', () => {
    const descriptionControl = component.debtForm.get('description');
    const amountControl = component.debtForm.get('amount');

    expect(descriptionControl?.hasError('required')).toBe(true);
    expect(amountControl?.hasError('required')).toBe(true);

    amountControl?.setValue(0);
    expect(amountControl?.hasError('min')).toBe(true);

    descriptionControl?.setValue('Valid description');
    amountControl?.setValue(10);

    expect(descriptionControl?.hasError('required')).toBe(false);
    expect(amountControl?.hasError('required')).toBe(false);
    expect(amountControl?.hasError('min')).toBe(false);
  });
});
