import React, { Component } from 'react';
import SwitchListButton from './SwitchListButton';
import { Link } from 'react-router-dom';

export default class SearchList extends Component {
  isItPossibleToDisplayQueryItems = () => {
    if (this.props.searchedItems.length > 0) return true;
    return false;
  };

  containsImageLink = item => {
    if (item.imageLinks) return true;
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
      <div className='search-books'>
        <div className='search-books-bar'>
          <Link to='/'>
            <button className='close-search'>Close</button>
          </Link>

          <div className='search-books-input-wrapper'>
            <input
              type='text'
              placeholder='Search by title or author'
              onChange={this.props.searchAPI}
            />
          </div>
        </div>
        {this.isItPossibleToDisplayQueryItems() ? (
          <div className='search-books-results'>
            <ol className='books-grid'>
              {this.props.searchedItems.map(book => {
                return (
                  <li key={book.id}>
                    <div className='book'>
                      <div className='book-top'>
                        {this.containsImageLink(book) ? (
                          <div
                            className='book-cover'
                            style={{
                              width: 128,
                              height: 192,
                              backgroundImage: `url(${book.imageLinks.smallThumbnail})`
                            }}></div>
                        ) : (
                          <div
                            className='book-cover'
                            style={{
                              width: 128,
                              height: 192,
                              backgroundImage: `url(${book.previewLink})`
                            }}></div>
                        )}
                        <SwitchListButton
                          bookAttached={book}
                          removeBookHandler={this.removeBookHandler}
                          addBookHandler={this.addBookHandler}
                          updateResultListHandler={
                            this.props.updateResultListHandler
                          }
                          updateResultList={this.props.updateResultList}
                        />
                      </div>
                      <div className='book-title'>{book.title}</div>
                      <div className='book-authors'>{book.authors}</div>
                    </div>
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
