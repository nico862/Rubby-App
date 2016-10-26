import * as sourceMap from "source-map-support";
sourceMap.install();

import app from "./app";
import config from "./config";

app.listen(config.express.port, () => {
  console.log(`Running in mode: ${process.env.NODE_ENV}`);
  console.log(`Listening on port ${config.express.port}`);
});
