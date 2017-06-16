# Global





* * *

### buildError(options) 

Builds an error function.

**Parameters**

**options**: `Object`, The error definition.

 - **options.name**: `String`, The error name.

 - **options.message**: `String`, The error default message.

 - **options.code**: `String`, The error HTTP response code.

**Returns**: `Error`, The created custom error.


### register(global, attribute) 

Register the custom errors list in the application global object.

**Parameters**

**global**: `Object`, The application global object.

**attribute**: `String`, The name of the attribute to register in the global object.

**Returns**: `Object`, The errors component.


### notFoundMiddleware(req, res, next) 

Catches 404s and forwards them to the error handler.

**Parameters**

**req**: `Object`, The request object.

**res**: `Object`, The response object.

**next**: `function`, The following middleware.



### handler(err, req, res, next) 

Set proper HTTP status code for custom errors.

**Parameters**

**err**: `Error`, The generated error.

**req**: `Object`, The request object.

**res**: `Object`, The response object.

**next**: `function`, The following middleware. Must be declared to access
error.

**Returns**: `undefined`


### config(cfg) 

Initialize and configure the errors component.

**Parameters**

**cfg**: `Object`, The errors configuration object.

 - **cfg.errors**: `Array`, The custom errors configuration array file.

 - **cfg.redirect**: `Object`, The default redirect urls.

 - **cfg.exclude**: `String`, The urls that will end the response if failed.

 - **cfg.debug**: `function`, The function to use to debug an error.

 - **cfg.shouldDebug**: `function`, The function to call to determine if an
error should be debugged.

**Returns**: `Object`, The errors component.



* * *

*Final Development Studio 2017*

**Author:** Leonardo Ramos &lt;leonardo@finaldevstudio.com&gt;, Santiago G. Marín &lt;santiago@finaldevstudio.com&gt;

**License:** MIT 

**Overview:** This component acts as the very last middleware of an express application. It manages every error may be produced inside any of the previous express middlewares.

**Version:** 1.0.0
