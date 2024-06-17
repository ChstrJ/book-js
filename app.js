class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
        if(book.isbn === isbn) {
            books.splice(index, 1)
        }
    })

        localStorage.setItem('books', JSON.stringify(books));
    }
}


class UI {
    static displayBooks () {
        const storedBooks = Store.getBooks();
        storedBooks.forEach((book) => UI.addBookList(book));
    }

    static addBookList(book) {
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr');

        row.innerHTML = `
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
                        `;

        list.appendChild(row)        
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(msg, className) {
        const div = document.createElement('div');
        
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));
        
        const card = document.querySelector('.card');
        const form = document.querySelector('#book-form');

        card.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000)

    }
}


// event display books
document.addEventListener('DOMContentLoaded', UI.displayBooks());

//event add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    if(title == '' || author == '' || isbn == '') {
        UI.showAlert('Error please fill out all the fields', 'danger')
    } else {
        const book = new Book(title, author, isbn);
    
        UI.addBookList(book);

        Store.addBook(book);

        UI.showAlert('Book added', 'success')
    
        UI.clearFields();

    }


})

//delete a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    const isbn = e.target.parentElement.previousElementSibling.textContent;
    UI.deleteBook(e.target);
    Store.removeBook(isbn)
    UI.showAlert('Book removed', 'success')
})