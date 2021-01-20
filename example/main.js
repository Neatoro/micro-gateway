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