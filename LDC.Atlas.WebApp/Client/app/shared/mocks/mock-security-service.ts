import { SecurityService } from "../services/security.service";

export class MockSecurityService extends SecurityService {
	isReady = true;
}
