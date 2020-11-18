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
      value: "testValue",
      visible: true
    }, Validators.required)
  });

  ngOnInit() {
    this.formGroup.get('test').valueChanges.subscribe(value => console.log("Value changed: " + value));
    this.formGroup.get('test').controlValueChanges.subscribe(value => console.log("Control value changed: " + value));
  }

  toggleVisibility() {
    let testControl = this.formGroup.get('test');
    testControl.visible ? testControl.hide() : testControl.show();
    setTimeout(() => {
      this.formGroup.updateValueAndValidity();
    });
  }

  clearControl() {
    this.formGroup.get('test').clear();
  }

  resetControl() {
    this.formGroup.get('test').reset();
  }

  setControlValue() {
    let control = this.formGroup.get('test');
    control.setControlValue("test", {emitEvent: true, emitValueEvent: true});
  }

  toggleEnabled() {
    let control = this.formGroup.get('test');
    control.enabled ? control.disable() : control.enable();
  }
}
