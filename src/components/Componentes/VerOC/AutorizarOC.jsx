//@ts-check
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Axios from 'axios';
import { LAMBDAS } from '../../../utils/utils';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';

export default class AutorizarOC extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    auth: PropTypes.bool.isRequired
  };

  static defaultProps = {
    id: '',
    auth: true
  };

  state = {
    autorizando: false
  };

  autorizar = async () => {
    const id = this.props.id;
    if (!id) return;
    try {
      this.setState({
        autorizando: true
      });
      const { data } = await Axios.post(LAMBDAS.autorizarOC, { id });
      this.setState({
        autorizando: false
      });
      navigate('/ordenes-de-compra');
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const isAutorized = this.props.auth;
    if (!isAutorized)
      return (
        <Button
          loading={this.state.autorizando}
          size="massive"
          onClick={this.autorizar}
          color="green"
        >
          Autorizar OC
        </Button>
      );
    else
      return (
        <Button color="grey" size="massive" disabled>
          Autorizada
        </Button>
      );
  }
}
