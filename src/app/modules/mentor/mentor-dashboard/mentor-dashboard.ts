import { Component, OnInit } from '@angular/core';
import { Button } from '../../../shared/button/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../services/course-service';


@Component({
  selector: 'mentor-dashboard',
  imports: [Button, CommonModule,RouterLink,RouterOutlet],
  templateUrl: './mentor-dashboard.html',
  styleUrls: ['./mentor-dashboard.scss'],
})
export class mentorDashboard {
  mentor: any;
  courses: any[] = [];
  students: any[] = [];

  constructor(
    private auth: AuthService,
    private courseService: CourseService, // Inject service // Inject service
    private router: Router
     ) {this.onNavigate('profile')}

  // ngOnInit(): void {
  //   this.auth.getUser().subscribe({
  //     next: (user) => {
  //       this.mentor = user;
  //       console.log('Mentor loaded:', this.mentor);
  //     },
  //     error: (err) => console.error('Error loading mentor data:', err),
  //   });
  // }

  // // Fetch mentor courses
  // loadCourses(): void {
  //   this.courseService.getCoursesByMentor(this.mentor.id).subscribe({
  //     next: (data) => (this.courses = data),
  //     error: (err) => console.error('Error loading courses:', err),
  //   });
  // }

  // // Fetch students under mentor
  // loadStudents(): void {
  //   this.courseService.getStudentsUnderMentor(this.mentor.id).subscribe({
  //     next: (data) => (this.students = data),
  //     error: (err) => console.error('Error loading students:', err),
  //   });
  // }

  onSignOut(): void {
    localStorage.clear();
    this.auth.clearUserCache();
    this.auth.clearUserCache();
    this.router.navigate(['/app-login']);
  }
 
  onNavigate(path: string): void {
    this.router.navigate([path]);
  }
}
