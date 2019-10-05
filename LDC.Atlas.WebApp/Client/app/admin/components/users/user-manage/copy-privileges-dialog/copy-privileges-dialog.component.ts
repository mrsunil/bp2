import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { User } from '../../../../../shared/entities/user.entity';
import { ApiCollection } from '../../../../../shared/services/common/models';
import { UserIdentityService } from '../../../../../shared/services/http-services/user-identity.service';

@Component({
	selector: "atlas-copy-privileges-dialog",
	templateUrl: "./copy-privileges-dialog.component.html",
	styleUrls: ["./copy-privileges-dialog.component.scss"],
})
export class CopyPrivilegesDialogComponent implements OnInit {
	filteredUsers: Observable<ApiCollection<User>>;
	userForm: FormGroup;
	userCtrl: FormControl;

	constructor(
		public thisDialogRef: MatDialogRef<CopyPrivilegesDialogComponent>,
		public userIdentityService: UserIdentityService,
		private fb: FormBuilder,
	) {
	}

	ngOnInit() {
		this.userCtrl = new FormControl();
		this.userForm = this.fb.group({
			userCtrl: this.userCtrl,
		});
		this.filteredUsers = this.userCtrl
			.valueChanges
			.pipe(
				debounceTime(300),
				switchMap((value) => value.length > 2
					? this.userIdentityService.searchUserByName(value)
					: []));
	}

	onCloseConfirm() {
		let user = this.userCtrl.value as User;
		if (user.userId) {
			this.thisDialogRef.close(user);
		} else {
			this.userCtrl.setErrors({ 'inDropdownList': true });
		}
	}

	onCloseCancel() {
		this.thisDialogRef.close(null);
	}
}
