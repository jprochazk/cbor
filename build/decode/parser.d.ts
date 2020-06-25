import { View } from 'common/view';
export declare class Parser {
    private readonly view;
    private current_value;
    private readonly sax;
    constructor(view: View, max_depth?: number);
    parse(): string | number | boolean | {
        [index: string]: any;
    } | null | undefined;
    private get;
    private get_string;
    private get_array;
    private get_object;
}
