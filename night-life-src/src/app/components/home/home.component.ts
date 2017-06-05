import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YelpService } from '../../services/yelp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private yelp: YelpService
  ) { }

  searchTerm: string;
  searchForm: FormGroup;
  searchResults: any;
  searching: boolean = false;
  totalResults: number;
  itemsPerPage: number = 10;
  currentPage: number;

  ngOnInit() {
    this.titleService.setTitle('Home - Goin\' Out!');
    this.buildForm();
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
      this.searchTerm = this.searchForm.value.search;
      this.currentPage = 1;
      this.updateSearchResults();
    }
  }

}
