import { BankDetail } from './bank-detail';
import { Address } from './address';
import { Employer } from './employer';
import { HIA } from './hia';
import { Provider } from './provider';
import { Contact } from './contact';

export interface Facility {
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    businessContact: Contact;
    hmoContact: Contact;
    itContact: Contact;
    provider?: Provider;
    hia?: HIA;
    employer?: Employer;
    logo?: any;
    address?: Address;
    bankDetails?: BankDetail;
    facilityType?: any;
    platformOwnerId: any;
    website: string;
    lasraaId: string;
    shortName: string;
    verificationToken: string;
    isTokenVerified: boolean;
    isConfirmed: boolean;
}
