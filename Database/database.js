const books = [
    {
        ISBN: "1234Book",
        title: "Tesla",
        pubDate: "01-12-2021",
        language: "en",
        numPage: 250,
        author: [1,2],
        publications: [1],
        category: ["tech", "space", "education"]
    }
]

const author = [
    {
        id: 1,
        name: "Sachin",
        books: ["1234Book", "SecretBook"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["1234Book"]
    }
]

const publication = [
    {
        id: 1,
        name: "Satya Publications",
        books: ["1234Book"]
    },
    {
        id: 2,
        name: "Surya Publications",
        books: ["SecretBook"]
    }
]

module.exports = {books, author, publication};