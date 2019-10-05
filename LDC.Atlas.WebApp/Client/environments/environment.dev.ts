export const environment = {
    production: false,
    envName: 'dev',

    version: '1.0.0',
    friendlyName: 'Atlas',
    environmentType: 'LOCAL',
    environmentName: 'LOCAL',

    discoveryServiceLink: 'http://localhost:7000/api/v1/discovery',
    tradeServiceLink: 'http://localhost:7001/api/v1/Trade',
    masterDataServiceLink: 'http://localhost:7003/api/v1/MasterData',
    executionServiceLink: 'http://localhost:7001/api/v1/Execution',
    controllingServiceLink: 'http://localhost:7004/api/v1/Controlling',
    preAccountingServiceLink: 'http://localhost:7005/api/v1/PreAccounting',
    userIdentityServiceLink: 'http://localhost:7006/api/v1/useridentity',
    documentServiceLink: 'http://localhost:7007/api/v1/document',
    configurationServiceLink: 'http://localhost:7008/api/v1/configuration',
    freezeServiceLink: 'http://localhost:7009/api/v1/freeze',
    reportingServiceLink: 'http://localhost:7010/api/v1/reporting',
    lockServiceLink: 'http://localhost:7013/api/v1/lock',
    reportServerLink: 'http://avacdm1tatrvmwf01.westeurope.cloudapp.azure.com/ReportServer',
    accountingInterfaceServiceLink: 'http://localhost:7015/api/v1/AccountingInterface',
    interfaceServiceLink: 'http://localhost:7016/api/v1/Interface',
    auditServiceLink: 'http://localhost:7017/api/v1/Audit',
    paymentRequestInterfaceServiceLink: 'http://localhost:7012/api/v1/paymentrequestinterface',

    oAuth2: {
        loginUrl: '',
        clientId: '',
        resource: '',
        logoutUrl: '',
        issuer: '',
        scope: '',
    },

    applicationInsights: {
        instrumentationKey: '',
    },
    tokenConfiguration: {
        silentRefresh: true,
    },
};
