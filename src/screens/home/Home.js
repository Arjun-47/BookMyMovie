import React, {Fragment} from "react";
import Header from "../../common/header/Header";
import UpcomingMovies from "../upcomingMovies/UpcomingMovies";
import ReleasedMovies from "../releasedMovies/ReleasedMovies";

const Home = function () {

    return (
        <Fragment>
            <Header/>
            <UpcomingMovies/>
            <ReleasedMovies/>
        </Fragment>
    );
};

export default Home;

