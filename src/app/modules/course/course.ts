import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Courselist } from '../courselist/courselist';
import { CourseService } from '../../services/course-service';
import { Button } from '../../shared/button/button';
import { constructorChecks } from '@angular/cdk/schematics';

@Component({
  selector: 'app-course',
  standalone: true, // ✅ required if this is a standalone component
  imports: [CommonModule, Button, RouterLink], // ✅ Add this
  templateUrl: './course.html',
  styleUrls: ['./course.scss'],
})
export class Course {
  courseId!: number;
  course: any = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // ✅ Get course ID from URL
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.courseId = Number(idParam);
      this.loadCourse();
    } else {
      this.errorMessage = 'Invalid course ID.';
      this.loading = false;
    }
  }

  loadCourse(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching course:', err);
        this.errorMessage = 'Failed to load course details.';
        this.loading = false;
      },
    });
  }
  onEnroll() {
    const headers = this.courseService.getHeaders();
    const email = localStorage.getItem('email');

    if (!email) {
      this.errorMessage = 'No logged-in student found.';
      return;
    }

    this.http
      .post(
        `http://localhost:8080/enroll/student/${email}/course/${this.courseId}`,
        {},
        { headers }
      )
      .subscribe({
        next: (res) => {
          console.log('Enrollment success:', res);
          this.router.navigate(['/student-dashboard']);
        },
        error: (err) => {
          console.error('Enrollment failed:', err);
          this.errorMessage = err.error?.message || 'Enrollment failed.';
          setTimeout(()=>{
            this.errorMessage=''},3000)
          
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/app-courselist']); // Redirect to course list
  }
  redirectToHome() {
    this.router.navigate(['/app-home']);
  }
}
