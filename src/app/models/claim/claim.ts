export interface Claim {
    checkedinDetail: any;
    documentation: any[];
    CurentClaimStatus: any;
    approval: Date;
    claimNote: any;
    medicalPersonelName: any;
    medicalPersonelShortName: any;
    authorizationCode: any;
    costingApprovalDocumentation: any;
    paymentStatus: any;
    claimType: any;
    approvedDocumentation: any[];
    notificationMessage: any;
    providerFacilityId: any;
    isQueuedForPayment?: Boolean;
    _id: any;
}

export interface ClaimDocument {
    clinicalDocument: any;
    response: any;
}