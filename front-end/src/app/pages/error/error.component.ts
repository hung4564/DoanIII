import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  errorCode = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    if (this.route) {
      this.route.params.forEach((params: Params) => {
        if (params['id']) {
          this.errorCode = params['id'];
        }
      });
    }
  }
  onReturnButton() {
    this.router.navigate(['/']);
  }
}
