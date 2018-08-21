export const GRADES = [
  {'id': 'A', 'name': 'A'}, {'id': 'B', 'name': 'B'}, {'id': 'C', 'name': 'C'},
  {'id': 'D', 'name': 'D'}, {'id': 'E', 'name': 'E'}
];
export const ASHIA_STATUSES = [{'id': 'Accredited', 'name': 'Accredited'}];
export const DURATIONS = [
  {'id': 1, 'name': 'Year', 'days': 365},
  {'id': 2, 'name': 'Month', 'days': 30}, {'id': 3, 'name': 'Week', 'days': 7},
  {'id': 4, 'name': 'Day', 'days': 1}
];

export const REQUEST_STATUS = [
  {'id': 1, 'name': 'Pending', 'past': 'Pending'},
  {'id': 2, 'name': 'Approve', 'past': 'Approved'},
  {'id': 3, 'name': 'Reject', 'past': 'Rejected'},
  {'id': 4, 'name': 'Query', 'past': 'Queried'},
  {'id': 5, 'name': 'Hold', 'past': 'Held'}
];

export const SPONSORSHIP =
    [{'id': 1, 'name': 'Self'}, {'id': 2, 'name': 'Organization'}];

export const SPONSORSHIPTYPE =
    [{'id': 1, 'name': 'Employee'}, {'id': 2, 'name': 'Sponsor'}];

export const PAYMENTTYPES = [
  {'id': 1, 'name': 'Cash', default: false},
  {'id': 2, 'name': 'Cheque', default: false},
  {'id': 3, 'name': 'e-Payment', default: true}
];

export const PRE_MEDICAL_CONDITIONS = [
  { 'id': 1, 'name': 'Diabetics' },
  { 'id': 2, 'name': 'Hypertension' },
  { 'id': 3, 'name': 'Sickle Cell' },
  { 'id': 4, 'name': 'Cancer' },
  { 'id': 5, 'name': 'Kidney Issue' },
  { 'id': 6, 'name': 'Liver Issue' }
];

export const BLOOD_GROUPS = [
  { 'id': 1, 'name': 'AA' },
  { 'id': 2, 'name': 'AS' },
  { 'id': 3, 'name': 'SS' }
];

export const GENOTYPES = [
  { 'id': 1, 'name': 'O+' },
  { 'id': 2, 'name': 'A' },
  { 'id': 3, 'name': 'O-' }
];

export const CurrentPlaformShortName = 'ASHIA';
export const FORM_VALIDATION_ERROR_MESSAGE =
    'One or more required fields are missing!';
export const PAYSTACK_CLIENT_KEY =
    'pk_test_7683929cd561b84d03eab635843f6a21c17dca60';  // 'pk_test_3c53bcffeb3c889d04ea0f905c44d36fc342aa85';
export const FLUTTERWAVE_PUBLIC_KEY =
    'FLWPUBK-8da67f59fe34994e78c5f77022ba8178-X';  // Add public keys generated
                                                   // on your dashboard here
export const MAXIMUM_NUMBER_OF_DEPENDANTS = 5;
export const TABLE_LIMIT_PER_VIEW = 10;
