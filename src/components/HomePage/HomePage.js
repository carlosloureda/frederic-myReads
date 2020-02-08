import React from "react";

import SearchButton from "./components/SearchButton";
import BookShelf from "../BookShelf/BookShelf";

const HomePage = ({
  shelves,
  addBookToShelf,
  removeBookFromShelf,
  onClickSearchButtonHandler
}) => {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <BookShelf
            books={shelves.bookShelfCurrentlyReading}
            addBook={addBookToShelf}
            shelfName="Currently Reading"
            removeBook={removeBookFromShelf}
          />
          <BookShelf
            books={shelves.bookShelfWantToRead}
            addBook={addBookToShelf}
            shelfName="Want To Read"
            removeBook={removeBookFromShelf}
          />
          <BookShelf
            books={shelves.bookShelfRead}
            addBook={addBookToShelf}
            shelfName="Read"
            removeBook={removeBookFromShelf}
          />
        </div>
      </div>
      <SearchButton onClickHandler={onClickSearchButtonHandler} />
    </div>
  );
};

export default HomePage;
