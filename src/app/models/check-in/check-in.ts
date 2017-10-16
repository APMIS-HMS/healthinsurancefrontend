export interface CheckIn {
    platformOwnerId: any;
    providerFacilityId: any;
    beneficiaryId: any;
    principalBeneficiaryId:any;
    encounterDateTime:Date;
    encounterStatus: any;
    encounterType: any;
    expirationStatus: any;
    preAuthorizationRequested: any;
    claimStatus: any;
    claimType:any;
    isTransitionCheckIn:Date;
    transitionCheckInId: any;
    confirmation: any;
    otp: any;
    checkOut: any;
    _id:any;
    beneficiaryObject:any;
}





















export interface PlanPremium {
    amount: Number;
    duration: Number;
    unit: String;
    durationInDay: Number;
    category: any;
}
