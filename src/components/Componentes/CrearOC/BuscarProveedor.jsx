// import _ from 'lodash'
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import Axios from 'axios';
import { LAMBDAS } from '../../../utils/utils';

export default class BuscarProveedor extends Component {
  state = {
    value: '',
    isLoading: false,
    proveedor: '',
    results: []
  };

  treatResults = results => {
    function decodeHtml(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }
    return results.map(result => ({
      title: decodeHtml(result)
    }));
  };

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title }, () =>
      this.props.guardarProveedor(result.title)
    );
  };

  buscar = async termino => {
    try {
      this.setState({ isLoading: true, results: [] });
      // @ts-ignore
      const { data: proveedores } = await Axios.post(LAMBDAS.buscarProveedor, {
        text: termino
      });
      this.setState({
        isLoading: false,
        results: this.treatResults(proveedores)
      });
    } catch (error) {}
  };

  buscarCuandoSeDetenga = debounce(() => {
    if (this.state.value === '') {
      return;
    }
    this.buscar(this.state.value);
  }, 300);

  changeProveedor = (e, { value }) => {
    this.setState({ value: value }, () => {
      if (value === '') {
        this.setState({
          results: []
        });
      } else {
        this.buscarCuandoSeDetenga();
      }
    });
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        noResultsMessage="Sin resultados"
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.changeProveedor}
        results={results}
        value={value}
      />
    );
  }
}
