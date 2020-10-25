import {NgModule} from "@angular/core";
import {DcTextInputComponent} from "./text/dc-text-input.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        DcTextInputComponent
    ],
    declarations: [
        DcTextInputComponent
    ],
    entryComponents: [
        DcTextInputComponent
    ]
})
export class DcInputsModule {

}
