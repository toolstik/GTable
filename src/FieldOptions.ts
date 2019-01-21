class FieldOptions {
    name: string;
    columnIndex?: number;
    columnName?: string;
    public static IndexField(): FieldOptions {
        return {
            name: "__index"
        };
    }
    ;
}
