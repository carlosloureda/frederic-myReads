import React, { Component } from "react";
import { update } from "../../../api/BooksAPI";

export default class SwitchListButton extends Component {
  state = {
    value: ""
  };

  setBookToNewShelf = newShelfSelected => {
    let newBook = this.props.bookAttached;
    newBook["shelf"] = newShelfSelected;

    return newBook;
  };

  handleChange = event => {
    const newShelfSelected = event.target.value;
    this.setState({ value: newShelfSelected });
    this.updateBookProperty(newShelfSelected);
    const currentBookShelf = this.getCurrentBookShelf();
    let newbook = this.props.bookAttached;

    if (!currentBookShelf) {
      newbook = this.setBookToNewShelf(newShelfSelected);
      this.props.addBookHandler(newbook, newShelfSelected);
    }

    if (newShelfSelected !== currentBookShelf && currentBookShelf) {
      this.props.addBookHandler(newbook, newShelfSelected, currentBookShelf);
    }
  };

  getCurrentBookShelf = () => {
    return this.props.bookAttached.shelf;
  };

  updateBookProperty = valueSelected => {
    update(this.props.bookAttached, valueSelected).then(result => {
      if (this.props.updateResultListHandler)
        this.props.updateResultListHandler(result);
    });
  };

  defaultSelect = () => {
    if (this.props.bookAttached.shelf) return this.props.bookAttached.shelf;
    return "none";
  };

  render() {
    return (
      <div className="book-shelf-changer">
        <select value={this.defaultSelect()} onChange={this.handleChange}>
          <option value="move" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
    );
  }
}
