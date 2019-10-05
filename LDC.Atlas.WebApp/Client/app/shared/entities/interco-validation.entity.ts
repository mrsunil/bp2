export class IntercoValidation {
    companyId: string;
    intercoFields: IntercoField[];
}

export class IntercoField {
    groupId: number;
    type: string;
    name: string;
    value: (string | number);
    mappingName: string;
    setValue: string;
}
