//@ts-check
import React, { Component, Fragment } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { navigate } from 'gatsby';
import axios from 'axios';
import { LAMBDAS, headers, EDITAR } from '../../utils/utils';
import EncabezadoVerOC from '../Componentes/VerOC/Encabezado';
import { get } from 'propx';
import ProveedorOC from '../Componentes/VerOC/Proveedor';
import DetalleItems from '../Componentes/VerOC/DetalleItems';
import { Header } from 'semantic-ui-react';
import AutorizarOC from '../Componentes/VerOC/AutorizarOC';
import EditarOC from '../Componentes/VerOC/EditarOC';

export default class Pagina4 extends Component {
  state = {
    data: {},
    dataEncabezado: [],
    dataProveedor: [],
    dataMemo: [],
    dataItems: [],
    variables: [],
    dataFooter: [],
    loading: true,
    esconderItems: false,
    esconderPayee: false,
    isAuth: false,
    ocid: '',
    idcorto: ''
  };

  componentDidMount() {
    const ocid = window.sessionStorage.getItem('ocid');
    const idcorto = window.sessionStorage.getItem('idcorto');
    this.setState({
      ocid: ocid,
      idcorto: idcorto
    });
    let user = netlifyIdentity.currentUser();
    if (user === null) {
      navigate('/');
    } else {
      this.callApis(ocid);
    }
  }

  callVariables = async () => {
    try {
      await this.setState({ loading: true });
      //@ts-ignore
      const { data: data1 } = await axios.get(LAMBDAS.get1);
      //@ts-ignore
      const { data: data2 } = await axios.get(LAMBDAS.get2);
      const varIniciales = [];

      function match(array, nombre, postfix) {
        return array.find(item => item.name === `${nombre}${postfix}`);
      }

      for (var [nombre, propiedades] of Object.entries(data1)) {
        const objectNeedsEdit = {
          edit: {
            [`${nombre}_new_name_webapp`]: match(
              data2,
              nombre,
              '_new_name_webapp'
            ),
            [`${nombre}_required_webapp`]: match(
              data2,
              nombre,
              '_required_webapp'
            ),
            [`${nombre}_default_webapp`]: match(
              data2,
              nombre,
              '_default_webapp'
            ),
            [`${nombre}_hidden_webapp`]: match(data2, nombre, '_hidden_webapp')
          },
          editValues: {
            new_name_webapp: get(
              match(data2, nombre, '_new_name_webapp'),
              'value',
              undefined
            ),
            required_webapp: get(
              match(data2, nombre, '_required_webapp'),
              'value',
              undefined
            ),
            default_webapp: get(
              match(data2, nombre, '_default_webapp'),
              'value',
              undefined
            ),
            hidden_webapp: get(
              match(data2, nombre, '_hidden_webapp'),
              'value',
              undefined
            )
          }
        };

        const someObj = {
          new_name_webapp: false,
          default_webapp: false,
          required_webapp: false,
          hidden_webapp: false
        };

        const needsEdit = {
          new_name_webapp: false,
          default_webapp: false,
          required_webapp: false,
          hidden_webapp: false
        };

        const needsCreation = {
          new_name_webapp: false,
          default_webapp: false,
          required_webapp: false,
          hidden_webapp: false
        };

        const action = {
          new_name_webapp: undefined,
          default_webapp: undefined,
          required_webapp: undefined,
          hidden_webapp: undefined
        };

        // Objeto a guardar si es EDIT
        const push = {
          id: nombre,
          campoZauru: nombre,
          wNombre: objectNeedsEdit.editValues.new_name_webapp,
          wObligatorio: objectNeedsEdit.editValues.required_webapp === 'true',
          wPredefinido: objectNeedsEdit.editValues.default_webapp,
          wEsconder: objectNeedsEdit.editValues.hidden_webapp === 'true',
          ...propiedades,
          ...objectNeedsEdit,
          modificado: false,
          some: someObj,
          needsEdit: needsEdit,
          needsCreation: needsCreation,
          action: action
        };

        // Agrega el objeto necesario, si es EDIT o CREATE
        varIniciales.push(push);
      }
      return varIniciales;
    } catch (error) {
      console.error({ error });
      return [];
    } finally {
      // await this.setState({ loading: false });
    }
  };

  crearEncabezado = (data, variables) => {
    function getVariable(variable, def) {
      const match = variables.find(vari => vari.id === variable);
      return match ? (match.wNombre ? match.wNombre : def) : def;
    }

    function getValue(variable, def) {
      const match = variables.find(vari => vari.id === variable);
      return match ? (match.wPredefinido ? match.wPredefinido : def) : def;
    }

    function hideValue(variable, def) {
      const match = variables.find(vari => vari.id === variable);
      return match ? (match.wEsconder ? undefined : def) : def;
    }

    return [
      hideValue('zid', {
        title: getVariable('zid', 'ID'),
        variable: 'zid',
        value: getValue('zid', get(data, 'zid', ''))
      }),
      hideValue('id_number', {
        title: getVariable('id_number', 'Código'),
        variable: 'id_number',
        value: getValue('id_number', get(data, 'id_number', ''))
      }),
      hideValue('import', {
        title: getVariable('import', 'Importar'),
        variable: 'import',
        value: getValue('import', get(data, 'import', ''))
      }),
      hideValue('taxable', {
        title: getVariable('taxable', 'Sujeto a Impuestos'),
        variable: 'taxable',
        value: getValue('taxable', get(data, 'taxable', ''))
      }),
      hideValue('reference', {
        title: getVariable('reference', 'Referencia'),
        variable: 'reference',
        value: getValue('reference', get(data, 'reference', ''))
      }),
      hideValue('invoice', {
        title: getVariable('invoice', 'Factura'),
        variable: 'invoice',
        value: getValue('invoice', get(data, 'invoice', ''))
      }),
      hideValue('issue_date', {
        title: getVariable('issue_date', 'Fecha de Emisión'),
        variable: 'issue_date',
        value: getValue('issue_date', get(data, 'issue_date', ''))
      }),
      hideValue('shipping_date', {
        title: getVariable('shipping_date', 'Fecha de Despacho'),
        variable: 'shipping_date',
        value: getValue('shipping_date', get(data, 'shipping_date', ''))
      }),
      hideValue('exchange_rate', {
        title: getVariable('exchange_rate', 'Tipo de Cambio'),
        variable: 'exchange_rate',
        value: getValue('exchange_rate', get(data, 'exchange_rate', ''))
      }),
      hideValue('charge_term_id', {
        title: getVariable('charge_term_id', 'Termino de Pago'),
        variable: 'charge_term_id',
        value: getValue('charge_term_id', get(data, 'charge_term_id.name', ''))
      }),
      hideValue('origin', {
        title: getVariable('origin', 'Origen de Mercadería'),
        variable: 'origin',
        value: getValue('origin', get(data, 'origin', ''))
      }),
      hideValue('agency_id', {
        title: getVariable('agency_id', 'Bodega destino'),
        variable: 'agency_id',
        value: getValue('agency_id', get(data, 'agency_id.name', ''))
      }),
      hideValue('memo', {
        title: getVariable('memo', 'Memo'),
        variable: 'memo',
        value: getValue('memo', get(data, 'memo', ''))
      })
    ].filter(n => n);
  };

  crearProveedor = data => {
    return [
      {
        title: 'Beneficiario #',
        value: get(data, 'payee.id_number', '')
      },
      {
        title: 'Referencia',
        value: get(data, 'payee.reference', '')
      },
      {
        title: 'Nombre',
        value: get(data, 'payee.name', '')
      },
      {
        title: 'NIT',
        value: get(data, 'payee.tin', '')
      },
      {
        title: 'Teléfono',
        value: get(data, 'payee.phone', '')
      }
    ];
  };

  crearItems = ({ items_grouped }) => {
    let items = [];
    for (var type in items_grouped) {
      const typex = type;
      const values = items_grouped[type].map(item => ({
        type: typex,
        name: item[0],
        id: item[1]
      }));
      items = [...items, ...values];
    }
    return items;
  };

  crearFooter = data => {
    const footer = {
      tax1: data.tax1 || 0,
      tax2: data.tax2 || 0,
      shipping: data.shipping || 0,
      other_charges: data.other_charges || 0,
      discount: data.discount || 0
    };
    return footer;
  };

  crearItemsTabla = items => {
    const { purchase_order_details } = items;
    if (!purchase_order_details) return [];

    return purchase_order_details.map((item, i) => ({
      key: i.toString(),
      item: get(item, 'item.name', ''),
      referencia: get(item, 'reference', ''),
      costoUnitario: get(item, 'unit_cost', ''),
      reservados: get(item, 'booked_quantity', ''),
      costo: get(item, 'cost', '')
    }));
  };

  validateIsAuth = data => {
    return get(data, 'authorized', true);
  };

  callApis = async ocid => {
    try {
      // this.setState({
      //   loading: true
      // })
      const { data } = await axios.post(
        LAMBDAS.verOC,
        { id: ocid },
        { headers }
      );
      const variables = await this.callVariables();
      const esconderPayee = get(
        variables.find(item => item.id === 'payee_id'),
        'wEsconder',
        false
      );

      const esconderItems = get(
        variables.find(item => item.id === 'purchase_order_details_attributes'),
        'wEsconder',
        false
      );
      const dataEncabezado = this.crearEncabezado(data, variables);
      const dataProveedor = this.crearProveedor(data);
      const dataItems = this.crearItemsTabla(data);
      const dataFooter = this.crearFooter(data);
      const isAuth = this.validateIsAuth(data);

      this.setState({
        data,
        dataEncabezado,
        dataProveedor,
        dataItems,
        variables,
        esconderPayee,
        esconderItems,
        dataFooter,
        loading: false,
        isAuth
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  render() {
    const {
      dataEncabezado,
      dataProveedor,
      dataItems,
      esconderPayee,
      loading,
      esconderItems,
      idcorto,
      dataFooter,
      isAuth,
      ocid
    } = this.state;
    return (
      <Fragment>
        {loading ? (
          <Header as="h2">Cargando...</Header>
        ) : (
          <Fragment>
            <h1>
              Ver detalle de Orden de Compra: <strong>{idcorto || ''}</strong>
            </h1>
            <EncabezadoVerOC data={dataEncabezado} />
            <ProveedorOC data={dataProveedor} esconder={esconderPayee} />
            <DetalleItems
              data={dataItems}
              esconder={esconderItems}
              footer={dataFooter}
            />
            <AutorizarOC auth={isAuth} id={ocid} />
            {EDITAR && <EditarOC auth={isAuth} id={ocid} />}
          </Fragment>
        )}
        <br />
        <br />
        <br />
      </Fragment>
    );
  }
}
