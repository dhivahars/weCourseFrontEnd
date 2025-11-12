import { Component, OnInit } from '@angular/core';
import { InputField } from '../../shared/input-field/input-field';
import { Button } from '../../shared/button/button';
import { Router, RouterOutlet } from '@angular/router';
import { Courselist } from '../courselist/courselist';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [Button, Courselist],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  role!: string;
  constructor(private router: Router, private auth: AuthService) {
    this.getRole();
  }
  onLogClick() {
    this.router.navigate(['/app-login']);
  }
  isLogged(): boolean {
    return !localStorage.getItem('token');
  }
  openSignup() {
    this.router.navigate(['/app-register']);
  }
  getRole() {
    this.auth.getUser().subscribe({
      next: (user) => {
        this.role = user.role; // assuming user object has a "role" property
        console.log('User role:', this.role);
      },
      error: (err) => console.error(err),
    });
  }
  redirectToDashboard() {
    this.router.navigate(['/student-dashboard']);
  }
  onNavigate(a: string) {}
  onSignOut(): void {
    localStorage.clear();
    this.auth.clearUserCache(); // clear cached user
    this.router.navigate(['/app-login']);
  }
}
