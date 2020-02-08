import React from "react";

import SwitchListButton from "./components/SwitchListButton";

const Book = ({ book, removeBookHandler, addBookHandler }) => {
  const containsImageLink = item => {
    if (item.imageLinks) return true;
    return false;
  };
  return (
    <div className="book">
      <div className="book-top">
        {containsImageLink(book) ? (
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
          removeBookHandler={removeBookHandler}
          addBookHandler={addBookHandler}
        />
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors}</div>
    </div>
  );
};

export default Book;
