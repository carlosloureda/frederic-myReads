import React, { Component } from "react";

import SearchList from "./SearchList";

import { getAll, search } from "./api/BooksAPI";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage";

export default class MyReadingsMain extends Component {
  state = {
    showSearchPage: false,
    shelves: {
      bookShelfRead: [],
      bookShelfCurrentlyReading: [],
      bookShelfWantToRead: []
    },
    // TODO: Serached books and the search API query can (and should) live in the SearchList component
    //  You just need to pass into it the proper shelves books to work with it
    searchedBooks: [],
    resultList: []
  };

  updateResultList = updatedResultList => {
    this.setState(() => ({
      resultList: updatedResultList
    }));
  };

  updateSearchResults = (result = []) => {
    if (result.error !== "empty query") {
      const myBooks = [
        ...this.state.shelves.bookShelfCurrentlyReading,
        ...this.state.shelves.bookShelfWantToRead,
        ...this.state.shelves.bookShelfRead
      ];
      result = result.map(book => {
        myBooks.map(myBook => {
          if (myBook.id === book.id) {
            book.shelf = myBook.shelf;
          }
          return myBook;
        });
        return book;
      });
    }
    this.setState({
      searchedBooks: result
    });
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
              <HomePage
                shelves={this.state.shelves}
                addBookToShelf={this.addBookToShelf}
                removeBookFromShelf={this.removeBookFromShelf}
                onClickSearchButtonHandler={this.onClickSearchButtonHandler}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
