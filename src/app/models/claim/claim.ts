export interface Claim {
    checkedinDetail: any;
    documentations: any[];
    CurentClaimStatus: any;
    approval: Date;
    claimNote: any;
    medicalPersonelName: any;
    medicalPersonelUnit:any;
    medicalPersonelShortName: any;
    authorizationCode: any;
    costingApprovalDocumentation: any;
    paymentStatus: any;
    claimType: any;
    approvedDocumentation: any[];
    notificationMessage: any;
    providerFacilityId: any;
    isChecked?: Boolean;
    isQueuedForPayment?: Boolean;
    _id: any;
    visitClass:any;
    index:any;
    claimNo:any;
}