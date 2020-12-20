import { Component, Input, OnInit } from '@angular/core';
import { Asset } from '@shared/interface/asset';

@Component({
  selector: 'lukso-overview-assets',
  templateUrl: './overview-assets.component.html',
  styleUrls: ['./overview-assets.component.scss'],
})
export class OverviewAssetsComponent implements OnInit {
  @Input() assets: Asset[] = [
    {
      title: 'Nike Air Max Tailwind V SP',
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/c4cf48f0-013e-49e6-a953-c7ceb54ec902/air-max-97-shoe-h6hqBR.jpg',
    },
    {
      title: 'Nike Court Vintage Premium',
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/b7691c80-430e-41a6-8f55-6af9f546bb42/court-vintage-shoe-PgwXmd.jpg',
    },
    {
      title: 'Nike Air Force 1 React',
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/9ef5bc51-9e9f-40a7-86a4-13d746b8a11b/air-force-1-react-shoe-VF4bwV.jpg',
    },
    {
      title: 'Nike Air Max VG-R',
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/ebd80b42-faf5-4831-b94a-dfeebcc7a486/air-max-vg-r-shoe-MT3xPJ.jpg',
    },
    {
      title: 'Nike Air Max 90',
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/ae6f8741-640d-4369-811d-a180bad250ce/air-max-90-shoe-bd1PN5.jpg',
    },
    {
      title: 'Nike Air Max Tailwind V SP',
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/59134415-2a8b-4bae-8966-ac925373e99a/air-max-90-shoe-Hfq027.jpg',
    },
    {
      title: 'Nike Air Max Tailwind V SP',
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/cf7184c5-d8b3-44b4-bc79-26340d600884/kyrie-7-sisterhood-basketball-shoe-hv6LdK.jpg',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
