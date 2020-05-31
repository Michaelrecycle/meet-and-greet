import React, { Component } from "react";

import Button from "../UI/Button/Button";
import classes from "./ReadyCheckPrompt.module.css";

import { Redirect} from "react-router-dom";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
class ReadyCheckPrompt extends Component {
  // If the student accepts the queue, he will be redirected to the video chat room with the recruiter
  onAcceptHandler = () => {
    document.title = "Dashboard";

    this.props.studentJoinChatroom(this.props.companyId);
    // this.this.props.history.push("/chat-room");
  };

  // If the student declines the queue he will be ejected from the queue and close the pop up
  onDeclineHandler = () => {
    document.title = "Dashboard";
    this.props.onDeclineHandler();
    this.props.dequeueFromComapany(this.props.companyId, this.props.index);
  };

  render() {
    let redirect = null;
    if (this.props.credentials !== null) {
      redirect = <Redirect to="/chat-room" />;
    }
    return (
      <div className={classes.PromptContainer}>
        {redirect}
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

const mapStateToProps = (state) => {
  return {
    credentials: state.student.credentials,
    error: state.student.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dequeueFromComapany: (companyId, index) =>
      dispatch(actions.dequeueStudent(companyId, index)),
    studentJoinChatroom: (companyId) => {
      dispatch(actions.studentJoinChatroom(companyId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReadyCheckPrompt);
