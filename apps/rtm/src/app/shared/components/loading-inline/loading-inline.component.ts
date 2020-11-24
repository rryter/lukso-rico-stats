import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lukso-loading-inline',
  templateUrl: './loading-inline.component.html',
  styleUrls: ['./loading-inline.component.scss'],
})
export class LoadingInlineComponent implements OnInit {
  @Input() loading = true;
  constructor() {}

  ngOnInit(): void {}
}
