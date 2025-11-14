import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth-service';
import { InputField } from '../../../../shared/input-field/input-field';
import { Button } from '../../../../shared/button/button';
import { CourseService } from '../../../../services/course-service';
import { Login } from '../../../auth/login/login';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,InputField,Button],
  templateUrl: './my-course.html',
  styleUrls: ['./my-course.scss'],
})
export class MyCourse implements OnInit {
  mentor: any;
  courses: any[] = [];
  courseForm!: FormGroup;
  showModal = false;
  editingCourseId: number | null = null;
  availableSeats!:any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private courseService: CourseService,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      skill: [''],
      prerequisites: [''],
    });

    this.auth.getUser().subscribe({
      next: (user) => {
        this.mentor = user;
        this.loadCourses();
      },
      error: (err) => console.error('Error loading mentor:', err)
    });
  }

  loadCourses(): void {
    if (!this.mentor?.email) return;
    this.courseService.getCoursesByMentor(this.mentor.email).subscribe({
      next: (data) => {
        this.courses = data

        //   this.http.get(`http://localhost:8080/courses/capacity/${data.map((course:any)=>course.id)}`).subscribe({
        //   next:(res)=>this.availableSeats=res
        // })
      },
      error: (err) => console.error('Error loading courses:', err),
    });
  }

  openModal(course?: any): void {
    this.showModal = true;
    if (course) {
      this.editingCourseId = course.id;
      this.courseForm.patchValue({
        title: course.title,
        description: course.description,
        capacity: course.capacity,
        skill: course.skill,
        prerequisites: Array.isArray(course.prerequisites)
          ? course.prerequisites.join(', ')
          : '',
      });
    } else {
      this.editingCourseId = null;
      this.courseForm.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    const prerequisitesArray = (this.courseForm.value.prerequisites || '')
      .split(',')
      .map((x: string) => x.trim())
      .filter((x: string) => x);

    const courseData = {
      ...this.courseForm.value,
      mentor: this.mentor,
      prerequisites: prerequisitesArray,
    };

    if (this.editingCourseId) {
      this.courseService.updateCourse(this.editingCourseId, courseData).subscribe({
        next: () => {
          this.loadCourses();
          // this.closeModal();
          alert(' Course updated successfully!');
        },
        error: () => console.log("error updating")
        ,
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: () => {
          this.loadCourses();
          this.closeModal();
          alert(' Course created successfully!');
        },
        error: () => alert(' Error creating course'),
      });
    }
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: () => alert(' Error deleting course'),
      });
    }
  }
}
