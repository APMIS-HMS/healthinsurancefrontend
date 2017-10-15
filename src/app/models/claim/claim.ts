export interface Claim {
    beneficialDetail: any;
    checkedinDetail: any;
    documentation: any[];
    CurentClaimStatus:any;
    approval:Date;
    medicalPersonelName: any;
    medicalPersonelShortName: any;
    authorizationCode: any;
    costingApprovalDocumentation: any;
    paymentStatus: any;
    claimType:any;
    approvedDocumentation:any[];
    notificationMessage: any;
    confirmation: any;
    otp: any;
    checkOut: any;
    _id:any;
}

export interface ClaimDocument {
    clinicalDocument: any,
    response: any,
}