# Global




**Members:**

+ error

* * *

### configure(config) 

Initialize and configure the errors component.

**Parameters**

**config**: `Object`, The errors configuration object.

 - **config.errors**: `Array`, The custom errors configuration array file.

 - **config.redirect**: `Object`, The default redirect urls.

 - **config.exclude**: `String`, The urls that if failed will terminate the request.

**Returns**: `Object`, The errors component.


### bind(app) 

Bind the errors component to the express aplication.

**Parameters**

**app**: `Express`, The express application.

**Returns**: `Object`, The errors component.


### list() 

Returns the component errors list.

**Returns**: `Object`, Every registered error.


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

**Version:** 1.0.1
