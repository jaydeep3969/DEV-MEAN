import { CustomerElectronic } from '../customers/customer-electronic';
import { Deposite } from '../deposite';

export class ItemsElectronic {
    product_name : string;
    quantity : number = 0;
    rate : number;
    amount : number = 0;
    warranty_details : string;
    profit : number = 0;
    model_no : string;
    sr_no : string[] = [];
}

export class BillElectronics {
    _id : String;
    invoice_no_ele : Number;
    invoice_date : Date = new Date();
    receiver : any;
    new_receiver : CustomerElectronic;
    items : ItemsElectronic[];
    total_amount : Number = 0;
    cgst : Number = 14;
    sgst : Number = 14;
    bill_amount : Number = 0;
    in_words : String;
    profit : Number = 0;
    deposite : Deposite[] = [];
    due_amount : Number = 0;
    bank_detail : boolean = true;
}
