export interface Validator {
    name: string;
    validator: any;
    message: string;
}
export interface FieldConfig {
    label?: string;
    sectionLabel?: string;
    name?: string;
    inputType?: string;
    options?: any[];
    optionLabel?: string;
    collections?: any;
    sectionType?: any;
    type: string;
    value?: any;
    validations?: Validator[];
}