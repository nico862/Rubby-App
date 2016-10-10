"use strict";
let confFile = "../../conf/dev.json";
if (process.env.RUUBY_PA_API_CONFIG_FILE)
    confFile = process.env.RUUBY_PA_API_CONFIG_FILE;
const config = require(confFile);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;

//# sourceMappingURL=config.js.map
