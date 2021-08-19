 Add JWT-based authentication to a Node/Express/Mongo app.
 
 Includes API Server utilities:
-   [morgan](https://www.npmjs.com/package/morgan)
    -   HTTP request logger middleware for node.js 
-   [helmet](https://www.npmjs.com/package/helmet)
    -   Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
-   [bcrypt](https://www.npmjs.com/package/bcrypt)
	-   A library to help you hash passwords.
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken))
	-   **JSON Web Tokens** are an open, industry standard RFC 7519 method for representing claims securely between two parties.
-   [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
	-   Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.
-   [dotenv](https://www.npmjs.com/package/dotenv)
    -   Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
-	[joi](https://www.npmjs.com/package/joi)
	-   **joi** validiation lets you describe your data using a simple, intuitive, and readable language.
-   [mongoose](https://www.npmjs.com/package/mongoose)
	-   Mongoose is a [MongoDB](https://www.mongodb.org/) object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

## Authentication

## Signup:
- [x] Create Express Server
- [x] Install **helmet** and initialise
- [x] Install **morgan** request logger
- [x] **dotenv** to store environment variable
- [x] Add Auth Router
- [x] app.use(express.urlencoded({ extended: true }))
- [x] Create user with POST /auth/signup
   - [x] Validate email / password 
   - [x] JavaScript client side validation
   - [x] **joi** for backend validation in express
- [x] Setup DB MongoDB
    - [x] Setup database on MongoDB Atlas
    - [x] Create model / schema using **mongoose**
    - [x] Initialise database
    - [x] Check for user in db
    - [x] User does not exist signup user / add to db
    - [ ] else return user already exists
 - [x] Check if email is unique
    - [x] Hash password with **bcrypt**
    - [x] Insert into db
 - [ ] Email link for signup confimation
    - [ ] Email redirects to login page

- [ ] Setup Oauth Signup
- [ ] reCaptcha

## Login (Backend)
 - [ ] Login user with POST /auth/login
   - [ ] validate the user
   - [ ] check if username in db
   	- [ ] compare password with hashed password in db using **bcrypt**
   	- [ ] Create and sign a JWT using **jsonwebtoken**
   	- [ ] Respond with JWT
- [ ] If a logged in user visits the signup or login page, redirect them to the dashboard
- [ ] On homepage, show go to dashboard button instead of signup/login button
- [ ] If logged in:
    - [ ] Show logout button in header
    - [ ] Show user icon and username in header
    - [ ] If a non logged in user visits the dashboard, redirect to the login page
    - [ ] Show username on dashboard
- [ ] Forgotten password
    - [ ] Send password reset email
    - [ ] Update database with new password 

 - [ ] Install **express-rate-limit** to limit amount of login requests (prevent brute force logins)
    - [ ] Lock account if too many attempts
    - [ ] Send password reset email

- [ ] Password strength meter!
- [ ] reCaptcha

## Create Login / Signup (Frontend)
- [x] Create Landing Page
    - [x] Link to Sign Up Page
- [x] Create Sign Up Page
    - [x] Form with: email and password
    - [x] When form is submitted
    	- [x] Validate email
    	- [ ] Display errors
    	- [x] Validate password
    	    - [ ] Display errors
       	    - [x] POST request to server
       	    - [ ] Display errors

- [x] Create Login Page
    - [x] Form with: email and password
    - [x] When form is submitted
    	- [x] Validate email
	    - [ ] Display errors
	    - [x] Validate password
	    - [ ] Display errors
	- [x] POST request to server /auth/login

## Further Authorization:

- [ ] Visitors can only see the homepage
    - [ ] checkTokenSetUser middleware
	- [ ] get token from Authorization header
	- [ ] if defined ---
	    - [ ] Verify the token with the token secret
	    - [ ] Set req.user to be the decoded verified payload
	    - [ ]  else - move along
    - [ ] isLoggedIn middleware
	- [ ] if req.user is set - move along
	- [ ] else - send an unauthorized error message
    	- [ ] redirect to login form
- [ ] Logged in users can only see their page

## Admin Page:
- [ ] Admin page that lists all users
    - [ ] Admin table with user_id
    - [ ] de-activate users
- [ ] Admin can see any page on site

## Deployment

-    Move the server package.json to the root of the folder
-    Update start script for server to be a relative path
-    Environment variable for DB connection and token secret
-    Update calls in client from localhost:5000 to be your-app.herokuapp.com
