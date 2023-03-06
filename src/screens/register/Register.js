import React, {Fragment, useState} from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import {TextField} from "@material-ui/core";

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
        alignItems: 'center',
    },
    registerButton: {
        'text-transform': 'uppercase'
    }
});

const Register = (props) => {
    const required = "required";
    const {classes} = props;
    const [formDate, setFormData] = useState({
        email_address: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        password: ""
    });
    const [register, setRegister] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
    const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);
    const [isContactEmpty, setIsContactEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);


    const handleRegisterService = async () => {
        setIsEmailEmpty(formDate.email_address === "");
        setIsFirstNameEmpty(formDate.first_name === "");
        setIsLastNameEmpty(formDate.last_name === "");
        setIsContactEmpty(formDate.mobile_number === "");
        setIsPasswordEmpty(formDate.password === "");
        if (formDate.email_address === "" || formDate.first_name === "" || formDate.last_name === "" || formDate.mobile_number === "" || formDate.password === "") {
            console.log("Form Data is empty");
        } else {
            try {
                console.log(JSON.stringify(formDate));
                const rawResponse = await fetch("http://localhost:8085/api/v1/signup",
                    {
                        body: JSON.stringify(formDate),
                        method: 'POST',
                        headers: {
                            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
                            "Access-Control-Allow-Headers": "Accept",
                            "Accept": 'application/json',
                            "Content-Type": "application/json;charset=UTF-8",
                            "Access-Control-Allow-Origin": "*",

                        },
                    });
                const response = rawResponse.json();
                console.log(response);
                if (rawResponse.ok) {
                    setRegister(true);
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

    const handleChange = (event) => {
        const state = formDate;
        state[event.target.name] = event.target.value;
        setFormData(state);
    }

    return (
        <Fragment>
            <FormControl variant={"standard"} className={classes.formControl}>
                <TextField
                    id="first_name"
                    label="FirstName"
                    type="text"
                    name="first_name"
                    required={true}
                    error={isFirstNameEmpty}
                    helperText={isFirstNameEmpty ? required : ""}
                    onChange={handleChange}
                />
                <TextField
                    id="last_name"
                    label="LastName"
                    type="text"
                    name="last_name"
                    required={true}
                    error={isLastNameEmpty}
                    helperText={isLastNameEmpty ? required : ""}
                    onChange={handleChange}
                />
                <TextField
                    id="email_address"
                    label="Email"
                    type="text"
                    name="email_address"
                    required={true}
                    error={isEmailEmpty}
                    helperText={isEmailEmpty ? required : ""}
                    onChange={handleChange}
                />
                <TextField
                    id="mobile_number"
                    label="Contact No."
                    type="text"
                    name="mobile_number"
                    required={true}
                    error={isContactEmpty}
                    helperText={isContactEmpty ? required : ""}
                    onChange={handleChange}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    required={true}
                    error={isPasswordEmpty}
                    helperText={isPasswordEmpty ? required : ""}
                    onChange={handleChange}
                />
                <br/>
                <Button
                    className={classes.registerButton}
                    variant={"contained"}
                    color={"primary"}
                    type={"submit"}
                    onSubmit={handleRegisterService}
                    onClick={handleRegisterService}
                >Register</Button>
                {
                    register ? <p>Registration Successful. Please Login!</p> : <b></b>
                }
            </FormControl>
        </Fragment>
    );
};

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);