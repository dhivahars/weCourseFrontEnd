import { Component } from '@angular/core';
import { weButton } from '../../../shared/we-button/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mentor-dashboard',
  imports: [weButton, CommonModule,RouterLink,RouterOutlet],
  templateUrl: './mentor-dashboard.html',
  styleUrls: ['./mentor-dashboard.scss'],
})
export class mentorDashboard {
  mentor: any;
  courses: any[] = [];
  students: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.onNavigate('profile');
  }

  onSignOut(): void {
    localStorage.clear();
    this.auth.clearUserCache();
    this.router.navigate(['/app-login']);
  }

  onNavigate(path: string): void {
    this.router.navigate([path]);
  }
}
