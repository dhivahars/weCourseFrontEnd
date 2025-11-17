import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course-service';

@Component({
  selector: 'app-courselist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class Courselist implements OnInit {
  courses: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching courses', err);
        this.errorMessage = 'Failed to load courses. Please try again later.';
        this.loading = false;
      },
    });
  }

  viewDetails(courseId?: number): void {
    if (courseId != null) {
      this.router.navigate(['/app-course', courseId]);
    }
  }
}
