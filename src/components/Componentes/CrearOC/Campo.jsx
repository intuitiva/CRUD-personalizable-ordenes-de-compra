//@ts-check
import React, { Component, Fragment } from "react";
import { Input } from "semantic-ui-react";
import PropTypes from "prop-types";

export default class Campo extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string
  };

  static defaultProps = {
    value: "",
    onChange: () => {},
    name: "",
    placeholder: "",
    label: "",
    type: "text"
  };

  state = {};

  render() {
    const { value, onChange, name, placeholder, label, type } = this.props;
    const props = { value, onChange, name, placeholder, type };
    return (
      <Fragment>
        <label>{label}</label>
        <Input {...props} />
      </Fragment>
    );
  }
}
