import * as express from "express";
import * as bodyParser from "body-parser";
import * as routes from "./routes";

const app: express.Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

routes.configure(app);

export default app;
