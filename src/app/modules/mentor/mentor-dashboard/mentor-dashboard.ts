import { Component } from '@angular/core';
import { Button } from '../../../shared/button/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../services/course-service';

@Component({
  selector: 'mentor-dashboard',
  imports: [Button, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './mentor-dashboard.html',
  styleUrls: ['./mentor-dashboard.scss'],
})
export class mentorDashboard {
  mentor: any;
  courses: any[] = [];
  students: any[] = [];

  constructor(
    private auth: AuthService,
    private courseService: CourseService,
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
