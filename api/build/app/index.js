"use strict";
const sourceMap = require("source-map-support");
sourceMap.install();
const app_1 = require("./app");
const config_1 = require("./config");
app_1.default.listen(config_1.default.express.port, () => {
    console.log(`Running in mode: ${process.env.NODE_ENV}`);
    console.log(`Listening on port ${config_1.default.express.port}`);
});

//# sourceMappingURL=index.js.map
