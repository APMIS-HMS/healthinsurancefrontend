import { Image } from './image';
import { NextOfKin } from './next-of-kin';
import { Address } from '../organisation/address';

export interface Person {
    platformOnwerId: String;
    firstName: String;
    lastName: String;
    otherNames: String;
    email: String;
    phoneNumber: String;
    title: any;
    profileImageObject: Image;
    homeAddress: Address;
    dateOfBirth: Date;
    gender: String;
    nationality: any;
    stateOfOrigin: any;
    lgaOfOrigin: any;
    maritalStatus: any;
    nextOfKin: NextOfKin[];
    organisations: any[];
}