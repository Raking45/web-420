/*
Name: Robert King
Date: March 2, 2025
File Name: app.js
Description:  API POST and DELETE Endpoint and Error Handling using TDD Principles.
(API PUT Endpoint and Error Handling Using TDD Principles for Week 6 Included)
*/

const express=require("express");
const bcrypt=require("bcryptjs");
const createError=require("http-errors");
const app=express();
const books = require("../database/books");
const users = require("../database/users");
const Ajv = require("ajv");
const ajv = new Ajv();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get("/", async (req, res, next) => {

  //HTML content & CSS styling for landing page
  const html = `
  <html>
    <head>
      <title>In-N-Out Books</title>
      <style>
        body, header, h1, nav, ul, li, a, section, footer {
          margin:0; 
          padding:0; 
          border:0;
          }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background-color:rgb(105, 105, 105);
          color: #333;
        }
        header {
          background: #333;
          color: #fff;
          padding: 1rem;
          text-align: center;
          border-bottom: 2px solid #000;
        }
        header nav ul {
          list-style: none;
        }
        header nav ul li {
          display: inline;
          margin-right: 15px;
        }
        header nav ul li a {
          color: #fff;
          text-decoration: none;
        }
        header nav ul li a:hover {
          color:rgb(25, 223, 230);
          text-decoration: underline;
        }
        h2 {
          text-align: center;
        }
        section {
          padding: 20px;
          margin: 20px auto;
          max-width: 800px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        #top-selling ul li {
          padding-left: 5px;
          margin-left: 30px;
        }
        #hours p {
        text-align: center;
        }
        #contact p {
        text-align: center;
        }
        footer {
          text-align: center;
          padding: 1rem 0;
          background: #333;
          color: #fff;
          margin-top: 20px;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Welcome to In-N-Out Books</h1>
        <nav>
          <ul>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#top-selling">Top Selling Books</a></li>
            <li><a href="#hours">Hours of Operation</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section id="introduction">
          <h2>Introduction</h2>
          <p>Welcome to In-N-Out Books, your go-to store for amazing books.  Discover a world of knowledge, stories, adventure, and creativity in every genre imaginable.</p>
        </section>

        <section id="top-selling">
          <h2>Top Selling Books</h2>
          <ul>
            <li>"Fourth Wing" by Rebecca Yarros</li>
            <li>"The Big Empty" by Robert Crais</li>
            <li>"Iron Flame" by Rebecca Yarros</li>
            <li>"The Housemaid" by Freida McFadden</li>
            <li>"James" by Percival Everret</li>
            <li>"Onyx Storm" by Rebecca Yarros</li>
            <li>"Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones" by James Clear</li>
            <li>"Wind and Truth" by Brandon Sanderson</li>
          </ul>
        </section>

        <section id="hours">
          <h2>Hours of Operation</h2>
          <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
          <p>Saturday: 9:00 AM - 5:00 PM</p>
          <p>Sunday: Closed</p>
        </section>

        <section id="contact">
          <h2>Contact Us</h2>
          <p>Email: support@in-n-out-books.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Readers Delight, Morgantown, WV 26505</p>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 In-N-Out Books.  All rights reserved</p>
      </footer>
    </body>
  </html>
  `;

  res.send(html);
});

//POST route to log a user in
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if ( !email || !password ) {
      return res.status(400).json({ message: "Email and password are required."});
    }

    const user = await users.findOne({ email });
    if ( !user || !bcrypt.compareSync( password, user.password )) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ message: "Authentication successful" });
  } catch (err) {
    next(err);
  }
});



//GET all books API endpoint
app.get('/api/books', async (req, res) => {
  try {
    const allBooks = await books.find();
    console.log("All Books:", allBooks);
    res.json(allBooks);
  } catch (err) {
    next(err);
  }
});

app.get("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Input must be a number."});
    }
    const book = await books.findOne({ id });
    if (!book) {
      return res.status(404).json({ message: "Book not found."});
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// POST Route to add a new book API endpoint
app.post("/api/books", async (req, res, next) => {
  try {
    const { id, title, author } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Book title is required." });
    }
    const newBook = { id, title, author };
    await books.insertOne(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
});

// DELETE route to remove a book by ID
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Book ID must be a number." });
    }
    const deletedBook = await books.deleteOne({ id });
    if (!deletedBook.deletedCount) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//PUT to update and add books API endpoint
app.put('/api/books/:id', async (req, res, next) => {
  try {
    let {id} = req.params;
    id = parseInt(id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Book ID must be a number." });
    }
    const { title, author } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Book title is required." });
    }
    const book = await books.updateOne(
      { id },
      { title, author },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//Schema validation for security question answers
const securityQuestionSchema = {
  type: "object",
  properties: {
    answer1: { type: "string" },
    answer2: { type: "string" },
  },
  required: ["answer1", "answer2"],
  additionalProperties: false,
};

const validateSecurityQuestions = ajv.compile(securityQuestionSchema);

//POST route to verify user's security questions
app.post("/api/users/:email/verify-security-question", async (req, res, next) => {
  try {
    const { email } = req.params;
    const { answer1, answer2 } = req.body;

    //Validate request body
    if (!validateSecurityQuestions(req.body)) {
      return res.status(400).json({ message: "Invalid request format." });
    }

    //Find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //Compare provided answers with stored answers
    if (user.securityAnswers.answer1 !== answer1 || user.securityAnswers.answer2 !== answer2) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ message: "Security questions successfully answered." });
  } catch (err) {
    next(err);
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

//Exporting the app
module.exports = app;

//Starting the server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}