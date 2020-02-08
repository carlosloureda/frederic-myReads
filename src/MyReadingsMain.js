import React, { Component } from "react";

import SearchList from "./SearchList";
import SearchButton from "./SearchButton";
import { getAll, search } from "./BooksAPI";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BookShelf from "./components/BookShelf/BookShelf";

export default class MyReadingsMain extends Component {
  state = {
    showSearchPage: false,
    shelves: {
      bookShelfRead: [],
      bookShelfCurrentlyReading: [],
      bookShelfWantToRead: []
    },
    searchedBooks: [],
    resultList: []
  };

  updateResultList = updatedResultList => {
    this.setState(() => ({
      resultList: updatedResultList
    }));
  };

  updateSearchResults = result => {
    if (result !== undefined)
      if (result.error !== "empty query") {
        result.map(book => {
          if (
            this.state.shelves.bookShelfRead.filter(
              bookRead => bookRead.id === book.id
            ).length > 0
          ) {
            book["shelf"] = "read";
          }

          if (
            this.state.shelves.bookShelfCurrentlyReading.filter(
              bookRead => bookRead.id === book.id
            ).length > 0
          ) {
            book["shelf"] = "currentlyReading";
          }

          if (
            this.state.shelves.bookShelfWantToRead.filter(
              bookRead => bookRead.id === book.id
            ).length > 0
          ) {
            book["shelf"] = "wantToRead";
          }
        });
        this.setState(
          {
            searchedBooks: result
          },
          () => {
            if (this.state.searchedBooks.length > 0)
              window.history.pushState("search", "Title", "/search");
          }
        );
      } else {
        this.setState({
          searchedBooks: []
        });
      }
  };

  searchAPI = e => {
    const query = e.target.value;
    if (query) {
      search(query)
        .then(result => this.updateSearchResults(result))
        .catch(e => console.log(e));
    } else {
      console.log("---> no query");
      this.updateSearchResults();
    }
  };

  componentDidMount() {
    this.updateBookShelf();
  }

  updateBookShelfs = result => {
    const readList = result.filter(book => book.shelf === "read");
    const wantToReadList = result.filter(book => book.shelf === "wantToRead");
    const currentlyReadingList = result.filter(
      book => book.shelf === "currentlyReading"
    );
    this.setState(() => ({
      shelves: {
        bookShelfRead: readList,
        bookShelfCurrentlyReading: currentlyReadingList,
        bookShelfWantToRead: wantToReadList
      }
    }));
  };

  updateBookShelf = () => {
    getAll().then(result => this.updateBookShelfs(result));
  };

  addBookToShelf = (book, newShelf, oldShelf) => {
    let currentBookOnReadShelf = this.state.shelves.bookShelfRead;
    let currentBookOnWantToReadShelf = this.state.shelves.bookShelfWantToRead;
    let currentBookOnCurrentlyReadingShelf = this.state.shelves
      .bookShelfCurrentlyReading;

    switch (newShelf) {
      case "read":
        book.shelf = "read";
        currentBookOnReadShelf = [...currentBookOnReadShelf, book];
        if (oldShelf === "wantToRead") {
          currentBookOnWantToReadShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnWantToReadShelf
          );
        } else if (oldShelf === "currentlyReading") {
          currentBookOnCurrentlyReadingShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnCurrentlyReadingShelf
          );
        } else {
        }
        break;

      case "wantToRead":
        book.shelf = "wantToRead";
        currentBookOnWantToReadShelf = [...currentBookOnWantToReadShelf, book];
        if (oldShelf === "read") {
          currentBookOnReadShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnReadShelf
          );
        } else if (oldShelf === "currentlyReading") {
          currentBookOnCurrentlyReadingShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnCurrentlyReadingShelf
          );
        } else {
        }
        break;

      case "currentlyReading":
        book.shelf = "currentlyReading";
        currentBookOnCurrentlyReadingShelf = [
          ...currentBookOnCurrentlyReadingShelf,
          book
        ];
        if (oldShelf === "wantToRead") {
          currentBookOnWantToReadShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnWantToReadShelf
          );
        } else if (oldShelf === "read") {
          currentBookOnReadShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnReadShelf
          );
        } else {
        }
        break;

      case "none":
        book.shelf = "none";

        if (oldShelf === "read") {
          currentBookOnReadShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnReadShelf
          );
        } else if (oldShelf === "wantToRead") {
          currentBookOnWantToReadShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnWantToReadShelf
          );
        } else if (oldShelf === "currentlyReading") {
          currentBookOnCurrentlyReadingShelf = this.removeBookFromShelf(
            book,
            oldShelf,
            currentBookOnCurrentlyReadingShelf
          );
        } else {
        }
        break;

      default:
        console.log("this shelf does not exist");
    }

    this.setState(() => ({
      shelves: {
        bookShelfRead: currentBookOnReadShelf,
        bookShelfWantToRead: currentBookOnWantToReadShelf,
        bookShelfCurrentlyReading: currentBookOnCurrentlyReadingShelf
      }
    }));
  };

  removeBookFromShelf = (bookToRemove, oldShelf, currentBooksFromShelf) => {
    const bookToReadCleaned = currentBooksFromShelf.filter(
      book => book.id !== bookToRemove.id
    );
    currentBooksFromShelf = bookToReadCleaned;
    return currentBooksFromShelf;
  };

  onClickSearchButtonHandler = () => {
    this.setState(prevState => ({ showSearchPage: !prevState.showSearchPage }));
    if (this.state.showSearchPage) window.location = "/search";
  };

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              path="/search"
              render={props => (
                <SearchList
                  searchedItems={this.state.searchedBooks}
                  searchAPI={this.searchAPI}
                  addBook={this.addBookToShelf}
                  removeBook={this.removeBookFromShelf}
                  updateResultListHandler={this.updateResultList}
                  updateResultList={this.state.resultList}
                />
              )}
            />
            <Route path="/">
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                    <BookShelf
                      books={this.state.shelves.bookShelfCurrentlyReading}
                      addBook={this.addBookToShelf}
                      shelfName="Currently Reading"
                      removeBook={this.removeBookFromShelf}
                    />
                    <BookShelf
                      books={this.state.shelves.bookShelfWantToRead}
                      addBook={this.addBookToShelf}
                      shelfName="Want To Read"
                      removeBook={this.removeBookFromShelf}
                    />
                    <BookShelf
                      books={this.state.shelves.bookShelfRead}
                      addBook={this.addBookToShelf}
                      shelfName="Read"
                      removeBook={this.removeBookFromShelf}
                    />
                  </div>
                </div>
                <SearchButton
                  onClickHandler={this.onClickSearchButtonHandler}
                />
              </div>
              }
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
