import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'we-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  constructor(private router: Router) {}

  // Sign out function
  onSignOut(): void {
    localStorage.clear();
    this.router.navigate(['/app-login']);
  }
}
