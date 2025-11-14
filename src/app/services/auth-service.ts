import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private cachedUser: any = null;

  constructor(private http: HttpClient) {}

  onLogin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  onRegister(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  getUser(): Observable<any> {
    if (this.cachedUser) {
      return of(this.cachedUser);
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>('http://localhost:8080/user/me', { headers }).pipe(
      tap((user) => {
        this.cachedUser = user;
        if (user && user.email) {
          localStorage.setItem('email', user.email);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (e) {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  clearUserCache() {
    this.cachedUser = null;
  }

  //
//   getMentorByEmail(email: string) {
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     });
//   return this.http.get(`http://localhost:8080/mentor/${email}`,{headers});
// }
getAbout(email:string)
{
  const token = localStorage.getItem('token');     
      const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
  });
  return this.http.get(`http://localhost:8080/mentor/about/${email}`,{headers});

}

}
