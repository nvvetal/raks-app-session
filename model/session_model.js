'use strict';

let self;

const request = require('request');
let PubNub = require('pubnub');
let Session = require('../entity/session');
let md5 = require('md5');

//TODO: expire sessions later!
let sessions = new Map();

class SessionModel{

    constructor(params){
        self = this;
        if (!params.url) throw 'Please set url';
        if (!params.appService) throw 'Please set appService';
        this.appKey = params.appKey;
        this.appSecret = params.appSecret;
        this.appService = params.appService;
        this.url = params.url;
        this.timeout = params.timeout || 300;
        this.pubnub = params.pubnub || {};
        this.debug = (params.debug === true);
    }

    /**
     * Using for make new session tables etc
     * @param callback
     */
    listen(callback) {
        if (!self.pubnub.publishKey || !self.pubnub.subscribeKey) {
            console.log('[ERR NO PUBNUB]', self.pubnub);
            return callback && callback('no pubnub config');
        }
        let listener = new PubNub({
            publishKey: self.pubnub.publishKey,
            subscribeKey: self.pubnub.subscribeKey
        });

        listener.addListener({
            status: function (statusEvent) {
                //console.log(statusEvent);
            },
            message: function (message) {
                //TODO: create table on app.create
            },
            presence: function (presenceEvent) {
                // handle presence
            }
        });
        if (self.debug) console.log("Subscribing APP Session", [self.appKey]);
        listener.subscribe({
            channels: [self.appKey]
        });
    }

    auth(callback) {
        if (!self.appKey) throw 'Please set appKey';
        if (!self.appSecret) throw 'Please set appSecret';

        let token = md5(self.appKey + '_' + self.appSecret + '_' + self.appService);
        let session = sessions.get(token);
        if (session) {
            return callback && callback(undefined, session);
        }

        this._fetchAuth((err, data) => {
            if (err) return callback && callback('unknown error');
            this._make(data, (err, session) => {
                if (err) return callback && callback('unknown error');
                sessions.set(token, session);
                callback && callback(undefined, session);
            });
        });
    }

    /**
     *
     * @param callback
     */
    _fetchAuth(callback) {
        let t1 = Date.now();
        request.get(self.url + '/api/auth/?app_key=' + self.appKey + '&app_secret=' + self.appSecret + '&service=' + self.appService, {
            timeout: self.timeout,
            strictSSL: false
        }, (err, res, body) => {
            if (err) {
                if (self.debug) console.log('[fail fetch url time]', (Date.now() - t1) / 1000);
                return callback && callback(err);
            }
            if (body.error) {
                if (self.debug) console.log('[fail fetch url time]', (Date.now() - t1) / 1000);
                return callback && callback(body.error);
            }
            console.log(body);
            let r = JSON.parse(body);
            let rows = r.data;
            if (!rows || rows.length === 0) {
                if (self.debug) console.log('[fail fetch url time]', (Date.now() - t1) / 1000);
                return callback && callback('no url data');
            }
            if (self.debug) console.log('[fetch url time]', (Date.now() - t1) / 1000);
            callback && callback(undefined, rows);
        });
    }


    /**
     * @param {Object} data
     * @param {Function<{String}, {Session}>} callback
     * @returns {Function<{String}, {Session}>}
     */
    _make(data, callback) {
        let promises = [];
        Promise.all(promises).then(values => {
            let obj = new Session(data);
            callback && callback(undefined, obj);
        }).catch(err => {
            console.log('[ERR]', err, err.stack);
            callback && callback(err);
        });
    };


    /**
     *
     * @param timeout {Number}
     */
    setTimeout(timeout) {
        this.timeout = timeout;
    }

    /**
     *
     * @param appKey {String}
     */
    setAppKey(appKey) {
        this.appKey = appKey;
    }

    /**
     *
     * @param appSecret {String}
     */
    setAppSecret(appSecret) {
        this.appSecret = appSecret;
    }

}

module.exports = SessionModel;