import "@angular/platform-browser";
import "@angular/platform-browser-dynamic";
import "@angular/core";
import "@angular/common";
import "@angular/common/http";
import "@angular/router";
import "rxjs";
import '@ng-bootstrap/ng-bootstrap';
import "bootstrap-css-only/css/bootstrap.min.css";

import * as moment from "moment";
import "moment/min/locales";
moment.locale('pl');
(<any>window)['moment'] = moment;
