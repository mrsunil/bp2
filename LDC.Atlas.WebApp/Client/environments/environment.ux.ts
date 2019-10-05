export const environment = {
    production: false,
    envName: 'ux',

    version: '',
    friendlyName: '',
    environmentType: '',
    environmentName: '',

    discoveryServiceLink: 'api/v1/discovery',
    tradeServiceLink: '/api/v1/Trading',
    masterDataServiceLink: '/api/v1/MasterData',
    executionServiceLink: '/api/v1/Execution',
    controllingServiceLink: '/api/v1/Controlling',
    preAccountingServiceLink: '/api/v1/PreAccounting',
    userIdentityServiceLink: '/api/v1/useridentity',
    documentServiceLink: '/api/v1/document',
    configurationServiceLink: '/api/v1/configuration',
    freezeServiceLink: '/api/v1/freeze',
    lockServiceLink: '/api/v1/lock',
    reportingServiceLink: '/api/v1/reporting',
    reportServerLink: 'http://avacdm1tatrvmwf01.westeurope.cloudapp.azure.com/ReportServer',
    accountingInterfaceServiceLink: '/api/v1/accountinginterface',
    interfaceServiceLink: '/api/v1/interface',
    auditServiceLink: '/api/v1/audit',

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
