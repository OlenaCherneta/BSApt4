const { program } = require("commander");
program.option("-cn, --api.configName <string>", "API config file name to load", "dev");

program.parse(process.argv);
const options = program.opts();
console.log("Got options from commandline", options);

module.exports = {
    require: [
        "ts-node/register",
        "source-map-support/register",
        `./tests/api/config/${options["api.configName"]}.config.ts`,
    ],
    timeout: 100000,
    parallel: false,
    reporter: "mocha-multi-reporters",
    "reporter-options": "configFile=reporter.config.json",
};