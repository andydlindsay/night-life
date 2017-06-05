import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  title: String = 'Goin\' Out!';
  subtitle: String = 'Get your groove on! Search for bars in your area!';

  constructor(
    private flashMessage: FlashMessagesService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  onLogoutClick() {
    this.auth.logout();
  }

  onLoginClick() {
    this.auth.login();
  }

}
