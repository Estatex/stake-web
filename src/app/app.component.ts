import { Component } from '@angular/core';
import { SpinnerService } from './shared/services/spinner.service';
import { setTheme } from 'ngx-bootstrap/utils';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EstateX';
  loading : boolean = true;
  constructor(
    private spinner:SpinnerService,
  ){
    setTheme('bs5');
  }

  ngOnInit(){
    setTimeout(() => {
      this.spinner.returnSpinnerObservable().subscribe( value => {
          this.loading = value;
      });
    }, 100);
    
  }

  ngAfterViewInit(): void {
    
  }
}
