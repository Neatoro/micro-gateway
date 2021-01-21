# Micro Gateway

This package is a API gateway designed to be used with Microservices. It is based on Express and provides an onboarding service for automatic onboarding of services.
This is still in progress of development.

## Installation

```sh
npm install --save @moritz.schramm/micro-gateway
```

## Usage

You have to create a JavaScript file that can be executed by NodeJS. Micro Gateway has to different ways of configuring the services.

### Basic Usage

You can directly use the JavaScript API to configure the gateway.

```js
const ApiGateway = require('../index.js');

const gateway = new ApiGateway();

gateway.addService({
    name: 'test',
    host: 'localhost',
    port: 2001,
    targetPath: '/api/v1.0'
});

(async () => {
    await gateway.listen(2000);
    console.log('Gateway started');
})();
```


### Onboarding Service

Another option is to activate the onboarding service. This will create another express server on port `1234`. Via this server you are able to configure the gateway using REST endpoints. Currently it is only able to onboard a service or to update an existing service by resending the create request.

#### Activation

```js
const ApiGateway = require('../index.js');

const gateway = new ApiGateway();

gateway.activateOnboardingService();

(async () => {
    await gateway.listen(2000);
    console.log('Gateway started');
})();
```

#### Swagger

You can find the Swagger documentation of the Onboarding on `http://<gateway-host>:1234/_onboarding/api-docs`.