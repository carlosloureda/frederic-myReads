import React, { Component } from "react";

import SearchList from "./SearchList";

import { getAll, search } from "./api/BooksAPI";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage";

export default class MyReadingsMain extends Component {
  state = {
    showSearchPage: false,
    shelves: {
      read: [],
      currentlyReading: [],
      wantToRead: []
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
        ...this.state.shelves.currentlyReading,
        ...this.state.shelves.wantToRead,
        ...this.state.shelves.read
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
        read: readList,
        currentlyReading: currentlyReadingList,
        wantToRead: wantToReadList
      }
    }));
  };

  updateBookShelf = () => {
    getAll().then(result => this.updateBookShelfs(result));
  };

  addBookToShelf = (book, newShelf, oldShelf) => {
    /* ERROR: TODO: You were updating the state directly! You need to do copies of state like this
    https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array/
    */
    let _shelves = {
      currentlyReading: [...this.state.shelves.currentlyReading],
      wantToRead: [...this.state.shelves.wantToRead],
      read: [...this.state.shelves.read]
    };

    if (newShelf) {
      // remove book from the old arrays
      _shelves[book.shelf] = this.removeBookFromShelf(
        book,
        _shelves[book.shelf]
      );
      // push book into the new arrays
      if (newShelf !== "none") {
        book.shelf = newShelf;
        _shelves[newShelf] = _shelves[newShelf].concat(book);
      } else {
        book.shelf = "none";
      }
    }

    this.setState({
      shelves: _shelves
    });
  };

  removeBookFromShelf = (bookToRemove, currentBooksFromShelf) => {
    return currentBooksFromShelf.filter(book => book.id !== bookToRemove.id);
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
                  updateResultListHandler={this.updateResultList}
                  updateResultList={this.state.resultList}
                />
              )}
            />
            <Route path="/">
              <HomePage
                shelves={this.state.shelves}
                addBookToShelf={this.addBookToShelf}
                onClickSearchButtonHandler={this.onClickSearchButtonHandler}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
