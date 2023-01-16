require("dotenv").config();

const { request, response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./Database/database");
const bookM = express();
bookM.use(bodyParser.urlencoded({extended: true}));
bookM.use(bodyParser.json()); 

// Models
const BookModel = require("./Database/book");
const AuthorModel = require("./Database/author");
const PublicationModel = require("./Database/publication");

//conneting the mongoDB with mongoose 

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection Established"));

//to show everything connected properly
/* 
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/ 


bookM.get("/books",async (request,response) => {
    const getAllBooks = await BookModel.find();
    return response.json(getAllBooks);
});


/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/ 
bookM.get("/is/:isbn",async (request,response) => {
    const getSpecificBook = await BookModel.findOne({ISBN: request.params.isbn});
    // null - applied only in mongoDB
    // !0 = 1 and !1 = 0 

        if(!getSpecificBook)
        {
            return response.json({error: `No book found for the ISBN ${request.params.isbn}`});
        }

        return response.json(getSpecificBook);

});

/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/ 

bookM.get("/cat/:category",async (request,response) => {
    const getSpecificBook = await BookModel.findOne({category: request.params.category});

if(!getSpecificBook)
{
    return response.json({error: `No search found for this book category: ${request.params.category}`});
}

return response.json(getSpecificBook);

});
/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/ 

bookM.get("/lang/:language",async (request,response) => {
    const getSpecificBook = await BookModel.findOne({language: request.params.language});

    if(!getSpecificBook) {
        return response.json({error: `No book found for this language: ${request.params.language}`});
    }

    return response.json(getSpecificBook);
});

//API for author

/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/ 

bookM.get("/author",async (request,response) => {
    const getAllAuthor = await AuthorModel.find();
    return response.json(getAllAuthor);
})

/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.get("/author/:id",async (request,response) => {
    const getSpecificAuthor = await AuthorModel.findOne({id: request.params.id});
    

    if(!getSpecificAuthor) {
        return response.json({error: `The author for this id: ${request.params.id} is not found`});
    }

    return response.json(getSpecificAuthor);
});

/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.get("/author/books/:isbn",async (request,response) => {
    const getSpecificAuthor = await AuthorModel.findOne({ISBN: request.params.isbn});


    if(!getSpecificAuthor)
    {
        return response.json({error: `No author found for the book: ${request.params.isbn}`});
    }

    return response.json(getSpecificAuthor);
})

//API for the publications

bookM.get("/publications",async (request,response) => {
    const getAllPublication = await PublicationModel.find();
    return response.json(getAllPublication);
});
/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.get("/publications/:id",async (request,response) => {
    const getSpecificPublication = await PublicationModel.findOne({id: request.params.id});
    
    
    if(!getSpecificPublication)
    {
        return response.json({error: `No publications found for the id: ${request.params.id}`});
    }

    return response.json(getSpecificPublication);
});
/*
Route   root route = / or /books
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.get("/publications/books/:isbn",async (request,response) => {
    const getSpecificPublication = await PublicationModel.findOne({ISBN: request.params.isbn});
    
    
    if(!getSpecificPublication)
    {
        return response.json({error: `No publications found for the Book isbn: ${request.params.isbn}`});
    }

    return response.json(getSpecificPublication);
});


//POST Method start

/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.post("/books/new",async (request,response) => {
    const { newBook } = request.body;
    const addNewBook = BookModel.create(newBook);
    return response.json({
        books: addNewBook,
        message: "New Book added...!!!"
    });
});

/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.post("/author/new",async (request,response) => {
    const { newAuthor } = request.body;
    const addNewAuthor = AuthorModel.create(newAuthor)
    return response.json({
        author: addNewAuthor,
        message: "New author added...!"
    });    
});

/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.post("/publications/new",async (request,response) => {
    const { newPublication } = request.body;
    const addNewPublication = PublicationModel.create(newPublication)
    return response.json({
        publication: addNewPublication,
        message: "New Publication added...!!!"
    });
});

// push with some specific if-else condition

/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.put("/book/update/:isbn", async (request,response) => {    
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: request.params.isbn
        },
        {
            title: request.body.bookTitle 
        },
        {
            new: true
        }
        );

        return response.json({
            books: updatedBook,
            message: "Book Updated...!"
        });
});
//updating new Author 

/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.put("/book/author/update/:isbn",async (request,response) => {
     //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: request.params.isbn
        },
        {
            $addToSet: {
                author: request.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: request.body.newAuthor
        },
        {
            $addToSet: {
                books: request.params.isbn
            }
        },
        {
            new: true
        }
    );

    return response.json({
        books: updatedBook,
        author: updatedAuthor,
        message: "Both updated successfully...!"
    })
});



bookM.put("/publication/update/book/:isbn", (request,response) => {
    //updation of publication 
    database.publication.forEach((pub) => {
        if(pub.id === request.body.pubId) {
            return pub.books.push(request.params.isbn);  
        }
    });


    
// updation of books database
database.books.forEach((book) => {
    if(book.ISBN === request.params.isbn) {
        book.publications = request.body.pubId;
        return;
    }
});



return response.json(
    {
        books: database.books,
        publications: database.publication,
        message: "Successfully update publication"
    }
);
});

// Delete
/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/


// ------Danger Zonep-------
bookM.delete("/book/delete/:isbn",async (request,response) => {
    const updateBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: request.params.isbn
        }
    );      
        return response.json({
            books: updateBookDatabase,
            messgae: "Book Deleted...!!!"
        });
});

// delete author from book
/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

bookM.delete("/book/author/delete/:isbn/:authorId", (request,response) => {
    database.books.forEach((book) => {
        if(book.ISBN === request.params.isbn)
        {
            const Nauthor = book.author.filter(
                (Eauthor) => Eauthor !== parseInt(request.params.authorId)
                );
                book.author = Nauthor;
                return response.json({
                    books: database.books,
                    message: "author deleted"
                });
        }
    }) 
});


/*
Route          /book/new
Description    get all the books
Access         Public
Parameters     None
Methods        GET
*/

// this is for books

bookM.delete("/book/delete/author/:isbn/:authorId", (request,response) => {
    database.books.forEach((book) => {
        if(book.ISBN === request.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(request.params.authorId)
                );
                book.author = newAuthorList;
                return;
            }
        });
        // this is for authors
        
        database.author.forEach((eachAuthor) => {
            if(eachAuthor.id === parseInt(request.params.authorId)){
                const newBooKLst = eachAuthor.books.filter(
                    (book) => book !== request.params.isbn
                    );
                    eachAuthor.books = newBooKLst;
                    return;
            }
        });
        
        
return response.json({
    books: database.books,
    auhtor: database.author,
    message: "Author is deleted"
});
});

bookM.listen(3000, () => {
    console.log("Server is running properly");
});

// mongoose.connect("mongodb+srv://sac_409:Sachin09876@shapeapi.b3fz0nx.mongodb.net/BookM?retryWrites=true&w=majority",
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// }
// ).then(() => console.log("Connection Established"));

//Node JS
// microservices , validation