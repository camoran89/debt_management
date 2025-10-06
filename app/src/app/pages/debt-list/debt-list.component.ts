import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DebtService } from '../../services/debt.service';
import { AuthService } from '../../services/auth.service';
import { Debt } from '../../models';

@Component({
  selector: 'app-debt-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.scss']
})
export class DebtListComponent implements OnInit {
  debts: Debt[] = [];
  filteredDebts: Debt[] = [];
  selectedFilter = 'all';

  constructor(
    private debtService: DebtService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDebts();
  }

  loadDebts(): void {
    this.debtService.getDebts().subscribe({
      next: (debts) => {
        this.debts = debts;
        this.filterDebts();
      },
      error: (error) => {
        console.error('Error loading debts:', error);
      }
    });
  }

  filterDebts(): void {
    switch (this.selectedFilter) {
      case 'pending':
        this.filteredDebts = this.debts.filter(debt => !debt.isPaid);
        break;
      case 'paid':
        this.filteredDebts = this.debts.filter(debt => debt.isPaid);
        break;
      default:
        this.filteredDebts = [...this.debts];
    }
  }

  addDebt(): void {
    this.router.navigate(['/debt-form']);
  }

  viewDetail(debt: Debt): void {
    this.router.navigate(['/debt-detail', debt.id]);
  }

  payDebt(debt: Debt, event: Event): void {
    event.stopPropagation();
    this.debtService.payDebt(debt.id).subscribe({
      next: () => {
        this.loadDebts();
      },
      error: (error) => {
        console.error('Error paying debt:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
