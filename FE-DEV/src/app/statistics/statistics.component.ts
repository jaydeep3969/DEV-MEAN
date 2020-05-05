import { Component, OnInit } from '@angular/core';
import { StatisticsManagementService } from 'src/services/statistics-management.service';
import { Statistics } from 'src/models/statistics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  data : any;
  stats : Statistics[];

  selected_item_type : string = "clothes";
  selected_time_type : string = "days"
  start_years = [];
  end_years : any[];
  dd_months = [];

  selected_start_year : number;
  selected_end_year : number;
  selected_month : number;

  labels = [];
  purchase_data  = [];
  sell_data  = [];
  profit_data  = [];
  expense_data  = [];

  total_purchase : number = 0;
  total_sell : number = 0;
  total_profit : number = 0;
  total_expense : number = 0;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','Sepetember','November','December'];
  
  constructor(private statsManagementService : StatisticsManagementService) { }

  ngOnInit() {
    this.load_stats();

    let i = 1;
    this.months.forEach(month => {
      this.dd_months.push({label : month, value : i});
      i++;
    });
    this.selected_month = new Date().getMonth() + 1;
  }

  load_stats() {
    this.statsManagementService.getStats()
      .subscribe(stats => {
          this.stats = stats;
          this.get_years();
          this.get_day_data();
        });
  }

  get_years() {
    var item = this.stats.find(i => i.item_type == 'clothes');
    item.value.forEach(year => { 
      this.start_years.push({label:''+year.year, value : year.year});
    })
    this.selected_start_year = this.start_years[this.start_years.length - 1].value;
  }

  set_endYears() {

    this.end_years = [];
    let year = this.selected_start_year + 1;
    let current_year = new Date().getFullYear();
    let end_year;

    if((this.selected_start_year + 9) <= current_year)
      end_year = this.selected_start_year + 9;
    else 
      end_year = current_year

    this.end_years.push({label : 'Selecet End Year', value : null});
    while (year <= end_year) {
      this.end_years.push({label : ''+year, value : year});
      year++;
    }
  }

  get_year_data(){

    this.total_purchase = 0;
    this.total_sell = 0;
    this.total_profit = 0;

    this.labels = [];
    let year = this.selected_start_year;

    if(this.selected_end_year)
    {
      while (year <= this.selected_end_year) {
        this.labels.push(year);
        year++;
      }
    }
    else 
      this.labels.push(year);
    

    var item = this.stats.find(i => i.item_type == this.selected_item_type);
    var years = item.value.filter(y => y.year >= this.labels[0] && y.year <= this.labels[this.labels.length -1]);
    
    years.forEach(year => {
      this.purchase_data.push(year.purchase);
      this.sell_data.push(year.sell);
      this.profit_data.push(year.profit);
      this.total_purchase += year.purchase;
      this.total_sell += year.sell;
      this.total_profit += year.profit;
    });

    this.get_expense();
    this.set_data();
  }

  get_month_data() {
    this.labels = this.months;
    var item = this.stats.find(i => i.item_type == this.selected_item_type);
    var year = item.value.find(y => y.year == this.selected_start_year);

    this.total_purchase = year.purchase;
    this.total_sell = year.sell;
    this.total_profit = year.profit;

    year.value.forEach(month => {
      this.purchase_data.push(month.purchase);
      this.sell_data.push(month.sell);
      this.profit_data.push(month.profit);
    });

    this.get_expense();
    this.set_data();
  }

  get_day_data(){
    this.labels = [];
    var item = this.stats.find(i => i.item_type == this.selected_item_type);
    var year = item.value.find(y => y.year == this.selected_start_year);
    var month = year.value.find(m => m.month == this.selected_month);

    this.total_purchase = month.purchase;
    this.total_sell = month.sell;
    this.total_profit = month.profit;

    month.value.forEach(day => {
      this.labels.push(day.day);
      this.purchase_data.push(day.purchase);
      this.sell_data.push(day.sell);
      this.profit_data.push(day.profit);
    });

    this.get_expense();
    this.set_data();
  }

  get_expense(){
    
    var item = this.stats.find(i => i.item_type == 'clothes');
    
    if(this.selected_time_type == 'years'){
      this.total_expense = 0;
      var years = item.value.filter(y => y.year >= this.labels[0] && y.year <= this.labels[this.labels.length -1]);
      years.forEach(year => {
        this.expense_data.push(year.expense);
        this.total_expense += year.expense;
      });
    }
    else if(this.selected_time_type == 'months'){
      var year = item.value.find(y => y.year == this.selected_start_year);
      this.total_expense = year.expense;

      year.value.forEach(month => {
        this.expense_data.push(month.expense);
      });
    }
    else if(this.selected_time_type == 'days'){
      var year = item.value.find(y => y.year == this.selected_start_year);
      var month = year.value.find(m => m.month == this.selected_month);
      this.total_expense = month.expense;
      
      month.value.forEach(day => {
        this.expense_data.push(day.expense);
      });   
    } 
  }

  get_data() {
    this.purchase_data = [];
    this.sell_data = [];
    this.profit_data = [];
    this.expense_data = [];
    if (this.selected_time_type == 'years')
    {
      this.get_year_data();
    }
    else if (this.selected_time_type == 'months')
    {
      this.get_month_data();
    }
    else if (this.selected_time_type == 'days')
    {
      this.get_day_data();
    }
  }

  set_data() {
    this.data = 
    {
      labels: this.labels,
      datasets: [
        {
            label: 'Purchase',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            data: this.purchase_data
        },
        {
            label: 'Sell',
            backgroundColor: '#800080',
            borderColor: '#8B008B',
            data: this.sell_data
        },
        {
          label: 'Profit',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: this.profit_data
        },
        {
            label: 'Expense',
            backgroundColor: '#FF0000',
            borderColor: '#FF4500',
            data: this.expense_data
        }
      ]
    }
  }

  overall_data(){
    let items = ["clothes","electronics","automobiles"];
    let o_purchase = [];
    let o_sell = [];
    let o_profit = [];
    let o_expense = [];
    let purchases = 0;
    let sells = 0;
    let profits = 0;

    items.forEach(item => {
      this.selected_item_type = item;
      this.get_data();

      for (let i = 0; i < this.purchase_data.length; i++) {
        if(item == 'clothes')
        {
          o_purchase.push(this.purchase_data[i]);
          o_sell.push(this.sell_data[i]);
          o_profit.push(this.profit_data[i]);
        }
        else
        {
          o_purchase[i] += this.purchase_data[i];
          o_sell[i] += this.sell_data[i];
          o_profit[i] += this.profit_data[i];
        }
        
      }

      purchases += this.total_purchase;
      sells += this.total_sell;
      profits += this.total_profit;
    });

    this.purchase_data = o_purchase;
    this.sell_data = o_sell;
    this.profit_data = o_profit;
    this.expense_data = o_expense;
    this.total_purchase = purchases;
    this.total_sell = sells;
    this.total_profit = profits;
    this.selected_item_type = 'overall';
    this.get_expense();
    this.set_data();
  }

}
