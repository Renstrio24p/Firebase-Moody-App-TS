
export type Image = {
    image: string,
    alt: string
}

export type InputTypes = HTMLInputElement | HTMLTextAreaElement | null

type Current = {
    id: string
}

export interface EventTypes extends MouseEvent {
    currentTarget: HTMLButtonElement & Current, 
}

export interface EventTriggers extends MouseEvent {
    target: HTMLButtonElement & Current, 
}

export interface CollectionOfButtons extends HTMLCollectionOf<HTMLButtonElement> {
    id: string
}

export interface DateType extends Date {
    toDate: ()=> Date
}

export type stringNumbers = string | number

export type MonthTypes = string[] & { length: 12 };

export interface ParagraphType extends HTMLParagraphElement {
    body: string;
}

