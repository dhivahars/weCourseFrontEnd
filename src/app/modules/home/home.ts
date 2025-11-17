import { Component } from '@angular/core';
import { weButton } from '../../shared/we-button/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Courselist } from '../courselist/course-list';

@Component({
  selector: 'app-home',
  imports: [weButton, Courselist],
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
    return this.auth.isLoggedIn();
  }
  openSignup() {
    this.router.navigate(['/app-register']);
  }
  getRole() {
    this.auth.getUser().subscribe({
      next: (user) => {
        this.role = user.role;
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
    this.auth.clearUserCache();
    this.router.navigate(['/app-login']);
  }
}
