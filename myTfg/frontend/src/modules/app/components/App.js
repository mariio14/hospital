import React from "react";

import Body from "./Body";
import Header from "./Header";
import './App.css';
import {useDispatch} from "react-redux";

const App = () => {

    const dispatch = useDispatch();

  return (
    <div>
      <Header/>
      <Body/>

    </div>
  );
};

export default App;
