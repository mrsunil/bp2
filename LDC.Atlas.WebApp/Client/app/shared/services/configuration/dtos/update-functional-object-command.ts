import { FunctionalObjectTableFields } from './functional-object-table-fields';

export class UpdateFunctionalObjectCommand {
    id: number;
    name: string;
    keys: FunctionalObjectTableFields[];
}
