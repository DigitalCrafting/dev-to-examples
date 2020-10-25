import { Component } from '@angular/core';
import "../../../core/forms/dc-forms";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'extending-form-group-example';
  formGroup = new FormGroup({});
  formControl = new FormControl({
    value: "",
    visible: false
  })

  ngOnInit() {
    this.formGroup.visibilityChanges.subscribe(value => {
      console.log("Visibility changed: " + value)
      console.log(this.formGroup.visible)
    });
  }

  ngAfterViewInit() {
    this.formGroup.hide();
    setTimeout(() => {
      this.formGroup.show();
    }, 1000)

    console.log(this.formControl.visible)
  }

  toggleVisibility() {
    this.formGroup.visible ? this.formGroup.hide() : this.formGroup.show();
  }
}
