export interface Claim {
    platformOwnerId: any; // platform owner object
    claimId: String;
    providerId: String;
    beneficialDetail: any;
    checkedinDetail: any;
    documentation: any;
    CurentClaimStatus: any;
    claimType: any; // either fee for service or Capitation.
    approval: any;
    medicalPersonelName: any;
    medicalPersonelShortName: String;
    authorizationCode: String;
    costingApprovalDocumentation: Number;
    paymentStatus: any;
    approvedDocumentation: any;
    notificationMessage: any;
    isChecked: Boolean;
    totalAmount: Number;
}