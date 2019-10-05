
import {of as observableOf,  Observable } from 'rxjs';
import { MasterdataService } from "../services/http-services/masterdata.service";
import { MasterData } from "../entities/masterdata.entity";

export class MockMasterdataService extends MasterdataService {
	getMasterData(list: string[]): Observable<MasterData> {
        let mockMasterData = new MasterData();
        mockMasterData.fixTypes = [
            {
                code: "AA",
                description: "Against Actuals"
            }
        ];
		return observableOf(mockMasterData);
	}
}
