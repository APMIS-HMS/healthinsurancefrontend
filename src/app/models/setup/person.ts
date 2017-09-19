import { Address } from '../index';
export interface Person {
    _id: string;
    apmisId: string;
    titleId: string;
    firstName: string;
    lastName: string;
    otherNames?: string;
    genderId: string;
    biometric?: any;
    profileImage: any;
    homeAddress: Address;
    phoneNumber: string;
    nationalityId: string;
    stateOfOriginId: string;
    lgaOfOriginId: string;
    email: string;
    maritalStatusId: string;
    nextOfKin: any[];
    dateOfBirth: Date;
    profileImageObject: any;
}
