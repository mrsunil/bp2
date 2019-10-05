import { ExecutionService } from "../services/http-services/execution.service";
import { SectionIdentifiers } from "../services/execution/dtos/section";
import { Observable, of } from "rxjs";

export class MockExecutionService extends ExecutionService {
	allocatedTo(sectionId: number): Observable<SectionIdentifiers> {
		let sectionIdentifiers: SectionIdentifiers = null;
		return of(sectionIdentifiers);
	}
}
