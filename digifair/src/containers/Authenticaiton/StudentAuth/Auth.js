import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../../store/actions/index";

import classes from "./StudentAuth.module.css";
import digifairLogo from "../../../assets/company_logos/digifair-logo-inverse.png";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import SwitchButton from "../../../components/UI/SwitchButton/SwitchButton";
import Spinner from "../../../components/UI/Spinner/Spinner";
class StudentAuth extends Component {
  // REFRACTOR SO THAT OTHER COMPONENTS CAN REUSE!

  state = {
    // The state here contains the required information to produce input fields and store their values

    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false, // Refers to if the user began typing
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    invalidForm: false,
    isStudent: true,
  };

  componentDidMount() {
    // Redirect the user to the root if he has authenticated
    if (this.props.authRedirectPath !== "/") {
      let path = this.props.isStudent ? "/" : "/chat-room";
      this.props.onSetAuthRedirectPath(path);
    }

    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.submitHandler(e); // Submit on pressing enter
      }
    });
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,

      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      },
    };
    this.setState({ controls: updatedControls });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    // Better ux to let them finish typing and only show on submit
    // if (rules.isEmail) {
    //   console.log("here")
    //   const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    //   isValid = pattern.test(value) && isValid;
    // }

    return isValid;
  }

  submitHandler = (event) => {
    event.preventDefault();

    if (this.state.controls.email.value === "") {
      this.setState({
        invalidForm: true,
      });
    } else {
      this.setState({
        invalidForm: false,
      });

      // Dispatch auth action
      this.props.onAuth(
        this.state.controls.email.value,
        this.state.controls.password.value,
        this.state.isStudent
      );
    }
  };
  userTypeSwitch = () => {
    this.setState((prevState) => ({
      isStudent: !prevState.isStudent,
    }));
  };
  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        shouldValidate={formElement.config.validation}
        invalid={!formElement.config.valid}
        touched={formElement.config.touched}
      />
    ));

    let authed = null;

    // console.log(this.props.token == null);
    if (this.props.authenticated) {
      authed = <Redirect to={this.props.authRedirectPath} />;
    }

    let errorMessage = null;
    // if (this.props.error) {
    //   errorMessage = this.props.error.message;
    // }
    if (this.state.invalidForm) {
      errorMessage = "Please enter your email and password";
    }

    if (this.props.error) {
      errorMessage = this.props.error.message;
    }

    return (
      <div className={classes.AuthContainer}>
        {
          authed /*This causes authenticated users to be redirected to the root */
        }
        <div className={classes.FormContainer}>
          <img
            className={classes.Logo}
            src={digifairLogo}
            alt="Digifair Black and White Logo"
          />

          <form
            className={classes.Form}
            onSubmit={(event) => this.submitHandler(event)}
          >
            <h2 className={classes.FormTitle}>Sign in</h2>

            {/* Toggle company and studet */}
            <SwitchButton
              switchUser={this.userTypeSwitch}
              isStudent={this.state.isStudent}
            />
            <span className={classes.ErrorMessage}>{errorMessage}</span>

            {form}
          </form>
          {this.props.loading ? (
            <Spinner />
          ) : (
            <Button
              clicked={(event) => this.submitHandler(event)}
              btnType="Accept"
            >
              Sign in
            </Button>
          )}
        </div>
        <div className={classes.BackgroundIllustration}></div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    authenticated: state.user.token != null,
    authRedirectPath: state.user.authRedirectPath,
    isStudent: state.user.isStudent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isStudent) =>
      dispatch(actions.auth(email, password, isStudent)),
    // onRecruiterAuth: (email, password) =>
    //   dispatch(actions.recruiterAuth(email, password)),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentAuth);
