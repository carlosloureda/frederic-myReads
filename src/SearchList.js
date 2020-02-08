import React, { Component } from "react";
import { Link } from "react-router-dom";

import Book from "./components/Book/Book";

export default class SearchList extends Component {
  isItPossibleToDisplayQueryItems = () => {
    if (this.props.searchedItems.length > 0) return true;
    return false;
  };

  addBookHandler = (bookToAdd, shelf, oldshelf) => {
    this.props.addBook(bookToAdd, shelf, oldshelf);
  };

  removeBookHandler = (bookToRemove, shelf) => {
    this.props.removeBook(bookToRemove, shelf);
  };

  isItABookFromMyShelf = bookToLookFor => {};

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/">
            <button className="close-search">Close</button>
          </Link>

          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={this.props.searchAPI}
            />
          </div>
        </div>
        {this.isItPossibleToDisplayQueryItems() ? (
          <div className="search-books-results">
            <ol className="books-grid">
              {this.props.searchedItems.map(book => {
                return (
                  <li key={book.id}>
                    <Book
                      book={book}
                      removeBookHandler={this.removeBookHandler}
                      addBookHandler={this.addBookHandler}
                    />
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div> nothing to display here</div>
        )}
      </div>
    );
  }
}
