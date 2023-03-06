import React, {Fragment, useState} from "react";
import Button from "@material-ui/core/Button";
import './Login.css'
import {TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";


const styles = () => ({
    formControl: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        align: 'center',
        space: 1,
        minWidth: 240,
        maxWidth: 240,
        padding: '8px',
        alignItems: 'center'
    },
    loginButton: {
        'text-transform': 'uppercase'
    }
});

const Login = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const handleLoginService = async () => {
        setIsUsernameEmpty(username === "");
        setIsPasswordEmpty(password === "");
        if (username === "" || password === "") {
            console.log("username / password cannot be empty");
        } else {
            try {
                const rawResponse = await fetch("http://localhost:8085/api/v1/auth/login",
                    {
                        method: 'POST',
                        headers: {
                            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
                            "Access-Control-Allow-Headers": "Accept",
                            "Accept": 'application/json',
                            "Content-Type": "application/json;charset=UTF-8",
                            "Access-Control-Allow-Origin": "*",
                            "authorization": "Basic " + window.btoa(`${username}:${password}`)
                        },
                    });
                const response = rawResponse.json();
                console.log(response);
                if (rawResponse.ok) {
                    window.sessionStorage.setItem("user-details", JSON.stringify(response));
                    window.sessionStorage.setItem("access-token", rawResponse.headers.get('access-token'));
                } else {
                    const error = new Error();
                    error.message = response.message || 'Something went wrong.';
                    throw error;
                }
            } catch (e) {
                alert(`Error: ${e.message}`);
            }
        }
    }
    const handleUsername = (event) => {
        setUsername(event.target.text);
    }

    const handlePassword = (event) => {
        setPassword(event.target.text);
    }

    const {classes} = props;

    return (
        <Fragment>
            <FormControl variant={"standard"} className={classes.formControl}>
                <TextField
                    id="username"
                    label="Username"
                    type="username"
                    name="username"
                    required={true}
                    error={isUsernameEmpty}
                    helperText={isUsernameEmpty ? "required" : ""}
                    onChange={handleUsername}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    required={true}
                    error={isPasswordEmpty}
                    helperText={isPasswordEmpty ? "required" : ""}
                    onChange={handlePassword}
                />
                <br/>
                <Button
                    className={classes.loginButton}
                    variant={"contained"}
                    color={"primary"}
                    type={"submit"}
                    onSubmit={handleLoginService}
                    onClick={handleLoginService}
                >Login</Button>
            </FormControl>
        </Fragment>
    );
};


Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);