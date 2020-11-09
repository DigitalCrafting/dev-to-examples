import {AbstractControl, FormControl, FormGroup, ValidationErrors} from "@angular/forms";
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
        clear(value?: any, options?: Object);
        // @ts-ignore
        reset(value?: any, options?: Object);

        /**
         * This methods is marked as internal inside the AbstractControl.
         * Declaring it here allows us to easily override it
         * */
        _isBoxedValue(formState: any): boolean
        _updateValue(): void;
    }

    interface FormControl extends AbstractControl {
        readonly defaultValue: any;
        _applyValue(value: any): void;
        clear(options?: Object);
        // @ts-ignore
        reset(options?: Object);
        _pendingChange;
    }

    interface FormGroup extends AbstractControl {
        reset(value: any, options: {onlySelf?: boolean, emitEvent?: boolean}): void;
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
        this.clear();
        this.updateValueAndValidity();
    }
};
AbstractControl.prototype.show = function () {
    if (!this.visible) {
        (this as { visible: boolean }).visible = true;
        this.visibilityChanges.emit(this.visible);
        this.reset();
        this.updateValueAndValidity();
    }
};
/**
 * In AbstractControl we do have reset method but we do not implement defaultValue hence clear method is only added for compatibility
 * */
AbstractControl.prototype.clear = function (value?: any, options?: Object) {
    this.reset(value, options);
}

/**
 * Here we override the updateValueAndValidity method to account for 'visible' state
 * */
AbstractControl.prototype.updateValueAndValidity = function (opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    this._setInitialStatus();
    this._updateValue();

    if (this.visible === false) {
        (this as {status: string}).status = 'VALID';
    } else if (this.enabled) {
        this._cancelExistingSubscription();
        (this as { errors: ValidationErrors | null }).errors = this._runValidator();
        (this as { status: string }).status = this._calculateStatus();

        if (this.status === 'VALID' || this.status === 'PENDING') {
            this._runAsyncValidator(opts.emitEvent);
        }
    }

    if (opts.emitEvent !== false) {
        (this.valueChanges as EventEmitter<any>).emit(this.value);
        (this.statusChanges as EventEmitter<string>).emit(this.status);
    }

    if (this._parent && !opts.onlySelf) {
        this._parent.updateValueAndValidity(opts);
    }
}

/**
 * Here we override the _isBoxedValue method to enable passing initial 'visible' state
 * */
AbstractControl.prototype._isBoxedValue = function (formState: any): boolean {
    return typeof formState === 'object' && formState !== null &&
        Object.keys(formState).length >= 2 && 'value' in formState &&
        ('disabled' in formState || 'visible' in formState);
};

// @ts-ignore
(FormControl.prototype as { _applyFormState: () => void })._applyFormState = function (formState: any) {
    if (this._isBoxedValue(formState)) {
        (this as { value: any }).value = this._pendingValue = formState.value;
        formState.disabled ? this.disable({onlySelf: true, emitEvent: false}) :
            this.enable({onlySelf: true, emitEvent: false});
        // we added this line for visibility functionality
        if (formState.visible === true || formState.visible === false) {
            (this as { visible: any }).visible = formState.visible;
        }
        // we added this line to store initial value as default
        (this as {defaultValue}).defaultValue = formState.value;
    } else {
        (this as { value: any }).value = this._pendingValue = formState;
    }
};

FormControl.prototype._applyValue = function(value: any, options?: Object) {
    this._applyFormState(value);
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(this.value, options);
    this._pendingChange = false;
};

FormControl.prototype.reset = function (options?: Object) {
    this._applyValue(this.defaultValue, options);
};

FormControl.prototype.clear = function (options?: Object) {
    this._applyValue(null, options);
};

/**
 * Here we need to override FormGroup a bit in order to handle FormControl reset() and clear() correctly
 * */
FormGroup.prototype.reset = function (value: any = {}, options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._forEachChild((control: AbstractControl, name: string) => {
        if ('defaultValue' in control) {
            (control as FormControl).reset(options);
        } else {
            control.reset(value[name], {onlySelf: true, emitEvent: options.emitEvent});
        }
    });
    this._updatePristine(options);
    this._updateTouched(options);
    this.updateValueAndValidity(options);
};
