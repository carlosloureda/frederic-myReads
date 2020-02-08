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
            books={shelves.currentlyReading}
            addBook={addBookToShelf}
            shelfName="Currently Reading"
          />
          <BookShelf
            books={shelves.wantToRead}
            addBook={addBookToShelf}
            shelfName="Want To Read"
          />
          <BookShelf
            books={shelves.read}
            addBook={addBookToShelf}
            shelfName="Read"
          />
        </div>
      </div>
      <SearchButton onClickHandler={onClickSearchButtonHandler} />
    </div>
  );
};

export default HomePage;
