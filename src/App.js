import React from "react";
import "./App.css";

import MyReadingsMain from "./MyReadingsMain";

class BooksApp extends React.Component {
  render() {
    return (
      <div className="app">
        <MyReadingsMain />
      </div>
    );
  }
}

export default BooksApp;
