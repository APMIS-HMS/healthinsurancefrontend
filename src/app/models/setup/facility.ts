export interface Facility {
    _id: string;
    name: string;
    email: string;
    contactPhoneNo: string;
    contactFullName: string;
    checkValidation: string;
    departments: [any];
    minorLocations: [any];
    facilityTypeId: string;
    facilityClassId: string;
    address: any;
    addressObj: any;
    verificationToken: string;
    website: string;
    shortName: string;
    password?: string;
    facilityItem?: any;
    countryItem?: any;
    wardId?:string;
    logo: any;
    isTokenVerified: boolean;
    facilitymoduleId: [any];
    logoObject: any;
}
