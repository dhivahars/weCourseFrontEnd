import { Component, OnInit } from '@angular/core';
import { InputField } from '../../../shared/input-field/input-field';
import { Button } from '../../../shared/button/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputField,
    Button,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register implements OnInit {
  signup!: FormGroup;
  skillsList: string[] = ['Angular', 'Web Design', 'BackEndJs', 'Python', 'Core Java', 'SQL', 'Advance Java'];
  errorMessage!:string;


  constructor(private sb: FormBuilder, private route: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.signup = this.sb.group(
      {
        name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]{4,10}$')]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9](.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(.[a-zA-Z]{2,})+$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ),
          ],
        ],
        confirmpassword: ['', Validators.required],
        role: ['', Validators.required],
        skills: [[]],
      },
      { validators: this.passwordValidator }
    );
  }
  passwordValidator(pv: FormGroup) {
    const password = pv.get('password')?.value;
    const confirmpassword = pv.get('confirmpassword')?.value;
    if (password && confirmpassword && password !== confirmpassword) {
      pv.get('confirmpassword')?.setErrors({ mismatch: true });
    } else {
      pv.get('confirmpassword')?.setErrors(null);
    }
  }
  get r() {
    return this.signup.controls;
  }
  close() {
    this.route.navigate(['/']);
  }
  toLogin() {
    this.route.navigate(['/app-login']);
  }
  onSubmit(): void {
    if (this.signup.invalid) {
      this.signup.markAllAsTouched();
      return;
    }

    this.auth.onRegister(this.signup.value).subscribe({
      next: (res: any) => {
        console.log('Registration successful:', res.data);
        this.route.navigate(['/app-login']); // Navigate to login
      },
      error: (err) => {
        this.errorMessage=err?.value
        setTimeout(() => {
          this.errorMessage=''
        }, 3000);
        console.error('Registration failed:', err);
      },
    });
  }
}
