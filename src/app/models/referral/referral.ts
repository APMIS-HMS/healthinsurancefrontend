import { PreAuthorizationDocument } from '../authorization/authorization';
export interface ReferralAuthorization {
    checkedInDetails: any;
    documentation: PreAuthorizationDocument[];
    approval?: Date;
    medicalPersonelName: any;
    medicalPersonelUnit: any;
    authorizationCode?: any;
    approvedDocumentation: any[];
    notificationMessage?: any;
    providerFacilityId: any;
    dateOfRequest: Date;
    timeOfRequest: Date;
    isEmergency: boolean;
    visityClassId: any;
    approvedStatus: any;
    policyId: any;
    referingProvider: any;
    destinationProvider: any;
    hiaApproved: any
    _id: any;
}
