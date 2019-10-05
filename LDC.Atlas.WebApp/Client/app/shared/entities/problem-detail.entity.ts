import { HttpErrorResponse } from "@angular/common/http";

export class ProblemDetail {
	public type: string;
	public title: string;
	public status: number;
	public detail: string;
	public instance: string;
}
