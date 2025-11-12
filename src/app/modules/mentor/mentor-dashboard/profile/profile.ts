import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';

@Component({
  selector: 'mentor-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit{
  mentor:any;
  constructor(private auth:AuthService){}
  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next:(user)=>this.mentor=user,
      error:(err)=>console.log("'Error loading mentor:', err")
    })
  }

}
