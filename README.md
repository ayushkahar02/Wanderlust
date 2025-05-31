# Backend Project Documentation

## Overview
This project is a backend application built using Node.js, Express, and MongoDB. It provides a RESTful API for managing listings, allowing users to create, read, update, and delete listings. The application uses Mongoose for object data modeling and EJS for rendering views.

## Project Structure
```
backend
├── models
│   └── listing_schema.js# Backend Project Documentation

## Overview
This project is a backend application built using Node.js, Express, and MongoDB. It provides a RESTful API for managing listings, allowing users to create
├── views
│   ├── listings
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
├── init
│   ├── data.js
│   └── index.js
├── app.js
├── package.json
└── README.md
```

## Files and Functionality

### 1. models/listing_schema.js
- Defines the Mongoose schema for listings.
- Exports the `Listing` model with properties: `title`, `description`, `image`, `price`, `location`, and `country`.
- The `title` is required, while the `image` has a default value and a setter to handle empty strings.

### 2. views/listings/edit.ejs
- Provides an HTML form for editing an existing listing.
- Pre-fills the form fields with the current values of the listing, allowing users to update the title, description, image, price, location, and country.

### 3. views/listings/index.ejs
- Displays a list of all listings.
- Includes a button to create a new listing and links to view each listing's details.

### 4. views/listings/new.ejs
- Contains the HTML form for creating a new listing.
- Allows users to input the title, description, image URL, price, location, and country.

### 5. views/listings/show.ejs
- Presents the details of a specific listing.
- Displays the title, description, price, location, and country, along with options to edit or delete the listing.

### 6. init/data.js
- Contains sample data for the listings.
- Exports an array of sample listings that can be used to initialize the database.

### 7. init/index.js
- Connects to the MongoDB database and initializes it with the sample data from `data.js`.
- Deletes any existing listings and inserts the sample listings into the database.

### 8. app.js
- The main entry point of the application.
- Sets up the Express server, connects to the MongoDB database, and defines the routes for handling CRUD operations on listings.
- Includes routes for creating, reading, updating, and deleting listings.

### 9. package.json
- Contains metadata about the project, including dependencies such as Express, Mongoose, EJS, and method-override.
- Includes scripts for running the application.

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the required dependencies.
4. Ensure that MongoDB is running on your local machine.
5. Run `node init/index.js` to initialize the database with sample data.
6. Start the server by running `node app.js`.
7. Access the application at `http://localhost:3000`.

## Usage
- Navigate to `/listings` to view all listings.
- Use the "Create new listing" button to add a new listing.
- Click on a listing title to view its details.
- Use the "Edit Your Listing" link to modify an existing listing.
- Use the "Delete" button to remove a listing.

## Conclusion
This backend application provides a robust framework for managing listings, with a clear structure and easy-to-use interface. It can be further expanded with additional features and improvements as needed.