import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DebtListComponent } from './pages/debt-list/debt-list.component';
import { DebtFormComponent } from './pages/debt-form/debt-form.component';
import { DebtDetailComponent } from './pages/debt-detail/debt-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'debts', component: DebtListComponent },
  { path: 'debt-form', component: DebtFormComponent },
  { path: 'debt-form/:id', component: DebtFormComponent },
  { path: 'debt-detail/:id', component: DebtDetailComponent },
  { path: '**', redirectTo: '/login' }
];
