import { FirebaseError, FirebaseOptions } from "firebase/app";
import { UserCredential } from "firebase/auth";
import { FileReadOptions } from "fs/promises";
import { DateType } from "../../components/types/TypeOf";

export interface FirebaseTypes extends FirebaseOptions {
    readonly apiKey: string | undefined,
    readonly authDomain: string | undefined,
    readonly projectId: string | undefined,
    readonly storageBucket: string | undefined,
    readonly messagingSenderId: string | undefined,
    readonly appId: string | undefined
}

type Data = {
    email: UserCredential | null
}

export interface ErrorType extends FirebaseError {
    code: string,
    customData: Data,
}

export interface UserType extends FileReadOptions {
    displayName: string,
    photoURL?: string,
    email?: string,
    emailVerified?: boolean,
    uid?: string,
} 




export interface PostType extends FirebaseOptions {
    mood: number,
    createdAt: DateType,
    body: string,
    doc: DocumentType,
    data: Function,
    id: number | string,
    
}

export interface PostData {
    createdAt: Date;
    mood: string;
    body: string;
}