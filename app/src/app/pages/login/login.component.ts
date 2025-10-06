import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.loading = true;
      const { username, password } = this.authForm.value;

      const authCall = this.isLoginMode 
        ? this.authService.login(username, password)
        : this.authService.register(username, password);

      authCall.subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/debts']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Authentication error:', error);
        }
      });
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
  }
}
