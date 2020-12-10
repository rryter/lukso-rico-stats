import { animate, group, keyframes, query, style, trigger } from '@angular/animations';
import { transition } from '@angular/animations';

export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    // Set a default  style for enter and leave
    query(
      ':enter',
      [
        style({
          transform: 'translateX(-105%)',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        style({
          transform: 'translateX(0)',
          opacity: 1,
        }),
      ],
      { optional: true }
    ),
    // Animate the new page in

    group([
      query(
        ':enter',
        [
          animate(
            '400ms 0ms',
            keyframes([
              style({
                opacity: 1,
                transform: 'translate3d(-1000px, 0, 0)',
                easing: 'ease',
                offset: 0,
              }),
              style({
                opacity: 1,
                transform: 'translate3d(20px, 0, 0)',
                easing: 'ease',
                offset: 0.8,
              }),
              style({
                opacity: 1,
                transform: 'translate3d(0px, 0, 0)',
                easing: 'ease',
                offset: 1,
              }),
            ])
          ),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          // animate('200ms ease', style({ opacity: 0, transform: 'translateX(105%)' })),
          animate(
            '300ms 0ms',
            keyframes([
              style({ opacity: 1, transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 0 }),
              style({
                opacity: 1,
                transform: 'translate3d(20px, 0, 0)',
                easing: 'ease',
                offset: 0.2,
              }),
              style({
                opacity: 0,
                transform: 'translate3d(-1000px, 0, 0)',
                easing: 'ease',
                offset: 1,
              }),
            ])
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);
