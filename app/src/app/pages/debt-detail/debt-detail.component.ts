import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DebtService } from '../../services/debt.service';
import { Debt } from '../../models';

@Component({
  selector: 'app-debt-detail',
  templateUrl: './debt-detail.component.html',
  styleUrls: ['./debt-detail.component.scss']
})
export class DebtDetailComponent implements OnInit {
  debt?: Debt;
  payingDebt = false;

  constructor(
    private debtService: DebtService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDebt();
  }

  private loadDebt(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.debtService.getDebt(+id).subscribe({
        next: (debt) => {
          this.debt = debt;
        },
        error: (error) => {
          console.error('Error loading debt:', error);
          this.goBack();
        }
      });
    }
  }

  payDebt(): void {
    if (this.debt && !this.debt.isPaid) {
      this.payingDebt = true;
      this.debtService.payDebt(this.debt.id).subscribe({
        next: (updatedDebt) => {
          this.debt = updatedDebt;
          this.payingDebt = false;
        },
        error: (error) => {
          console.error('Error paying debt:', error);
          this.payingDebt = false;
        }
      });
    }
  }

  editDebt(): void {
    if (this.debt) {
      this.router.navigate(['/debt-form', this.debt.id]);
    }
  }

  deleteDebt(): void {
    if (this.debt && confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
      this.debtService.deleteDebt(this.debt.id).subscribe({
        next: () => {
          this.goBack();
        },
        error: (error) => {
          console.error('Error deleting debt:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/debts']);
  }
}
