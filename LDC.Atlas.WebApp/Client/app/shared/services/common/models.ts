export interface ApiCollection<T> {
    value?: T[];
}

export interface ApiPaginatedCollection<T> extends ApiCollection<T> {
    offset?: number;
    limit?: number;
    count?: number;
}
