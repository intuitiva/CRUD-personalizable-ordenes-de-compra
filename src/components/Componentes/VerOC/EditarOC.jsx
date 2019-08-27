//@ts-check
import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import Axios from "axios";
import { LAMBDAS } from "../../../utils/utils";
import { navigate } from "gatsby";
import PropTypes from "prop-types";

export default class EditarOC extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    auth: PropTypes.bool.isRequired
  };

  static defaultProps = {
    id: "",
    auth: true
  };

  state = {
    autorizando: false
  };

  editar = async () => {
    // const id = this.props.id;
    // if (!id) return;
    // try {
    //   this.setState({
    //     autorizando: true
    //   });
    //   const { data } = await Axios.post(LAMBDAS.autorizarOC, { id });
    //   console.log(data);
    //   this.setState({
    //     autorizando: false
    //   });
    navigate("/editar-orden");
    // } catch (error) {
    //   console.error(error);
    // }
  };

  render() {
    const id = this.props.id;
    return (
      <Button size="massive" onClick={this.editar} color="blue">
        Editar OC
      </Button>
    );
  }
}
