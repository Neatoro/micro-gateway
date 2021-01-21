const express = require('express');
const httpProxy = require('http-proxy');
const Ajv = require('ajv').default;
const createServiceSchema = require('./schema/createservice.json');

module.exports = class ApiGateway {

    constructor() {
        this.app = express();
        this.services = {};
        this.proxy = httpProxy.createProxy();
        this.onboardingApp = undefined;

        this.app.use((request, response, next) => this.proxyRequest(request, response, next));
    }

    addService({ name, targetPath, host, port }) {
        this.services[name] = {
            targetPath,
            host,
            port
        };

        return this;
    }

    activateOnboardingService() {
        const swaggerUi = require('swagger-ui-express');
        const swagger = require('./swagger.json');

        this.onboardingApp = express();
        this.onboardingApp.use(express.json());

        const router = new express.Router();

        router.post('/service', (request, response) => {
            const ajv = new Ajv();
            if (!ajv.validate(createServiceSchema, request.body)) {
                response.status(400).json(ajv.errors);
                return;
            }

            this.addService({
                name: request.body.name,
                host: request.body.host,
                targetPath: request.body.path,
                port: request.body.port
            });

            response.sendStatus(201);
        });

        router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

        this.onboardingApp.use('/_onboarding', router);

        return this;
    }

    proxyRequest(request, response, next) {
        const requestedPath = request.path;
        const pathParts = requestedPath.split('/');
        const serviceName = pathParts[1];

        if (this.services[serviceName]) {
            const service = this.services[serviceName];

            const delimiter = service.targetPath.endsWith('/') ? '' : '/'
            const servicePath = service.targetPath + delimiter + pathParts.slice(2).join('/');

            console.log('Requested service', serviceName, servicePath);

            this.proxy.web(request, response, {
                ignorePath: true,
                target: `http://${service.host}:${service.port}${servicePath}`
            });
        } else {
            next();
        }
    }

    listen(port) {
        return new Promise((resolve) => {
            if (this.onboardingApp) {
                this.onboardingApp.listen(1234);
            }
            this.app.listen(port, resolve);
        });
    }

};