// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

//process.env.CHROME_BIN = "/usr/bin/chromium-browser";

module.exports = function (config) {

	config.set({
		basePath: '/',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			//require('karma-coverage-istanbul-reporter'),
			require('@angular-devkit/build-angular/plugins/karma'),
			require('karma-tfs-reporter')
		],

		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		//coverageReporter: {
		//	type: 'cobertura'
		//},
		//coverageIstanbulReporter: {
		//	dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'cobertura'],
		//	fixWebpackSourcePaths: true
		//},
		//remapIstanbulReporter: {
		//	reports: {
		//		cobertura: './coverage/cobertura.xml',
		//	}
		//},
		//remapCoverageReporter: {
		//	cobertura: './coverage/cobertura.xml',
		//},

		tfsReporter: {
			outputDir: '../../tests/unit/Angular',
			outputFile: 'testresults_angular.xml'
		},
		customLaunchers: {
			MyChrome: {
				base: 'ChromeHeadless',
				flags: [
					'--disable-translate',
					'--disable-extensions',
					'--remote-debugging-port=9223',
					'--no-sandbox'
				]
			}
		},
		//reporters: ['progress', 'kjhtml', 'tfs', 'coverage-istanbul'],
		reporters: ['progress', 'kjhtml', 'tfs'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false,
		captureTimeout: 120000,
		browserDisconnectTolerance: 3,
		browserDisconnectTimeout: 120000,
		browserNoActivityTimeout: 120000
	});
};
