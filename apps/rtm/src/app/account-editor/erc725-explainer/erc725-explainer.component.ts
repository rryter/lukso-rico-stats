import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lukso-erc725-explainer',
  templateUrl: './erc725-explainer.component.html',
  styleUrls: ['./erc725-explainer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Erc725ExplainerComponent implements OnInit {
  deploymentInProgress = false;
  constructor(private router: Router) {}

  ngOnInit(): void {}
  cancel() {
    this.router.navigate(['/']);
  }
  onFinished() {
    this.deploymentInProgress = true;
  }
}
