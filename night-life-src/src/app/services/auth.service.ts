import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/filter';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

// avoid name not found warnings
declare var auth0: any;

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.AUDIENCE,
    redirectUri: AUTH_CONFIG.REDIRECT,      
    scope: AUTH_CONFIG.SCOPE
  });

  constructor(
    private router: Router,
    private http: Http
  ) { }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        localStorage.setItem('sub', profile.sub);
      }
    });
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('sub');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public isGoing(): boolean {
    // TODO

    return true;
  }

  public countGoing(): number {
    // TODO

    return 5;
  }

  public recordGoing(business_id): any {
    let today = new Date();
    const expires_at = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 3, 0, 0, 0);
    const bar = {
      sub: localStorage.getItem('sub'),
      business_id,
      expires_at
    }
    console.log('bar', bar)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/api/bars/going', bar, { headers }).map(res => res.json());
  }

}
