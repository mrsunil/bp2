import { Tag } from "../entities/tag.entity";

export interface TemplateWithTags {
    entityId: number;
    name: string;
    tags: Array<Tag>;
    value: string;
    isDeactivated: boolean;
    isSelected: boolean;
}