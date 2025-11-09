import { Component } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header {
  isAuthenticated$;
  userName$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userName$ = this.authService.userName$;
  }

  onLoginClick() {
    if (this.authService.isUserAuthenticated()) {
      this.router.navigate(['/attJogo']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
