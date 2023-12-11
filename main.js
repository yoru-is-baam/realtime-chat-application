const createError = require("http-errors");
const { express, app, server, io } = require("./io");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");

require("dotenv").config();

const { COOKIE_SECRET, MONGODB_URI } = process.env;
const PORT = process.env.PORT || 8080;

const AccountRouter = require("./routers/AccountRouter");
const IndexRouter = require("./routers/IndexRouter");
const ChatRouter = require("./routers/ChatRouter");

app.set("view engine", "ejs");

app.use(
	session({
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	req.vars = { root: __dirname }; // __dirname is current folder
	next();
});

app.use("/", IndexRouter);
app.use("/account", AccountRouter);
app.use("/chat", ChatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error", { layout: false });
});

mongoose
	.set("strictQuery", false)
	.connect(MONGODB_URI)
	.then(() =>
		server.listen(PORT, () => console.log(`Server is listening at ${PORT}`))
	)
	.catch(() => console.log("Connect error!"));
