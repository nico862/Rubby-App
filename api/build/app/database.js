"use strict";
const pg = require("pg");
const squel = require("squel");
const config_1 = require("./config");
const logger_1 = require("./logger");
squel.useFlavour("postgres");
exports.squelSelectOptions = {
    tableAliasQuoteCharacter: "",
    replaceSingleQuotes: true,
};
function doSelect(query) {
    return new Promise((resolve, reject) => {
        logger_1.logger.debug(`Running query: ${query.toString()}`);
        pg.connect(config_1.default.database.ruuby, (err, client, done) => {
            if (err) {
                reject(err);
                return;
            }
            client.query(query.toString(), (err, result) => {
                done();
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.rows);
            });
        });
    });
}
exports.doSelect = doSelect;
function doUpsert(query) {
    return new Promise((resolve, reject) => {
        logger_1.logger.debug(`Running query: ${query.toString()}`);
        pg.connect(config_1.default.database.ruuby, (err, client, done) => {
            if (err) {
                reject(err);
                return;
            }
            client.query(query.toString(), (err, result) => {
                done();
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    });
}
exports.doUpsert = doUpsert;

//# sourceMappingURL=database.js.map
