import { CustomerAutomobile } from '../customers/customer-automobile';

export class ItemsAutomobile {
    brand_name : string;
    model_name : string;
    quantity : number = 0;
    rate : number;
    amount : number = 0;
    warranty_details : string;
    profit : number = 0;
    sr_no : string[] = [];
}

export class BillAutomobiles {
    _id : String;
    invoice_no_auto : Number;
    invoice_date : Date = new Date();
    receiver : any;
    new_receiver : CustomerAutomobile;
    items : ItemsAutomobile[];
    total_amount : Number = 0;
    cgst : Number = 14;
    sgst : Number = 14;
    bill_amount : Number = 0;
    in_words : String;
    profit : Number = 0;
}
