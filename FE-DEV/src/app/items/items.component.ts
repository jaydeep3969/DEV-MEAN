import { Component, OnInit } from '@angular/core';
import { ItemsManagementService } from 'src/services/items-management.service';
import { Clothes } from 'src/models/items/clothes';
import { Electronics } from 'src/models/items/electronics';
import { Brands } from 'src/models/items/automobile/brands';
import { Submodels } from 'src/models/items/automobile/submodels';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  selected_item_type : string;
  items : any[];
  cols : any[];
  cols_brand : any[];
  new_item : any = new Clothes();
  add_item : boolean = false;
  add_submodel : boolean = false;
  edit_item : boolean = false;
  edit_submodel : boolean = false;
  item_header : string;

  constructor(private itemsManagementService : ItemsManagementService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.selected_item_type = "clothes";
    this.set_cols();
    this.set_data();
    this.set_item_header();
  }

  set_cols() : void {
    if(this.selected_item_type == "clothes")
    {
      this.cols = [
        { field: 'name', header: 'Item Name', width : '38%' },
        { field: 'quantity', header: 'Quantity Avl.', width : '12%' },
        { field: 'pp', header: 'PP', width : '13%' }
      ];
    }
    else if(this.selected_item_type == "electronics")
    {
      this.cols = [
        { field: 'name', header: 'Item Name', width : '38%' },
        { field: 'quantity', header: 'Quantity Avl.', width : '12%' },
        { field: 'pp', header: 'PP', width : '13%' }
      ];
    }
    else if(this.selected_item_type == "automobiles")
    {
      this.cols_brand = [
        { field: 'name', header: 'Brand Name', width : '77%' },
      ];

      this.cols = [
        { field: 'name', header: 'Model Name', width : '50%' },
        { field: 'quantity', header: 'Quantity Avl.', width : '12%' },
        { field: 'pp', header: 'PP', width : '11%' }
      ]
    }
  }

  set_item_header() {
    if(this.selected_item_type == "clothes")
      this.item_header = "Cloth";
    else if(this.selected_item_type == "electronics")
    this.item_header = "Electronic";
    else if(this.selected_item_type == "automobiles")
      this.item_header = "Brand";
  }
  
  set_data() {
    if(this.selected_item_type == "clothes")
      this.loadClothes();
    else if(this.selected_item_type == "electronics")
      this.loadElectronics();
    else if(this.selected_item_type == "automobiles")
      this.loadAutomobiles();
  }

  loadClothes() {
    this.itemsManagementService.getItems(this.selected_item_type)
    .subscribe(items => {
      this.items = items as Clothes[];
    })
  }

  loadElectronics(){
    this.itemsManagementService.getItems(this.selected_item_type)
    .subscribe(items => {
      this.items = items as Electronics[];
    })
  }

  loadAutomobiles(){
    this.itemsManagementService.getItems(this.selected_item_type)
      .subscribe(items => {
        this.items = items as Brands[];
      })
  }

  addItem() {
    this.add_item = true;
    if(this.selected_item_type == "clothes")
      this.new_item = new Clothes();
    else if(this.selected_item_type == "electronics")
      this.new_item = new Electronics();
    else if(this.selected_item_type == "automobiles")
      this.new_item = new Brands();

    this.set_item_header();
  }

  saveItem() {
    this.itemsManagementService.addItem(this.selected_item_type, this.new_item)
      .subscribe(item => {
        this.set_data();
        this.add_item = false;
        this.notify('success','Success Message','New '+ this.item_header+' is successfully added !');
      })
  }

  addModel(){
    this.new_item = new Submodels();
    this.add_submodel = true;
  }

  saveModel(id : string){

    this.itemsManagementService.addModel(id, this.new_item)
      .subscribe(msg => {
        this.set_data();
        this.add_submodel = false;
        this.notify('success','Success Message','New Model is successfully added !');
      })
  }

  editItem(id: string) {
    this.itemsManagementService.getItem(this.selected_item_type, id)
      .subscribe(item => {
        this.edit_item = true;
        if (this.selected_item_type == "clothes")
          this.new_item = item as Clothes;
        else if (this.selected_item_type == "electronics")
          this.new_item = item as Electronics;
        else if (this.selected_item_type == "automobiles")
          this.new_item = item as Brands;

        this.set_item_header();
      })
  }

  updateItem(id : string){
    this.itemsManagementService.updateItem(this.selected_item_type, id, this.new_item)
      .subscribe(item => {
        this.set_data();
        this.edit_item = false;
        this.notify('success','Success Message','The '+ this.item_header+' is successfully updated !');
      })
  }

  editModel(model : Submodels){
    this.new_item = model;
    this.edit_submodel = true;
  }

  updateModel(brand_id : string){

    this.itemsManagementService.updateModel(brand_id, this.new_item) 
      .subscribe(brand => {
        this.set_data();
        this.edit_submodel = false;
        this.notify('success','Success Message','The model is successfully updated !');
      });
  }

  deleteModel(brand_id : string, model_id : string){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this model?',
      accept: () => {
        this.itemsManagementService.deleteModel(brand_id,model_id)
          .subscribe(msg => {
            this.set_data();
            this.notify('success','Success Message','The model is successfully deleted !');
          })
      }
    });
  }

  deleteItem(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this '+ this.item_header +' ?',
      accept: () => {
        this.itemsManagementService.deleteItem(this.selected_item_type, id)
          .subscribe(item => {  
              this.set_data();
              this.notify('success','Success Message','The '+ this.item_header + ' is successfully deleted !');
           });
      }
    });
  }

  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }
}
