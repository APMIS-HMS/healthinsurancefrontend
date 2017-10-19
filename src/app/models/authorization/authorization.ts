export interface Authorization {
    checkedInDetails: any;
    documentation: PreAuthorizationDocument[];
    approval?: Date;
    medicalPersonelName: any;
    authorizationCode?: any;
    approvedDocumentation: any[];
    notificationMessage?: any;
    providerFacilityId: any;
    dateOfRequest: Date;
    timeOfRequest: Date;
    isEmergency: boolean;
    visityClassId: any;
    approvedStatus:any;
    policyId:any;
    _id: any;
}

export interface PreAuthorizationDocument {
    document: Document[];
    response?: any[];
    approvedStatus:any;
}

export interface Document {
    type: any;
    clinicalDocumentation: any;
    approvedStatus:any;
    order:number;
}