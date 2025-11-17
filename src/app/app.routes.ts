import { Routes } from '@angular/router';
import { Home } from './modules/home/home';
import { Login } from './modules/auth/login/login';
import { mentorDashboard } from './modules/mentor/mentor-dashboard/mentor-dashboard';
import { StudentDashBoard } from './modules/student/student-dash-board/student-dash-board';
import { Register } from './modules/auth/register/register';
import { Course } from './modules/course/course';
import { ModulePage } from './modules/module-page/module-page';
import { Profile } from './modules/mentor/mentor-dashboard/profile/profile';
import { MyCourse } from './modules/mentor/mentor-dashboard/my-course/my-course';
import { MyStudents } from './modules/mentor/mentor-dashboard/my-students/my-students';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app-home',
    pathMatch: 'full',
  },
  {
    path: 'app-home',
    component: Home,
  },
  {
    path: 'app-login',
    component: Login,
  },
  {
    path: 'student-dashboard',
    component: StudentDashBoard,
  },
  {
    path: 'app-register',
    component: Register,
  },
  {
    path: 'app-course/:id',
    component: Course,
  },
  {
    path: 'module/course/:courseId/page/:pageNumber',
    component: ModulePage,
  },
  {
    path: 'course/:courseId/page/:pageNumber',
    component: ModulePage,
  },
  {
    path: 'mentor-dashboard',
    component: mentorDashboard,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: Profile },
      { path: 'mycourse', component: MyCourse },
      { path: 'mystudent', component: MyStudents },
    ],
  },
];
