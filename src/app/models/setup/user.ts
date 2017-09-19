import { Role } from './role';
export interface User {
    _id: string;
    email: string;
    password: string;
    personId: string;
    facilitiesRole: Role[];
    person: any;
    corporateOrganisationId: string;
    passwordToken: string;
}
