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

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`);
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/${id}`);
  }
  private coursesCache: any[] = [];

  cacheCourses(courses: any[]) {
    this.coursesCache = courses;
  }

  getCachedCourseById(id: number) {
    return this.coursesCache.find((course) => course.id === id);
  }

  getCoursesByMentor(mentorEmail: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/mentor/${mentorEmail}`);
  }

  getStudentsUnderMentor(mentorId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/mentor/${mentorId}/students`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(
      `http://localhost:8080/mentor/create/course?email=${this.email}`,
      courseData);
  }

  updateCourse(courseId: number, courseData: any): Observable<any> {
    console.log(courseData);

    return this.http.patch(`${this.baseUrl}/update/${courseId}`, courseData);
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${courseId}`);
  }
}
