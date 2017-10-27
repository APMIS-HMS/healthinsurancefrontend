export interface Authorization {
    checkedInDetails: any;
    documentation: PreAuthorizationDocument[];
    approval?: Date;
    medicalPersonelName: any;
    medicalPersonelUnit:any;
    authorizationCode?: any;
    approvedDocumentation: any[];
    notificationMessage?: any;
    providerFacilityId: any;
    dateOfRequest: Date;
    timeOfRequest: Date;
    isEmergency: boolean;
    visityClassId: any;
    approvedStatus:any;
    personId:any;
    policyId:any;
    _id: any;
}

export interface PreAuthorizationDocument {
    document: Document[];
    response?: any;
    approvedStatus:any;
    destinationProvider?:any;
    _id: any;
    createdAt:Date;
}

export interface Document {
    type: any;
    clinicalDocumentation: any;
    approvedStatus:any;
    order:number;
    _id: any;
}