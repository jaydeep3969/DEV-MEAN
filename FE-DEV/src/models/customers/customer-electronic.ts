import { Address } from '../address';

export class CustomerElectronic {
    _id : String;
    name : String;
    contact : Number;
    gst : String;
    address : Address = new Address();
    due_amount : Number = 0;
    bills : any[] = [];
}
