import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { fader } from '@shared/animaitons/route.animation';
import { Contracts } from '@shared/interface/contracts';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'lukso-account-editor',
  templateUrl: './account-editor.component.html',
  styleUrls: ['./account-editor.component.scss'],
  animations: [fader],
})
export class AccountEditorComponent implements OnInit {
  contracts$: Observable<Contracts>;
  constructor(private activatedRoute: ActivatedRoute) {
    this.contracts$ = this.activatedRoute.data.pipe(pluck('contracts'));
  }

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
    // return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
