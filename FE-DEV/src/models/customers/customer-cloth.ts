import { Address } from '../address';

export class CustomerCloth {
    _id : String;
    name : String;
    contact : Number;
    gst : String;
    address : Address = new Address();
    bills : any[] = [];
}
