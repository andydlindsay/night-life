import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YelpService } from '../../services/yelp.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private yelp: YelpService,
    private auth: AuthService
  ) { }

  searchTerm: string;
  searchForm: FormGroup;
  searchResults: any;
  searching: boolean = false;
  totalResults: number;
  itemsPerPage: number = 10;
  currentPage: number = 1;

  ngOnInit() {
    this.titleService.setTitle('Home - Goin\' Out!');
    this.buildForm();
    this.searchTerm = localStorage.getItem('searchterm');
    if (this.searchTerm.length > 0) {
      this.currentPage = Number(localStorage.getItem('currentpage'));
      localStorage.setItem('currentpage', '1');
      this.updateSearchResults();
    }
  }

  buildForm() {
    this.searchForm = this.fb.group({
      'search': ['', [
        Validators.required
      ]]
    });
    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  // onValueChanged function taken from the Angular Cookbook's Form Validation section
  // https://angular.io/docs/ts/latest/cookbook/form-validation.html
  onValueChanged(data?: any) {
    if (!this.searchForm) { return; }
    const form = this.searchForm;

    for (const field in this.formErrors) {
      // clear previous error message if any
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'search': ''
  }

  validationMessages = {
    'search': {
      'required': 'A search city is required.'
    }
  }

  isFirstPage() {
    if (this.currentPage == 1) {
      return true;
    } else {
      return false;
    }
  }

  isLastPage() {
    if (Math.ceil(Number(this.totalResults) / Number(this.itemsPerPage)) == this.currentPage) {
      return true;
    } else {
      return false;
    }
  }

  nextPage() {
    this.currentPage += 1;
    this.updateSearchResults();
  }

  updateSearchResults() {
    this.searching = true;
    this.searchResults = undefined;
    this.yelp.getBars(this.searchTerm, this.itemsPerPage, this.currentPage).subscribe(
      data => {
        this.searchResults = data.businesses;
        this.totalResults = data.total;
        this.searching = false;
      },
      err => {
        console.error(err);
        this.searching = false;
        return false;
      }
    );
  }

  prevPage() {
    this.currentPage -= 1;
    this.updateSearchResults();
  }

  onSearchSubmit() {
    // check if search form is valid
    if (this.searchForm.valid) {
      this.currentPage = 1;
      this.searchTerm = this.searchForm.value.search;
      // store search term in local storage
      localStorage.setItem('searchterm', this.searchTerm);
      this.updateSearchResults();
    }
  }

  onGoingClick(businessId) {
    console.log('you are going to ' + businessId);
    // check if user is logged in
    if (this.isLoggedIn()) {
      // update database
      this.auth.recordGoing(businessId).subscribe(
        data => {
          console.log(data);
          if (data.success) {
            // record saved successfully

          } else {
            // record not saved
            
          }
        }
      );
    } else {
      // store current page
      localStorage.setItem('currentpage', String(this.currentPage));
      // redirect to login page
      this.auth.login();
    }
  }

  isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  ratingImageUrl(rating) {
    let imageUrl = 'https://s3.amazonaws.com/andydlindsay-night-life/yelp/stars/regular_';
    switch(rating) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        imageUrl += String(rating);
        break;
      case 1.5:
      case 2.5:
      case 3.5:
      case 4.5:
        imageUrl += String(Math.floor(rating)) + '_half';
        break;
    }
    imageUrl += '.png';
    return imageUrl;
  }

}
