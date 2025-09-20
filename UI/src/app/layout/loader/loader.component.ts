import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
 isLoading$: Observable<boolean>;

  constructor(private loader: LoaderService) {
    this.isLoading$ = this.loader.isLoading$;
  }
}
