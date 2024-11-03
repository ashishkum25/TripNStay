require('dotenv').config(); // Ensure this line is at the top to load environment variables
const express = require("express");
const mongoose = require('mongoose'); // Make sure mongoose is imported
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Ensure the ATLASDB_URL is set correctly in your .env file
const dbUrl = process.env.ATLASDB_URL; // This should now be corrected with the proper connection string

// Function to connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) { // Check if disconnected
    try {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  }
}

// Call the function to connect to MongoDB
connectDB();

const app = express();

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Configure MongoDB session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // 24 hours
});

// Handle session store errors
store.on("error", (err) => {
  console.log("Error in MONGO SESSION STORE", err);
});

// Session configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to add flash messages and current user to response locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Define routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Debugging route to set session
app.get('/set-session', (req, res) => {
  req.session.user = { id: '123', name: 'testUser' }; // Set a session variable
  res.send('Session set! User: ' + JSON.stringify(req.session.user));
});

// Debugging route to get session
app.get('/get-session', (req, res) => {
  res.send('Current session user: ' + JSON.stringify(req.session.user)); // Retrieve session variable
});

// Catch-all route for 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
