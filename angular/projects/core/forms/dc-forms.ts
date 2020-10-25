import {AbstractControl, FormControl} from "@angular/forms";
import {EventEmitter} from "@angular/core";

/**
 * This enables us to change the library
 * 1. First we declare module with the exact name of module we will be extending
 * 2. We declare interface with the name of class/interface we want to extend
 *    !!!abstract class DOES NOT work!!!
 * */
declare module "@angular/forms" {
    interface AbstractControl {
        visibilityChanges: EventEmitter<boolean>;
        readonly visible: boolean;
        show();
        hide();

        /**
         * This methods is marked as internal inside the AbstractControl.
         * Declaring it here allows us to easily override it
         * */
        _isBoxedValue(formState: any): boolean
    }
}

/**
 * Here we can use the prototype in order to extend our AbstractControl
 * Having 'visible' as readonly and hacking it here is borrowed from angular framework itself
 * */
(AbstractControl.prototype as { visible: boolean }).visible = true;
AbstractControl.prototype.visibilityChanges = new EventEmitter<boolean>();
AbstractControl.prototype.hide = function () {
    if (this.visible) {
        (this as { visible: boolean }).visible = false;
        this.visibilityChanges.emit(this.visible);
        this.reset();
        this.updateValueAndValidity();
    }
};
AbstractControl.prototype.show = function () {
    if (!this.visible) {
        (this as { visible: boolean }).visible = true;
        this.visibilityChanges.emit(this.visible);
    }
};

/**
 * Here we override the _isBoxedValue method to enable passing initial 'visible' state
 * */
AbstractControl.prototype._isBoxedValue = function(formState: any): boolean {
    return typeof formState === 'object' && formState !== null &&
        Object.keys(formState).length >= 2 && 'value' in formState &&
        ('disabled' in formState || 'visible' in formState);
};

/**
 * Now we override FormControl method to handle constructor passed params
 * */
// @ts-ignore
(FormControl.prototype as { _applyFormState: () => void })._applyFormState = function(formState: any) {
    if (this._isBoxedValue(formState)) {
        (this as {value: any}).value = this._pendingValue = formState.value;
        formState.disabled ? this.disable({onlySelf: true, emitEvent: false}) :
            this.enable({onlySelf: true, emitEvent: false});
        // we added this line
        if (formState.visible === true || formState.visible === false) {
            (this as {visible: any}).visible = formState.visible;
        }
    } else {
        (this as {value: any}).value = this._pendingValue = formState;
    }
};
