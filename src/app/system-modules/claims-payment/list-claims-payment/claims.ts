import { Injectable } from '@angular/core';


@Injectable()
export class DummyClaimService {
    data: any = [{
        _id: 1,
        claimNo: 'sdpa3-4-3423',
        providerFacilityId: 'iasda0342k3n2on3',
        platformOwnerId: { id: '302309230923fusd8230'},
        beneficialDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
        checkedinDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
        documentation: { name: 'John Doe', id: '2039jdf98230sd23' },
        CurentClaimStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
        claimType: { name: 'John Doe', id: '2039jdf98230sd23' },
        approval: { name: 'John Doe', id: '2039jdf98230sd23' },
        medicalPersonelName: 'John Doe',
        medicalPersonelShortName: 'JD',
        authorizationCode: 'JD54543',
        costingApprovalDocumentation: 1500,
        paymentStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
        approvedDocumentation: { name: 'John Doe', id: '2039jdf98230sd23' },
        notificationMessage: { name: 'John Doe', id: '2039jdf98230sd23' },
        isChecked: false,
        isQueuedForPayment: false,
        totalAmount: 55500
    },
        {
            _id: 2,
            claimNo: 'sdpa3-4-3423',
            providerFacilityId: 'iasda0342k3n2on3',
            platformOwnerId: { id: '302309230923fusd8230' },
            beneficialDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
            checkedinDetail: { name: 'John Doe', id: '2039jdf98230sd23' },
            documentation: { name: 'John Doe', id: '2039jdf98230sd23' },
            CurentClaimStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
            claimType: { name: 'John Doe', id: '2039jdf98230sd23' },
            approval: { name: 'John Doe', id: '2039jdf98230sd23' },
            medicalPersonelName: 'Smith Van',
            medicalPersonelShortName: 'JD',
            authorizationCode: 'JD54543',
            costingApprovalDocumentation: 1500,
            paymentStatus: { name: 'John Doe', id: '2039jdf98230sd23' },
            approvedDocumentation: { name: 'John Doe', id: '2039jdf98230sd23' },
            notificationMessage: { name: 'John Doe', id: '2039jdf98230sd23' },
            isChecked: false,
            isQueuedForPayment: false,
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
