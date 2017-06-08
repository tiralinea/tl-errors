# Fi Errors


* * *


### config(cfg) 

Initialize and configure the errors component.

**Parameters**

**cfg**: `Object`, The errors configuration object.

 - **cfg.errors**: `Array`, The custom errors configuration array file.

 - **cfg.redirect**: `Object`, The default redirect urls.

 - **cfg.exclude**: `String`, The urls that if failed will terminate the request.

**Returns**: `Object`, The errors component.


### handler(err, req, res, next) 

Set proper HTTP status code for custom errors.

**Parameters**

**err**: `Error`, The generated error.

**req**: `Object`, The request object.

**res**: `Object`, The response object.

**next**: `function`, The following middleware. Must be declared to access error


### notFoundMiddleware(req, res, next) 

Catches 404s and forwards them to the error handler.

**Parameters**

**req**: `Object`, The request object.

**res**: `Object`, The response object.

**next**: `function`, The following middleware.


### register(global, attribute) 

Register the custom errors list in the application global object.

**Parameters**

**global**: `Object`, The application global object.

**attribute**: `String`, The name of the attribute to register in the global object.

**Returns**: `Object`, The errors component.


* * *

*Final Development Studio 2017*

**Author:** Leonardo Ramos &lt;leonardo@finaldevstudio.com&gt;, Santiago G. Marín &lt;santiago@finaldevstudio.com&gt;

**License:** MIT 

**Overview:** This component acts as the very last middleware of an express application. It manages every error may be produced inside any of the previous express middlewares.

**Version:** 2.0.0
