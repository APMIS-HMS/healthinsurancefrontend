export interface Beneficiary {
    facilityId: string,
    patientId: string,
    dob: Date;
    lasrraId: string,
    noOfChildrenUnder18: number,
    noOfDependants: number,
    spouse: any,
    hiaId: string,
    hiaProgramTypeId: string,
    hiaNameId: string,
    phcpId: string,
    dependants: any
}