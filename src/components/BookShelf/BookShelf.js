import React, { Component } from "react";

import Book from "../Book/Book";
class BookShelf extends Component {
  areThereAnyBooksToShow = () =>
    this.props.books && this.props.books.length ? true : false;

  addBookHandler = (bookToAdd, shelf, oldshelf) => {
    this.props.addBook(bookToAdd, shelf, oldshelf);
  };
  render() {
    const { books, shelfName } = this.props;
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelfName}</h2>
        {this.areThereAnyBooksToShow() && (
          <div className="bookshelf-books">
            <ol className="books-grid">
              {books.map(book => {
                return (
                  <li key={book.id}>
                    <Book book={book} addBookHandler={this.addBookHandler} />
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    );
  }
}

export default BookShelf;
// TODO: Add Proptypes ...
