import { User } from "../entities/user.entity";

export class UserListItemViewModel  {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	location: string;
	userPrincipalName: string;
	samAccountName: string;
	isActivated: string;

	constructor(user: User) {
		this.id = user.userId;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.email = user.email;
		this.phoneNumber = user.phoneNumber;
		this.location = user.location;
		this.userPrincipalName = user.userPrincipalName;
		this.samAccountName = user.samAccountName;
		this.isActivated = (user.isDisabled) ? "No" : "Yes";
	}
}
