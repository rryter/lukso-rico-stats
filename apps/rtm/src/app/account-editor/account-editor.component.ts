import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fader } from '@shared/animaitons/route.animation';

@Component({
  selector: 'lukso-account-editor',
  templateUrl: './account-editor.component.html',
  styleUrls: ['./account-editor.component.scss'],
  animations: [fader],
})
export class AccountEditorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
    // return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
