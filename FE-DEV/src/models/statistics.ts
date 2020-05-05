export class Statistics {
    _id : string;
    item_type : string;
    value : [ {
                year : number;
                profit : number;
                sell : number;
                purchase : number;
                expense : number;
                value : [
                    {
                        month : number;
                        profit : number;
                        sell : number;
                        purchase : number;
                        expense : number;
                        value : [
                            {
                                day : number;
                                profit : number;
                                sell : number;
                                purchase : number;
                                expense : number;
                            }
                        ]
                    }
                ]
             }
        ]
}
