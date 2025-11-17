import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { CourseService } from '../../../../services/course-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-my-students',
  imports: [],
  templateUrl: './my-students.html',
  styleUrl: './my-students.scss',
})
export class MyStudents {
  mentor: any;
  students: any[] = [];

  constructor(private auth: AuthService, private courseService: CourseService,private http:HttpClient) {}

  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next: (user) => {
        this.mentor = user;
        this.loadStudents();
      }
    });
  }
  getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  loadStudents(): void {
    this.courseService.getStudentsUnderMentor().subscribe({
      next: (data) => {
        console.log(data);
        
        this.http.get(`http://localhost:8080/courses/mentor/${data.id}/students`, {
      headers: this.getHeaders(),
    }).subscribe({
      next:(res:any)=>this.students=res,
      error:(err)=>console.log(err)
      
    })
      },
      error: (err) => console.error('Error loading students:', err),
    });
  }

}
