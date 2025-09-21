import { Component } from '@angular/core';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';

@Component({
  selector: 'app-error-pop-up',
  templateUrl: './error-pop-up.component.html',
  styleUrls: ['./error-pop-up.component.scss']
})
export class ErrorPopUpComponent {
   message: string = '';
  visible: boolean = false;

  constructor(private errorService: ErrorPopUpService) {}

  ngOnInit(): void {
    this.errorService.error$.subscribe(msg => {
      this.message = msg;
      this.visible = true;
    });
  }

  hide() {
    this.visible = false;
  }

}
