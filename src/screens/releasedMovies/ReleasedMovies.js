import React, {Fragment, useEffect, useState} from 'react';
import './ReleasedMovies.css'
import GridList from "@material-ui/core/GridList";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import GridListTile from "@material-ui/core/GridListTile";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {Checkbox, ListItemText, TextField} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        float: 'center',
        align: "center"
    },
    gridList: {
        display: 'flex',
        flex: '76%',
        cursor: 'pointer',
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    filters: {
        display: 'flex',
        flex: '24%',
        // margin: theme.spacing.unit
    },
    filterHeader: {
        'text-transform': 'uppercase',
        color: theme.palette.primary.light
    },
    formControl: {
        space: 1,
        minWidth: 240,
        maxWidth: 240,
    },
    formButton: {
        'text-transform': 'uppercase'
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function ReleasedMovies(props) {
    const [releasedMoviesList, setReleasedMoviesList] = useState([]);
    const [selectedGenreList, setSelectedGenreList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [artistList, setArtistList] = useState([]);
    const [selectedArtistsList, setSelectedArtistsList] = useState([]);
    const [releaseDateStart, setReleaseDateStart] = useState("");
    const [movieName, setMovieName] = useState("");
    const [releaseDateEnd, setReleaseDateEnd] = useState("");

    function loadGenreList() {
        fetch("http://localhost:8085/api/v1/genres")
            .then(rawResponse => rawResponse.json())
            .then(response => response['genres'])
            .then(genreData => {
                let tempList = [];
                for (let i = 0; i < genreData.length; i++) {
                    tempList[i] = genreData[i]['genre'];
                }
                setGenreList(tempList);
            });
    }

    function loadArtistsList() {
        fetch("http://localhost:8085/api/v1/artists")
            .then(rawResponse => rawResponse.json())
            .then(response => response['artists'])
            .then(artistsData => {
                let tempList = [];
                for (let i = 0; i < artistsData.length; i++) {
                    tempList[i] = artistsData[i]['first_name'] + " " + artistsData[i]['last_name'];
                }
                setArtistList(tempList);
            });
    }

    function loadReleasedMoviesList() {
        fetch("http://localhost:8085/api/v1/movies?limit=500")
            .then(rawResponse => rawResponse.json())
            .then(response => response['movies'])
            .then(movieData => {
                let tempList = [];
                for (let i = 0; i < movieData.length; i++) {
                    if (movieData[i]["status"] === "RELEASED") {
                        tempList[tempList.length] = {
                            id: movieData[i]['id'],
                            poster_url: movieData[i]['poster_url'],
                            title: movieData[i]['title'],
                            genres: movieData[i]['genres'],
                            release_date: movieData[i]['release_date'],
                            artists: movieData[i]['artists']
                        };
                    }
                }
                setReleasedMoviesList(tempList);
            });
    }

    useEffect(() => {
        loadReleasedMoviesList();
        loadGenreList();
        loadArtistsList();
    }, []);

    const handleChangeOnMovieNameFilter = (event) => {
        setMovieName(event.target.value);
    }

    const handleChangeOnGenreDropdown = (event) => {
        setSelectedGenreList(event.target.value);
    };

    const handleChangeOnArtistsDropdown = (event) => {
        setSelectedArtistsList(event.target.value);
    };

    const handleChangeOnReleaseDateStart = (event) => {
        setReleaseDateStart(event.target.value);
    }

    const handleChangeOnReleaseDateEnd = (event) => {
        setReleaseDateEnd(event.target.value);
    }

    function filterTheReleasedMoviesList() {
        let tempList = [];
        for (let i = 0; i < releasedMoviesList.length; i++) {
            let conditionMet = true;
            if (movieName !== '' && movieName !== null && movieName !== undefined) {
                conditionMet = conditionMet && movieName === releasedMoviesList[i].title;
            }

            let checkSubset = (parentArray, subsetArray) => {
                return subsetArray.every((el) => {
                    return parentArray.includes(el)
                })
            }

            if (selectedGenreList.length !== 0 ) {
                conditionMet = conditionMet && checkSubset(releasedMoviesList[i].genres, selectedGenreList);
            }

            let tempArtistData = releasedMoviesList[i].artists;
            let artistList = [];
            for (let i = 0; i < tempArtistData.length; i++) {
                artistList[artistList.length] = tempArtistData[i]['first_name'] + " " + tempArtistData[i]['last_name'];
            }

            if (selectedArtistsList.length !== 0) {
                conditionMet = conditionMet && checkSubset(artistList, selectedArtistsList);
            }

            if (releaseDateStart !== '' && releaseDateStart !== null && releaseDateStart !== undefined) {
                conditionMet = conditionMet && new Date(releaseDateStart) <= new Date(releasedMoviesList[i].release_date);
            }

            if (releaseDateEnd !== '' && releaseDateEnd !== null && releaseDateEnd !== undefined) {
                conditionMet = conditionMet && new Date(releaseDateEnd) >= new Date(releasedMoviesList[i].release_date);
            }

            if(conditionMet){
                tempList[tempList.length] = releasedMoviesList[i];
            }

        }
        setReleasedMoviesList(tempList);
    }

    const applyFilters = () => {
        filterTheReleasedMoviesList();
    }

    const {classes} = props;

    return (
        <Fragment>
            <div className={classes.root}>
                <GridList cellHeight={350} cols={4} className={classes.gridList}>
                    {releasedMoviesList.map(releasedMovie => (
                        <GridListTile key={releasedMovie.title}>
                            <a href={"/movie/" + releasedMovie.id}>
                                <img src={releasedMovie.poster_url} alt={releasedMovie.title}/>
                            </a>
                            <GridListTileBar
                                title={releasedMovie.title}
                                subtitle={<span>Release Date: {releasedMovie.release_date}</span>}
                            />
                        </GridListTile>
                    ))}
                </GridList>
                <Card className={classes.filters}>
                    <CardContent>
                        <h2 className={classes.filterHeader}>Find Movies By:</h2>
                        <FormControl className={classes.formControl}>
                            <TextField id={"movie-name"} label={"Movie Name"} onChange={handleChangeOnMovieNameFilter}/>
                        </FormControl>
                        <br/>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="genreLabel">Genre</InputLabel>
                            <Select
                                id={"genreList"}
                                multiple
                                MenuProps={MenuProps}
                                input={<Input/>}
                                onChange={handleChangeOnGenreDropdown}
                                value={selectedGenreList}
                                label={"Genres"}
                                placeholder={"Genres"}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {
                                    genreList.map(genre => (
                                        <MenuItem key={genre} value={genre}>
                                            <Checkbox checked={selectedGenreList.indexOf(genre) !== -1}/>
                                            <ListItemText primary={genre}/>
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="artistsLabel">Artists</InputLabel>
                            <Select
                                id={"artistsList"}
                                multiple
                                MenuProps={MenuProps}
                                input={<Input/>}
                                onChange={handleChangeOnArtistsDropdown}
                                value={selectedArtistsList}
                                label={"Artists"}
                                placeholder={"Artists"}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {
                                    artistList.map(artist => (
                                        <MenuItem key={artist} value={artist}>
                                            <Checkbox checked={selectedArtistsList.indexOf(artist) !== -1}/>
                                            <ListItemText primary={artist}/>
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl className={classes.formControl}>
                            <TextField
                                type={"date"}
                                id={"release-date-start"}
                                label={"Release Date Start"}
                                placeholder={"dd-mm-yyyy"}
                                InputLabelProps={{shrink: true}}
                                onChange={handleChangeOnReleaseDateStart}
                            />
                        </FormControl>
                        <br/>
                        <FormControl className={classes.formControl}>
                            <TextField
                                type={"date"}
                                id={"release-date-end"}
                                label={"Release Date End"}
                                placeholder={"dd-mm-yyyy"}
                                InputLabelProps={{shrink: true}}
                                onChange={handleChangeOnReleaseDateEnd}
                            />
                        </FormControl>
                        <br/>
                        <br/>
                        <FormControl className={classes.formControl}>
                            <Button className={classes.formButton} variant={"contained"} color={"primary"}
                                    onClick={applyFilters}>Apply</Button>
                        </FormControl>
                    </CardContent>
                </Card>
            </div>
        </Fragment>

    );
}

ReleasedMovies.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReleasedMovies);