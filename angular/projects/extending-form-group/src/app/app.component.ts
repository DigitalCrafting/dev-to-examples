import {Component} from '@angular/core';
import "../../../core/forms/dc-forms";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'extending-form-group-example';
  formGroup = new FormGroup({
    test: new FormControl({
      value: "",
      visible: true
    }, Validators.required)
  });

  toggleVisibility() {
    let testControl = this.formGroup.get('test');
    testControl.visible ? testControl.hide() : testControl.show();
    setTimeout(() => {
      this.formGroup.updateValueAndValidity();
    });

  }
}
