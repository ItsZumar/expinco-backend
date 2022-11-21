import express from "express";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
// import flash from "express-flash";
import mongoInit from "./config/database";
import morgan from "morgan";

// routes
import routes from "./routes";

import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const app = express();
mongoInit(MONGODB_URI);

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(morgan("dev")); // for logging
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        mongoUrl: MONGODB_URI,
    })
}));
// app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Route Listings
app.use("/v1/user/auth", routes.UserAuth)

export default app;
