export interface Plan {
    name: String;
    planType: any;
    planOwner: String;
    isActive: Boolean;
    premiums: PlanPremium[];
};

export interface PlanPremium {
    amount: Number;
    duration: Number;
    unit: String;
    durationInDay: Number;
};