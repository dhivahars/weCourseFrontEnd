import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth-service';
import { InputField } from '../../../../shared/input-field/input-field';
import { weButton } from '../../../../shared/we-button/button';
import { CourseService } from '../../../../services/course-service';


@Component({
  selector: 'app-my-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,InputField,weButton],
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
  errorMessage!:String;
  successMessage!:String;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private courseService: CourseService
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
      error: (err) => console.error('Error loading mentor:', err),
    });
  }

  loadCourses(): void {
    if (!this.mentor?.email) return;
    this.courseService.getCoursesByMentor(this.mentor.email).subscribe({
      next: (data) => {
        this.courses = data;
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
        prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(', ') : '',
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
          this.closeModal();
          this.successMessage=' Course updated successfully!';
          setTimeout(()=>{
            this.successMessage=''
            
            },3000)
        },
        error: () => console.log("error updating")
        
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: () => {
          this.loadCourses();
          this.closeModal();
          this.successMessage=' Course created successfully!';
          setTimeout(()=>{
            this.successMessage=''
            
            },3000)
        },
        error: () => {this.errorMessage=' Error creating course'
          setTimeout(()=>{
            this.errorMessage=''
            
            },3000)
        }
      });
    }
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {this.loadCourses();
          this.successMessage='Course Deleted Successfully'
          setTimeout(()=>{
            this.successMessage=''
            
            },3000)
        },
        error: () => {this.errorMessage='Error deleting course'
          setTimeout(()=>{
            this.errorMessage=''
            
            },3000)
        }
      });
    }
  }
}
