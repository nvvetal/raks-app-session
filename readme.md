#APP SESSION library

###Using for make app session with some service (if allowed)

##Install:
package.json

```javascript
    {
        dependencies: {
            "wap3-app-session": "git+https://github.com/nvvetal/raks-app-session.git#v1.0.2"
        }
    }
```

#Requirements

##node.js v6.9.0 or upper


###Example with full config when init:

```javascript
let SessionModel = require('wap3-app-session').Wap3AppSession;

let sessionModel = new SessionModel({
    appKey: 'XXXXX-XXXX-XXXX-XXXX-XXXX',
    appSecret: 'some_secret',
    appService: 'content',
    url: 'https://HOST',
    timeout: 500,
    pubnub: {
        publishKey: 'pub-X-XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        subscribeKey: 'sub-X-XXXXXXXXXXXXXXXXXXXXXXXXXX'
    },
    debug: false
});
```

#Options 

## appKey

## appSecret

##appService (**required**)
Service, for which session is creating. Eg: content, coins...

##url (**required**)
Using for interact with APP Session Microservice. 


##timeout (default: 300)
Using in method **auth**. 
 

##pubnub
Object using in **listen** method. 
Properties are **publishKey** and **subscribeKey**
 
##debug (default: false)
Default - false. Using to show more information about library operations such as 
time to success or fail fetch data by URL or/and filename. 

#Methods

##auth(callback)
Trying to auth in APP Session Microservice.
On success - returns Session
 
```javascript
    sessionModel.auth(function(err, session){
        //SOME STUFF with err processing
    });
```

##listen(callback)
Listening for APP changes.

Each time will call your callback if some happen
```javascript
    sessionModel.listen((err) => {
        //SOME STUFF with err processing
        //SOME STUFF with app reaction on refresh
    });
```


##setTimeout(timeout)
Setting max timeout in milliseconds instead of timeout which is used in constructor
```javascript
    sessionModel.setTimeout(500);
```

##setAppKey(appKey)
Setting appKey
```javascript
    sessionModel.setAppKey('XXXXX-XXXX-XXXX-XXXX-XXXX');
```

##setAppSecret(appSecret)
Setting appSecret
```javascript
    sessionModel.setAppSecret('some_secret');
```


#Version change:
**v1.0.1** Added setAppKey and setAppSecret

**v1.0.0** Init