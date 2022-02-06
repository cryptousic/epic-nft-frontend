import React from "react";
import '../styles/App.css';
import {Footer} from "../components/Footer"
import Minter from "../components/Minter";

const App = () => {
    return (
        <div className="App">
            <div className="container">
                <Minter />
                <Footer/>
            </div>
        </div>
    );
};

export default App;