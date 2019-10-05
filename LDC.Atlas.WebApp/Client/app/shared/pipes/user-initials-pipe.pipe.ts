import { Pipe, PipeTransform } from '@angular/core';

import { Trader } from '../entities/trader.entity';
import { User } from '../entities/user.entity';

@Pipe({
	name: 'userInitials',
})
export class UserInitialsPipePipe implements PipeTransform {
	transform(value: User | Trader, args?: any): string {
		return (
			value.firstName.substr(0, 1) + value.lastName.substr(0, 2)
		).toUpperCase();
	}
}
