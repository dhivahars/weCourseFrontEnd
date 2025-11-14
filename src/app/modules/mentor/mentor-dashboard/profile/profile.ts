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
      next:(user)=>{
        const email=user.email;
        this.mentor=user;
      this.auth.getAbout(email).subscribe({
        next:(res:any)=>{
          this.mentor.about=res.about; 
        },
        error:(err)=>console.log('Error loading Mentor Details:',err)
      });
    },
      error:(err)=>console.log("'Error loading mentor:', err")
    })
  }

}
