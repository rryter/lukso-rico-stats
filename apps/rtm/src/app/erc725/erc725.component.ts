import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'lukso-erc725',
  templateUrl: './erc725.component.html',
  styleUrls: ['./erc725.component.css'],
})
export class Erc725Component implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: { address: string }) => {
      if (params.address) {
        this.router.navigate(['accounts', params.address]);
      }
    });
  }
}
