import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private baseUrl = 'http://localhost:8080/courses';
  email: string | null = localStorage.getItem('email');
  skill!: any;
  mentorId!:number;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`, { headers: this.getHeaders() });
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/${id}`, { headers: this.getHeaders() });
  }
  private coursesCache: any[] = [];

  cacheCourses(courses: any[]) {
    this.coursesCache = courses;
  }

  getCachedCourseById(id: number) {
    return this.coursesCache.find((course) => course.id === id);
  }

  getCoursesByMentor(mentorEmail: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/mentor/${mentorEmail}`, {
      headers: this.getHeaders(),
    });
  }

  getStudentsUnderMentor(): Observable<any> {
    return this.http.get(`http://localhost:8080/mentor/${this.email}/details`,{ headers: this.getHeaders(),})
    
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(
      `http://localhost:8080/mentor/create/course?email=${this.email}`,
      courseData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  updateCourse(courseId: number, courseData: any): Observable<any> {
    console.log(courseData);

    return this.http.patch(`${this.baseUrl}/update/${courseId}`, courseData, {
      headers: this.getHeaders(),
    });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${courseId}`, {
      headers: this.getHeaders(),
      responseType: 'text',
    });
  }
}
