import React, { Component } from "react";
import SwitchListButton from "../../SwitchListButton";

class BookShelf extends Component {
  containsImageLink = item => {
    if (item.imageLinks) return true;
    return false;
  };

  areThereAnyBooksToShow = () => this.props.books.length;

  addBookHandler = (bookToAdd, shelf, oldshelf) => {
    this.props.addBook(bookToAdd, shelf, oldshelf);
  };

  removeBookHandler = (bookToRemove, shelf) => {
    this.props.removeBook(bookToRemove, shelf);
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
                    <div className="book">
                      <div className="book-top">
                        {this.containsImageLink(book) ? (
                          <div
                            className="book-cover"
                            style={{
                              width: 128,
                              height: 192,
                              backgroundImage: `url(${book.imageLinks.smallThumbnail})`
                            }}
                          ></div>
                        ) : (
                          <div
                            className="book-cover"
                            style={{
                              width: 128,
                              height: 192,
                              backgroundImage: `url(${book.previewLink})`
                            }}
                          ></div>
                        )}
                        <SwitchListButton
                          bookAttached={book}
                          removeBookHandler={this.removeBookHandler}
                          addBookHandler={this.addBookHandler}
                        />
                      </div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>
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
