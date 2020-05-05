import { Address } from '../address';

export class CustomerAutomobile {
    _id : String;
    name : String;
    contact : Number;
    address : Address = new Address();
    bills : any[] = [];
    gst : String;
}
