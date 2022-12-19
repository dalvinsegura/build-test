import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import cors from "cors";

import credentials from "./config/credentials";
import corsOptions from "./config/corsOptions";

import membersRoutes from "./routes/members.routes";
import customersRoutes from "./routes/customers.routes";
import receiptRoutes from "./routes/receipt.routes";
import authRoutes from "./routes/auth.routes";
import refreshRoutes from "./routes/refresh.routes";
import logoutRoutes from "./routes/logout.routes";
import emailVerificationRoutes from "./routes/emailVerification.routes";
import loginHistorialRoutes from "./routes/loginHistorial.routes";
import databaseActivitiesRoutes from "./routes/databaseActivities.routes";
import paymentsMembershipRoutes from "./routes/paymentsMembership.routes";
import membershipRoutes from "./routes/membership.routes";

import {logErrors, errorHandler, boomErrorHandler} from "./middlewares/error.handler";
import cookieParser from "cookie-parser";


const app = express();
app.use(credentials);
app.use(cors(corsOptions));


app.set("pkg", pkg);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    version: app.get("pkg").version,
  });
});

app.use("/api/members", membersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/loginHistorial", loginHistorialRoutes);
app.use("/api/databaseActivities", databaseActivitiesRoutes);
app.use("/api/paymentsMembership", paymentsMembershipRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/refresh", refreshRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/account/verification", emailVerificationRoutes);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

export default app;
