import React from "react";
import "./App.css";
import {AnnualPlanning} from "../../plannings";
import {MonthlyPlanning} from "../../plannings";
import '../../../styles/Home.css';

const Home = () => {
   return (
         <div>
             <div className="container">
                <AnnualPlanning />
             </div>
             <div className="container">
                <MonthlyPlanning />
             </div>
         </div>
      );
};

export default Home;
