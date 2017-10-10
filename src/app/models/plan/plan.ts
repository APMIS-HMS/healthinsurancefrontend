export interface Plan {
    name: String;
    planType: any;
    platformOwnerId: any;
    facilityId:any;
    userType:any;
    isActive: Boolean;
    premiums: PlanPremium[];
}

export interface PlanPremium {
    amount: Number;
    duration: Number;
    unit: String;
    durationInDay: Number;
    category: any;
}
