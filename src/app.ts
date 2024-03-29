import { errorUncughtException, errorHandler404, errorHandlerAll, errorUnhandledRejection } from "./util/apiHelpers";
import { MONGODB_URI, SESSION_SECRET } from "./config/secrets";

process.on("uncaughtException", errorUncughtException);

import express from "express";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import mongoInit from "./config/database";
import routes from "./api/gRoutes";
import cors from "cors";

const app = express();
mongoInit(MONGODB_URI);

const corsOptions = {
  origin: `http://localhost:5000`,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongoUrl: MONGODB_URI,
    }),
  })
);

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Routes Listings
app.use("/v1/user/auth", routes.user);
app.use("/v1/wallet", routes.wallet);
app.use("/v1/category", routes.transactionCategory);
app.use("/v1/transaction", routes.transaction);
app.use("/v1/homepage", routes.homepage);
app.use("/v1/analytics", routes.analytics);
app.use("/v1/file", routes.fileStorage);

app.use("/", (req, res) => {
  res.json({
    status: "LIVE FROM EXPINCO SERVER!!",
  });
});

// Handling 404 and  Global errors here
app.all("*", errorHandler404);

// Handling for any other uncatch errors
app.use(errorHandlerAll);

process.on("unhandledRejection", errorUnhandledRejection);

export default app;
