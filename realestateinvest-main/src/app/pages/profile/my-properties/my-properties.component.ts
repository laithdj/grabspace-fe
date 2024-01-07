import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../services/property/property.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import * as CONSTANTS from 'src/app/core/constants';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.scss']
})
export class MyPropertiesComponent implements OnInit {

  propertyList: Array<{
    id: string;
    userId: string;
    title: string;
    propertyType: any;
    propertyStatus: any;
    city: any;
  }> = [];
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  constructor(
    private propertyService: PropertyService,
    private confirmationService: ConfirmationService, private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getPropertyList();
  }
  getPropertyList() {
    this.propertyList = [];
    this.propertyService.getUserProperties().subscribe(resData => {
      console.log('resData', resData);
      this.propertyList = resData;
    })
  }

  deleteProperty(pData: any): void {
    console.log('deleteProperty called.', pData);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closeOnEscape: false,
      defaultFocus: 'null',
      accept: () => {
        this.propertyService.deleteProperty(pData.id).subscribe(
          (propDeleteRes: any) => {
            console.log('propDeleteRes', propDeleteRes);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property deleted.' });
            this.getPropertyList()
          },
          (propDeleteErr: any) => {
            console.error('propDeleteErr', propDeleteErr);
            if (propDeleteErr.error?.message) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: propDeleteErr.error?.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: this.ERROR_MESSAGES.SOMETHING_WRONG });
            }
          },
        );
      },
    });
  }

}
