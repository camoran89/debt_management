import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DebtService } from '../../services/debt.service';
import { CreateDebtDto } from '../../models';

@Component({
  selector: 'app-debt-form',
  templateUrl: './debt-form.component.html',
  styleUrls: ['./debt-form.component.scss']
})
export class DebtFormComponent implements OnInit {
  debtForm!: FormGroup;
  loading = false;
  isEditMode = false;
  debtId?: number;

  constructor(
    private fb: FormBuilder,
    private debtService: DebtService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.debtForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.debtId = +id;
      this.loadDebt();
    }
  }

  private loadDebt(): void {
    if (this.debtId) {
      this.loading = true;
      this.debtService.getDebt(this.debtId).subscribe({
        next: (debt) => {
          this.debtForm.patchValue({
            description: debt.description,
            amount: debt.amount
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading debt:', error);
          this.loading = false;
          this.goBack();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.debtForm.valid) {
      this.loading = true;
      const debtData: CreateDebtDto = this.debtForm.value;

      const operation = this.isEditMode && this.debtId
        ? this.debtService.updateDebt(this.debtId, debtData)
        : this.debtService.createDebt(debtData);

      operation.subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/debts']);
        },
        error: (error) => {
          console.error('Error saving debt:', error);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/debts']);
  }
}
