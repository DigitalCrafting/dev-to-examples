import {Component, Input, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'dc-text-input',
    templateUrl: './dc-text-input.component.html'
})
export class DcTextInputComponent implements OnInit {
    @Input('controlName') controlName: string;
    @Input('formGroup') formGroup: FormGroup;
    @Input('label') label: string;

    inputId: string;

    ngOnInit() {
        this.inputId = this.controlName + Date.now();
    }
}
