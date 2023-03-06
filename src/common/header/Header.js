import React, {Fragment, useEffect, useState} from "react";
import './Header.css';
import {Tab, Tabs} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Modal from 'react-modal';
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Login from "../../screens/login/Login";
import Register from "../../screens/register/Register";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography>{children}</Typography>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const Header = function () {
    const [status, setStatus] = useState(true);
    const [bookShowStatus, setBookShowStatus] = useState(false);
    const [movieId, setMovieId] = useState("");
    const [launchForm, setLaunchForm] = useState(false);
    const [formType, setFormType] = useState("login");

    function setUserStatus() {
        try {
            const accessToken = window.sessionStorage.getItem('access-token');
            setStatus(accessToken === '' || accessToken === null);
        } catch (e) {
            setStatus(true);
        }
    }

    useEffect(() => {
        const currentUrl = document.URL;
        setBookShowStatus(currentUrl.indexOf("/movie/") !== -1);
        setLaunchForm(false);
        setUserStatus();
        if (document.URL.indexOf("/movie/") !== -1) {
            setMovieId(currentUrl.substring(currentUrl.lastIndexOf('/') + 1));
        }

    }, [])

    const onOpenModal = () => {
        setLaunchForm(true);
    }

    const onCloseModal = () => {
        setLaunchForm(false)
    }

    const handleLogout = async () => {
        try {
            const accessToken = window.sessionStorage.getItem('access-token');
            const rawResponse = await fetch("http://localhost:8085/api/v1/auth/logout",
                {
                    method: 'POST',
                    headers: {
                        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
                        "Access-Control-Allow-Headers": "Accept",
                        "Accept": 'application/json',
                        "Content-Type": "application/json;charset=UTF-8",
                        "Access-Control-Allow-Origin": "*",
                        "authorization": "Bearer " + accessToken
                    },
                });
            const response = rawResponse.json();
            if (rawResponse.ok) {
                window.sessionStorage.removeItem("user-details")
                window.sessionStorage.removeItem("access-token")
            } else {
                const error = new Error();
                error.message = response.message || 'Something went wrong.';
                throw error;
            }
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    }

    const handleFormChange = (event, newValue) => {
        setFormType(newValue);
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    return (
        <Fragment>
            <div id={'header'}>
                <img src={"../../assets/logo.svg"} id={'header-logo'} alt={"logo"}/>
                {
                    status ?
                        <Button variant={"contained"} className={"login-logout-button"} color={"default"}
                                onClick={onOpenModal}>Login</Button> :
                        <Button variant={"contained"} className={"login-logout-button"} color={"default"}
                                onClick={handleLogout}>Logout</Button>
                }
                {
                    bookShowStatus ?
                        <Button variant={"contained"} className={"book-show-button"} color={"primary"}
                                href={"/bookshow/" + movieId}>Book Show</Button>
                        : <span></span>
                }

                <Modal
                    size={"lg"}
                    isOpen={launchForm}
                    onRequestClose={onCloseModal}
                    style={customStyles}
                >
                    <Tabs className={"formTabs"} value={formType} onChange={handleFormChange}>
                        <Tab
                            value="login"
                            label="Login"
                            wrapped
                        />
                        <Tab
                            value="register"
                            label="Register"
                        />
                    </Tabs>
                    <div hidden={formType !== "login"}>
                        <Login/>
                    </div>
                    <div hidden={formType !== "register"}>
                        <Register/>
                    </div>

                </Modal>
            </div>
        </Fragment>
    );
};

export default Header;