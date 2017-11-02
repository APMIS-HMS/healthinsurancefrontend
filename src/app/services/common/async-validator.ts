import { BeneficiaryService } from './../beneficiary/beneficiary.service';
import { PersonService } from './../person/person.service';
import { Observable } from 'rxjs/Rx';
import { Validator, AbstractControl } from "@angular/forms";
import addYears from 'date-fns/add_years';

export default class AsyncValidator implements Validator {
    constructor(private _beneficiaryService: BeneficiaryService) {

    }
    validate(c: AbstractControl): { [key: string]: any; } {
        console.log(c)
        return this.validateUniqueEmailObservable(c.value);
    }
    registerOnValidatorChange?(fn: () => void): void {
        throw new Error("Method not implemented.");
    }

    validateUniqueEmailObservable(date: Date) {
        console.log(date)
        // return new Observable(observer => {
        //     // if (email === "alreadyExistsEmail@gmail.com") {
        //     //     observer.next({ asyncInvalid: true });
        //     // } else {
        //     //     observer.next(null);
        //     // }
        // });
        // date = date.
        date = addYears(date, 18);
        return Observable.of(this._beneficiaryService.validateAge({}))
    }
}

