import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CypressAdapterService {
    private context = {};

    constructor() {
        (<any>window)._appContext = this.context;
    }

    register(name, obj) {
        this.context[name] = obj;
    }

}
