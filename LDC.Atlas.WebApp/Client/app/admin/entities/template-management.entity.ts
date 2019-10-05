import { Tag } from '../../shared/entities/tag.entity';

export class TemplateManagement {
    entityExternalId: string;
    entityId: string;
    name: string;
    isDeactivated: boolean;
    tags: Tag[];
}
