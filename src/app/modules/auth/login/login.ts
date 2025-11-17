import { Component, OnInit } from '@angular/core';
import { weButton } from '../../../shared/we-button/button';
import { InputField } from '../../../shared/input-field/input-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service';
import { Route, Router, RouterLink } from '@angular/router';

type Pass = 'text' | 'password';
@Component({
  selector: 'app-login',
  imports: [weButton, InputField, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  login!: FormGroup;
  passType: Pass = 'password';
  errorMessage!:string;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    // this.isLogged()? 'login page':this.router.navigate([''])
  }
  get f() {
    return this.login.controls;
  }
  onSubmit(): void {
    if (this.login.invalid) {
      this.login.markAllAsTouched();
      return;
    }

    this.auth.onLogin(this.login.value).subscribe({
      next: (res: any) => {
        console.log('Login response:', res.message);
        localStorage.setItem('token', res.data);
        this.auth.getUser().subscribe({
          next: (user: any) => {
            console.log('User:', user);
            if (user.role === 'student') {
              localStorage.setItem('email', user.email);
              this.router.navigate(['/student-dashboard']);
            } else if (user.role === 'mentor') {
              localStorage.setItem('email', user.email);
              this.router.navigate(['/mentor-dashboard']);
            }
          },
        });
      },
      error: (err) => {
        this.errorMessage=err.error?.message
        setTimeout(() => {
          this.errorMessage=''
        }, 3000);
      },
    });
  }
  onShowPassword() {
    this.passType = this.passType == 'password' ? 'text' : 'password';
  }
  close() {
    this.router.navigate(['/']);
  }
}
