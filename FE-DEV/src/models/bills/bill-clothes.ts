import { Address } from '../address';
import { CustomerCloth } from '../customers/customer-cloth';

export class ItemsCloth {
    description : String;
    hsn_cd : String;
    pcs : number;
    cut : String;
    meters : number;
    rate : number;
    uqc : string = "KGS";
    amount : number = 0;
    profit : number = 0;
}

export class BillClothes {
    _id : string;
    invoice_no_cloth : Number;
    invoice_date : Date = new Date();
    challan_no : Number;
    supply_date : Date;
    receiver : any;
    new_receiver : CustomerCloth;
    consignee_name : String;
    consignee_contact : Number;
    shipped_to : Address = new Address();
    items : ItemsCloth[];
    total_amount : Number = 0;
    cgst : Number = 6;
    sgst : Number = 6;
    bill_amount : Number = 0;
    in_words : String;
    due_date : Date;
    profit : Number = 0;
    bank_detail : boolean = true;
}
