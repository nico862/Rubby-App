"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
routes.configure(app);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = app;

//# sourceMappingURL=app.js.map
