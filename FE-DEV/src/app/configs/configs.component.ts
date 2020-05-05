import { Component, OnInit } from '@angular/core';
import { Config } from 'src/models/config';
import { ConfigManagementServiceService } from 'src/services/config-management-service.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css']
})

export class ConfigsComponent implements OnInit {

  bank_details : Config = new Config();
  gst_cloth : Config;
  gst_ele : Config;
  gst_auto : Config;
  selected_gst : Config;
  selected_item_type : string;
  loaded : boolean = false;

  constructor(private configManagementService : ConfigManagementServiceService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.set_data();
  }

  set_data(){

    this.configManagementService.getConfigs()
      .subscribe(configs => {
        configs = configs as Config[];

        configs.forEach(cnfg => {
          if(cnfg.label == 'bank')
            this.bank_details = cnfg;
          else if(cnfg.label == 'gst_cloth')
            this.gst_cloth = cnfg;
          else if(cnfg.label == 'gst_ele')
            this.gst_ele = cnfg;
          else if(cnfg.label == 'gst_auto')
            this.gst_auto = cnfg;
        });

        this.selected_gst = this.gst_cloth;
        this.selected_item_type = "clothes";
        this.loaded = true;
      })

  }

  updateBankDetails(){
    this.configManagementService.updateConfig(this.bank_details._id, this.bank_details)
      .subscribe(config => {
        this.set_data();
        this.notify('success','Success Message','Bank Detail is updated successfully !');
      })
  }

  updateGSTDetails() {
    this.configManagementService.updateConfig(this.selected_gst._id, this.selected_gst)
      .subscribe(config => {
        this.set_data();
        this.notify('success','Success Message','GST Detail is updated successfully !');
      })
  }
  
  notify(severity_type : string, header : string, msg : string){
    this.messageService.add({severity: severity_type, summary: header, detail: msg});
  }
}
