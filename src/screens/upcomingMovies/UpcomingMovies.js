import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

const styles = theme => ({
    root: {
        flexWrap: 'wrap',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        margin: "0px",
        textAlign: "center",
        align: "center",
        padding: "8px",
        backgroundColor: "#ff9999",
        fontSize: "1rem"
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

function UpcomingMovies(props) {
    const [upcomingMoviesList, setUpcomingMoviesList] = useState([]);

    function loadUpcomingMoviesList() {
        fetch("http://localhost:8085/api/v1/movies?limit=500")
            .then(rawResponse => rawResponse.json())
            .then(response => response['movies'])
            .then(movieData => {
                let tempList = [];
                for (let i = 0; i < movieData.length; i++) {
                    if (movieData[i]["status"] === "PUBLISHED") {
                        tempList[tempList.length] = {
                            id: movieData[i]['id'],
                            poster_url: movieData[i]['poster_url'],
                            title: movieData[i]['title'],
                        };
                    }
                }
                setUpcomingMoviesList(tempList);
            });
    }

    useEffect(() => {
        loadUpcomingMoviesList();
    }, []);

    const {classes} = props;
    return (
        <Fragment>
            <div className={classes.root}>
                <h2 className={classes.header}>Upcoming Movies</h2>
                <GridList className={classes.gridList} cellHeight={250} cols={2.5}>
                    {
                        upcomingMoviesList.map(movie => (
                            <GridListTile key={movie.id}>
                                <img src={movie.poster_url} alt={movie.title}/>
                                <GridListTileBar
                                    title={movie.title}
                                    classes={{
                                        root: classes.titleBar,
                                        title: classes.title,
                                    }}
                                />
                            </GridListTile>
                        ))
                    }
                </GridList>
            </div>
        </Fragment>

    );
}

UpcomingMovies.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpcomingMovies);