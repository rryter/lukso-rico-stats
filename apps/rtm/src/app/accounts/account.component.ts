import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'lukso-erc725',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class Erc725Component implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.address) {
        this.router.navigate(['accounts', params.address]);
      }
    });
  }
}
