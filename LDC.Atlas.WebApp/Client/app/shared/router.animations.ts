import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

export const routerTransition = trigger('routerTransition',
	[
		transition('* <=> *',
			[
                /* order */
                /* 1 */ query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
                /* 2 */ group([// block executes in parallel
					query(':enter',
						[
							style({ /*transform: 'translateY(10%)',*/ opacity: 0 }),
							animate('0.3s ease-in', style({ /*transform: 'translateY(0%)',*/ opacity: 1 }))
						],
						{ optional: true }),
					query(':leave',
						[
							style({ /*transform: 'translateY(0%)',*/ opacity: 1 }),
							animate('0.3s ease-out', style({ /*transform: 'translateY(10%)', */opacity: 0 }))
						],
						{ optional: true })
				])
			])
	]);
