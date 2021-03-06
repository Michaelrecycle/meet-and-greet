import React, { Component } from "react";

import Button from "../UI/Button/Button";
import classes from "./ReadyCheckPrompt.module.css";

import { Redirect, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
class ReadyCheckPrompt extends Component {
  // If the student accepts the queue, he will be redirected to the video chat room with the recruiter
  onAcceptHandler = () => {
    this.props.history.push("/chat-room");
  };

  // If the student declines the queue he will be ejected from the queue and close the pop up
  onDeclineHandler = () => {
    this.props.onDeclineHandler();
    this.props.dequeueFromComapany(this.props.companyId, this.props.index);
  };

  render() {
    return (
      <div className={classes.PromptContainer}>
        <img
          className={classes.Logo}
          src={this.props.logo}
          alt="Company logo"
        />
        <div className={classes.ContentContainer}>
          <span>The company is ready for you!</span>
          <span>Timer</span>
          <span>Ready?</span>
        </div>
        <div className={classes.ButtonContainer}>
          <Button
            onClick={this.props.onClick}
            clicked={this.onAcceptHandler}
            btnType="Accept"
          >
            Accept
          </Button>
          <Button clicked={this.onDeclineHandler} btnType="Decline">
            Decline
          </Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dequeueFromComapany: (companyId, index) =>
      dispatch(actions.dequeueStudent(companyId, index)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ReadyCheckPrompt));
