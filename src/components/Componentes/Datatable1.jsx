/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { arrayOf, object } from 'prop-types';
import Axios from 'axios';
import { headers, LAMBDAS } from '../../utils/utils';
import { navigate } from 'gatsby';

//@ts-ignore
const matchTitle = (variables, title) => {
  const match = variables.find(vvar => vvar.id === title);

  return match
    ? match['wNombre'] !== undefined
      ? match['wNombre']
      : title
    : title;
};

const isHidden = (variables, title) => {
  const match = variables.find(vvar => vvar.id === title);
  return match ? (match['wEsconder'] === true ? true : false) : false;
};

const columnsValidation = variables => {
  let columnsDefault = [
    { id: 'zid', data: 'z' },
    { id: 'id_number', data: 'i' },
    { id: 'reference', data: 'ref' },
    { id: 'issue_date', data: 'dte' },
    { id: 'origin', data: 'o' },
    { id: 'payee_id', data: 'ven' },
    { id: 'charge_term_id', data: 'ct' },
    { id: 'Lineas', data: 'itms' },
    { id: 'total', data: 'tot' },
    { id: 'due', data: 'due' }
  ];
  const ret = [];
  columnsDefault.forEach(column => {
    if (!isHidden(variables, column.id)) {
      ret.push({ title: matchTitle(variables, column.id), data: column.data });
    }
  });
  return ret;
};

export default class Datatable1 extends Component {
  static propTypes = {
    variables: arrayOf(object)
  };

  static defaultProps = {
    variables: []
  };

  $ = {};

  componentWillMount() {
    this.call();
  }

  call = async () => {
    const url = LAMBDAS.datatable;
    const { data } = await Axios.get(url, { headers: headers });
  };

  extractText = value => {
    var a = value.toString().split('">');
    if (a.length > 1) {
      return a[1].toString().split('<')[0];
    }
    return a[0];
  };

  componentDidMount() {
    this.$ = require('jquery');
    this.$.DataTable = require('datatables.net');

    this.$(this.refs.main).DataTable({
      dom: '<"H"ifr>t<"F"p>',
      pagingType: 'full_numbers',
      lengthChange: false,
      pageLength: 40,
      autoWidth: false,
      jQueryUI: true,
      order: [[3, 'desc']],
      columnDefs: [
        { orderable: false, targets: [] },
        {
          targets: 0,
          createdCell: (td, cellData, rowData, row, col) => {
            if (cellData) {
              const ocid = cellData
                .split('/purchases/purchase_orders/')[1]
                .split('"')[0];
              const idcorto = this.extractText(cellData);

              return ReactDOM.render(
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.sessionStorage.setItem('ocid', ocid);
                    window.sessionStorage.setItem('idcorto', idcorto);
                    navigate(`/ver-orden-compra`);
                  }}
                >
                  {idcorto}
                </a>,
                td
              );
            }
          }
        },
        {
          targets: 4,
          createdCell: (td, cellData, rowData, row, col) => {
            if (cellData) {
              const content = this.extractText(cellData);
              return ReactDOM.render(<span>{content}</span>, td);
            }
          }
        },
        {
          targets: 1,
          createdCell: (td, cellData, rowData, row, col) => {
            if (cellData) {
              function decodeHtml(html) {
                var txt = document.createElement('textarea');
                txt.innerHTML = html;
                return txt.value;
              }
              const content = this.extractText(cellData);
              return ReactDOM.render(<span>{decodeHtml(content)}</span>, td);
            }
          }
        },
        {
          targets: 3,
          createdCell: (td, cellData, rowData, row, col) => {
            if (cellData) {
              function decodeHtml(html) {
                var txt = document.createElement('textarea');
                txt.innerHTML = html;
                return txt.value;
              }
              const content = this.extractText(cellData);
              return ReactDOM.render(<span>{decodeHtml(content)}</span>, td);
            }
          }
        },
        {
          targets: 5,
          createdCell: (td, cellData, rowData, row, col) => {
            if (cellData) {
              function decodeHtml(html) {
                var txt = document.createElement('textarea');
                txt.innerHTML = html;
                return txt.value;
              }
              const content = this.extractText(cellData);
              return ReactDOM.render(<span>{decodeHtml(content)}</span>, td);
            }
          }
        },
        {
          targets: 2,
          createdCell: (td, cellData, rowData, row, col) => {
            if (cellData) {
              const value = this.extractText(cellData);
              return ReactDOM.render(<span>{value}</span>, td);
            }
          }
        }
      ],
      language: {
        paginate: {
          first: 'Primera',
          last: 'Ultima',
          next: 'Siguiente',
          previous: 'Anterior'
        },
        aria: {
          sortAscending: ' - haga click para ordenar ascendentemente',
          sortDescending: ' - haga click para ordenar descendentemente'
        },
        emptyTable: 'No hay datos',
        info: 'Mostrando desde _START_ hasta _END_ de _TOTAL_ registros',
        infoEmpty: 'No hay registros',
        infoFiltered: ' - filtrados sobre _MAX_',
        loadingRecords: 'Cargando...',
        processing: 'Procesando...',
        search: 'Filtrar:',
        zeroRecords: 'No se encontraron registros'
      },
      processing: true,
      serverSide: true,
      ajax: {
        url: LAMBDAS.datatable,
        type: 'GET'
      },
      columns: columnsValidation(this.props.variables)
    });
  }

  render() {
    return (
      <div id="luispa">
        <table class="stripe" ref="main" />
      </div>
    );
  }
}