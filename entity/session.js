'use strict';

let self;

class Session {
    constructor(data) {
        self = this;
        this.data = data;
        this.id = data.id;
        this.appId = data.appId;
        this.appName = data.appName;
        this.status = data.status;
        this.created = data.created;
        this.end = data.end;
        this.updated = data.updated;
    }

    getId() {
        return this.id;
    }

    getAppId() {
        return this.appId;
    }

    getAppName() {
        return this.appName;
    }

    getStatus() {
        return this.status;
    }

    getCreated() {
        return this.created;
    }

    getEnd() {
        return this.end;
    }

    getUpdated() {
        return this.updated;
    }
}

module.exports = Session;