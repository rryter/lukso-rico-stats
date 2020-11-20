import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lukso-layout-reduced',
  templateUrl: './layout-reduced.component.html',
  styleUrls: ['./layout-reduced.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutReducedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
