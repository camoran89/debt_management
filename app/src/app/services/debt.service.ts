import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Debt, CreateDebtDto, UpdateDebtDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private readonly API_URL = 'http://debt.local/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.API_URL}/debts`, {
      headers: this.getHeaders()
    });
  }

  getDebt(id: number): Observable<Debt> {
    return this.http.get<Debt>(`${this.API_URL}/debts/${id}`, {
      headers: this.getHeaders()
    });
  }

  createDebt(debt: CreateDebtDto): Observable<Debt> {
    return this.http.post<Debt>(`${this.API_URL}/debts`, debt, {
      headers: this.getHeaders()
    });
  }

  updateDebt(id: number, debt: Partial<CreateDebtDto>): Observable<Debt> {
    return this.http.patch<Debt>(`${this.API_URL}/debts/${id}`, debt, {
      headers: this.getHeaders()
    });
  }

  payDebt(id: number): Observable<Debt> {
    return this.http.patch<Debt>(`${this.API_URL}/debts/${id}/pay`, {}, {
      headers: this.getHeaders()
    });
  }

  deleteDebt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/debts/${id}`, {
      headers: this.getHeaders()
    });
  }
}
