import { LightningElement, track, api, wire } from 'lwc';
import getSensorList from '@salesforce/apex/ControllerSensor.getSensorList';
import getSelectedSensor from '@salesforce/apex/ControllerSensor.getSelectedSensor';
import { NavigationMixin } from "lightning/navigation";

const actions2 = [
    { label: 'Edit', name: 'Edit', iconName: 'utility:edit' },
];
const actions = [
    { label: 'Edit', name: 'Edit', iconName: 'utility:edit' },
    { label: 'View Events', name: 'Viewevents' },
];
const columns = [
    { label: 'Name', fieldName: 'Name'},
    { label: 'Max Vector Length', fieldName: 'Max_Vectors_Length__c'},
    {
        label: 'Actions',
        type: 'action',
        typeAttributes: { rowActions: actions, menuAlignment: 'right' },
    }
];

const columns2 = [
    { label: 'Name', fieldName: 'Name'},
    { label: 'Modulus Vector Length', fieldName: 'Modulus_Vector_Length__c'},
    { label: 'X', fieldName: 'X__c'},
    { label: 'Y', fieldName: 'Y__c'},
    { label: 'Z', fieldName: 'Z__c'},
    {
        label: 'Actions',
        type: 'action',
        typeAttributes: { rowActions: actions2, menuAlignment: 'right' },
    }
];

export default class SensorLWCData extends NavigationMixin(LightningElement) {

    handleRowAction(event) {
        var action = event.detail.action;
        var row = event.detail.row.Id;
        switch (action.name) {
            case 'Edit':
                this[NavigationMixin.Navigate]({
                    type: "standard__recordPage",
                    attributes: {
                        recordId: event.detail.row.Id,
                        actionName: "edit"
                    }
                });
                         /*Write Your Code IF Edit*/
                break;
            case 'Viewevents':
                getSelectedSensor({idSelected : row })
            .then(result => {
                this.SensorList = result;
                this.columns = columns2;
            })
            .catch(error => {
                this.recordId = null;
            });
                /*Write Your Code IF Viewchild*/
                break;
        }
    }

    @track SensorList;
    columns = columns;
    @api recordId;
    @wire(getSensorList)

    viewRecord() { 
        getSensorList()
            .then(result => {
                this.SensorList = result;
                this.recordId = null; 
                this.columns = columns;
            })
            .catch(error => {
                this.error = error;
                console.log(error);
            });
    }

}