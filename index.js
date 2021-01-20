const express = require('express');
const httpProxy = require('http-proxy');

module.exports = class ApiGateway {

    constructor() {
        this.app = express();
        this.services = {};
        this.proxy = httpProxy.createProxy();

        this.app.all('*', (request, response, next) => this.proxyRequest(request, response, next));
    }

    addService({ name, targetPath, host, port }) {
        this.services[name] = {
            targetPath,
            host,
            port
        };

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
            this.app.listen(port, resolve);
        });
    }

};