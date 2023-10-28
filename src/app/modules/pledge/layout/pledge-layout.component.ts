import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-pledge-layout',
  templateUrl: './pledge-layout.component.html',
  styleUrls: ['./pledge-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PledgeLayoutComponent {
  page:any = '';
  constructor(
    private router: Router,
  ) {
    setTimeout(() => {
      this.page = this.router.url.split("/").pop();
      console.log(this.page);
    }, 500);
  }
}