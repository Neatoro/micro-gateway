const ApiGateway = require('../index.js');

const gateway = new ApiGateway();

gateway.activateOnboardingService();

(async () => {
    await gateway.listen(2000);
    console.log('Gateway started');
})();