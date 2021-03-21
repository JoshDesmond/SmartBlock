const path = require('path');

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: [
            { pattern: './test/testModelState.js', type: 'module' },
            { pattern: './app/**/*.js', type: 'module', included: false },
        ],
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity
    })
}
