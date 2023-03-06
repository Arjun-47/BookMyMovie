import React, {Fragment, useEffect, useState} from "react";
import Header from "../../common/header/Header";
import Typography from "@material-ui/core/Typography";
import YouTube from "react-youtube";
import {StarBorder} from "@material-ui/icons";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import GridList from "@material-ui/core/GridList";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {Link} from "@material-ui/core";

const styles = () => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    backToHome: {
        marginLeft: '24px',
        marginTop: '8px',
        marginBottom: '0px',
        height: '24px',
        cursor: 'pointer'
    },
    posterSection: {
        display: 'flex',
        flexWrap: 'wrap',
        align: 'left',
        flex: '20%',
    },
    contentSection: {
        display: 'flex',
        alignContent: "space-between",
        justifyContent: "space-between",
        flexFlow: "row wrap",
        flexDirection: 'column',
        align: 'left',
        flex: '60%',
        space: 1,
    },
    ratingSection: {
        display: 'flex',
        flexDirection: 'column',
        flex: '20%',
    },
    formButton: {
        'text-transform': 'uppercase'
    },
    contentFields: {
        width: "100%"
    }
});
const Details = (props) => {

    const [movieInfo, setMovieInfo] = useState({});
    const [genre, setGenre] = useState("");
    const [trailerUrl, setTrailerUrl] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [rating, setRating] = useState(0);
    const [artistsList, setArtistsList] = useState([]);

    function loadMovieInfo() {
        const currentUrl = document.URL;
        const url = "http://localhost:8085/api/v1/movies/" + currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
        fetch(url)
            .then(rawResponse => rawResponse.json())
            .then(response => {
                setMovieInfo(response);
                setGenre(response["genres"].join(", "));
                const trailerUrl = response["trailer_url"];
                setTrailerUrl(trailerUrl.substring(trailerUrl.indexOf('=') + 1));
                setReleaseDate(new Date(response["release_date"]).toDateString());
                const tempArtistsList = response["artists"];
                const temp = [];
                for (let i = 0; i < tempArtistsList.length; i++) {
                    temp[temp.length] = {
                        id: tempArtistsList[i]["id"],
                        fullName: tempArtistsList[i]["first_name"] + " " + tempArtistsList[i]["last_name"],
                        profileUrl: tempArtistsList[i]["profile_url"]
                    }
                }
                setArtistsList(temp);
            });
    }

    useEffect(() => {
        loadMovieInfo();
    }, [])

    const handleOnReady = (event) => {
        event.target.pauseVideo();
    }

    const handleRating1 = () => {
        setRating(1);
    }
    const handleRating2 = () => {
        setRating(2);
    }
    const handleRating3 = () => {
        setRating(3);
    }
    const handleRating4 = () => {
        setRating(4);
    }
    const handleRating5 = () => {
        setRating(5);
    }

    const {classes} = props;

    return (
        <Fragment>
            <Header/>
            <div className={classes.root}>
                <div className={classes.posterSection}>
                    <Link className={"back-to-home"} href={"/"}><Typography>&#60; Back to Home</Typography></Link>
                    <img src={movieInfo.poster_url} alt={movieInfo.title}/>
                </div>
                <div className={classes.contentSection}>
                    <Typography className={classes.contentFields} variant={"headline"}
                                component={"h2"}>{movieInfo.title}</Typography>
                    <Typography className={classes.contentFields}><b>Genres: </b>{genre}</Typography>
                    <Typography className={classes.contentFields}><b>Duration: </b>{movieInfo["duration"]}</Typography>
                    <Typography className={classes.contentFields}><b>Release Date: </b>{releaseDate}</Typography>
                    <Typography className={classes.contentFields}><b>Rating: </b>{movieInfo["rating"]}</Typography>
                    <Typography className={classes.contentFields}><b>Plot: </b> (<a href={movieInfo["common-url"]}
                                                                                    className={"common-margin-field"}> Wiki
                        Link</a>) {movieInfo["storyline"]}</Typography>
                    <Typography className={"common-margin-field " + classes.contentFields}><b>Trailer: </b>
                    </Typography>
                    <YouTube videoId={trailerUrl} onReady={handleOnReady}/>
                </div>
                <div className={classes.ratingSection}>
                    <div className={classes.contentFields}>
                        <Typography><b>Rate this movie:</b></Typography>
                        <StarBorder onClick={handleRating1} nativeColor={rating >= 1 ? "yellow" : "black"}/>
                        <StarBorder onClick={handleRating2} nativeColor={rating >= 2 ? "yellow" : "black"}/>
                        <StarBorder onClick={handleRating3} nativeColor={rating >= 3 ? "yellow" : "black"}/>
                        <StarBorder onClick={handleRating4} nativeColor={rating >= 4 ? "yellow" : "black"}/>
                        <StarBorder onClick={handleRating5} nativeColor={rating >= 5 ? "yellow" : "black"}/>
                    </div>
                    <div>
                        <Typography className={"artists-label"}><b>Artists:</b></Typography>
                        <GridList cellHeight={350} cols={2} className={classes.gridList}>
                            {artistsList.map(artist => (
                                <GridListTile key={artist.id}>
                                    <img src={artist.profileUrl} alt={artist.fullName}/>
                                    <GridListTileBar
                                        title={artist.fullName}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>

            </div>
        </Fragment>
    );
};

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Details);