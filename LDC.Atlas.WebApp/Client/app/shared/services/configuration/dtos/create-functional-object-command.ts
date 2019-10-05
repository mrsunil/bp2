import { FunctionalObjectTableFields } from './functional-object-table-fields';

export class CreateFunctionalObjectCommand {
    name: string;
    keys: FunctionalObjectTableFields[];
}
