import { Injectable } from '@angular/core';


@Injectable()
export class DummyClaimService {
    data: any = [{
        platformOwnerId: { id: '302309230923fusd8230'},
        beneficialDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
        checkedinDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
        documentation: { name: 'John Doe', id: '2039jdf98230sd23' },
        CurentClaimStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
        claimType: { name: 'John Doe', id: '2039jdf98230sd23' },
        approval: { name: 'John Doe', id: '2039jdf98230sd23' },
        medicalPersonelName: { name: 'John Doe', id: '2039jdf98230sd23' },
        medicalPersonelShortName: 'John doe Smith',
        authorizationCode: 'JD',
        costingApprovalDocumentation: 1500,
        paymentStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
        approvedDocumentation: { name: 'John Doe', id: '2039jdf98230sd23' },
        notificationMessage: { name: 'John Doe', id: '2039jdf98230sd23' },
        isChecked: false,
        totalAmount: 1500
    },
        {
            platformOwnerId: { id: '302309230923fusd8230' },
            beneficialDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
            checkedinDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
            documentation: { name: 'John Doe', id: '2039jdf98230sd23' },
            CurentClaimStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
            claimType: { name: 'John Doe', id: '2039jdf98230sd23' },
            approval: { name: 'John Doe', id: '2039jdf98230sd23' },
            medicalPersonelName: { name: 'John Doe', id: '2039jdf98230sd23' },
            medicalPersonelShortName: 'John doe Smith',
            authorizationCode: 'JD',
            costingApprovalDocumentation: 1500,
            paymentStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
            approvedDocumentation: { name: 'John Doe', id: '2039jdf98230sd23' },
            notificationMessage: { name: 'John Doe', id: '2039jdf98230sd23' },
            isChecked: false,
            totalAmount: 1500
        }];

    constructor(
    ) {
    }

    get() {
        return new Promise((resolve, reject) => {
            resolve(this.data);
        });
    }

}