import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { CourseService } from '../../../../services/course-service';


@Component({
  selector: 'app-my-students',
  imports: [],
  templateUrl: './my-students.html',
  styleUrl: './my-students.scss',
})
export class MyStudents {
  mentor: any;
  students: any[] = [];

  constructor(private auth: AuthService, private courseService: CourseService) {}

  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next: (user) => {
        this.mentor = user;
        this.loadStudents();
      }
    });
  }
  loadStudents(): void {
    this.courseService.getStudentsUnderMentor(this.mentor.id).subscribe({
      next: (data) => (this.students = data),
      error: (err) => console.error('Error loading students:', err),
    });
  }

}
