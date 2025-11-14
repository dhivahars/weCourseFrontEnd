import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulepageService } from '../../services/modulepage';
import jsPDF from 'jspdf';
import { StudentDashBoard } from '../student/student-dash-board/student-dash-board';
import { AuthService } from '../../services/auth-service';
import { Observable } from 'rxjs';
import { CourseService } from '../../services/course-service';
@Component({
  selector: 'app-module-page',
  templateUrl: './module-page.html',
  styleUrls: ['./module-page.scss'],
})
export class ModulePage implements OnInit, OnDestroy {
  courseId!: number;
  enrollmentId!: number;
  errorMessage!: string;
  hasScrolledToBottom = false;
  isCompleted:boolean=false;
  email=localStorage.getItem('email')
  content!: string;
  skills:string[]=[];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private mservice: ModulepageService,
    private sdash:CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadEnrollment();
    window.addEventListener('scroll', this.checkScroll, true);
    this.content = this.mservice.content;
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.checkScroll, true);
  }

  checkScroll = () => {
    const bottom = window.scrollY + window.innerHeight;
    const fullHeight = document.body.scrollHeight;

    if (bottom >= fullHeight - 30) {
      this.hasScrolledToBottom = true;
    }
  };

  loadEnrollment() {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any[]>(`http://localhost:8080/enroll/search/${email}`, { headers })
      .subscribe((data) => {
        const enrollment = data.find((e) => e.id === this.courseId);
        if (!enrollment) return;
        this.enrollmentId = enrollment.id;
      });
  }

  markComplete() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    console.log('Starting PATCH request...');
    this.http
      .patch(
        `http://localhost:8080/enroll/update/progress?enrollmentId=${this.enrollmentId}&progressPercentage=100`,
        {},
        { headers }
      )
      .subscribe({
        next: (res) => {
          this.redirectToDashboard();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Update failed.';
          setTimeout(() => (this.errorMessage = ''), 3000);
        },
        complete: () => console.log('PATCH request completed.'),
      });
  }

  downloadPDF() {
  const doc = new jsPDF({
    orientation: 'p', 
    unit: 'pt',       
    format: 'a4'      
  });

  const pageHeight = doc.internal.pageSize.height;
  const marginLeft = 40;
  const marginTop = 50;
  const maxWidth = 500;
  const lineHeight = 20;

  const lines = doc.splitTextToSize(this.content, maxWidth);

  let y = marginTop;

  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - 40) {
      doc.addPage();
      y = marginTop; 
    }

    doc.text(line, marginLeft, y);
    y += lineHeight;
  });
  doc.save('module.pdf');
}
  redirectToDashboard() {
    this.router.navigate(['/student-dashboard']);
  }
}