//@ts-check
import React, { Component } from "react";
import { Provider } from "./context";

export default class ContextProvider extends Component {
  state = {
    varIniciales: [],
    extras: [],

    guardarContext: (nombre, value, fn) =>
      this.setState(state => ({
        [nombre]: value !== undefined ? value : fn(state[nombre])
      })),
    save: (nombre, value) => this.setState({ [nombre]: value })
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}
