//@ts-check
import React, { Component } from 'react';
import Campo from './Campo';
import { Form, Checkbox, Button, Divider, Dropdown } from 'semantic-ui-react';
import Axios from 'axios';
import { LAMBDAS, headers } from '../../../utils/utils';
import { get } from 'propx';
import JSON from 'circular-json';
import { navigate } from 'gatsby';
import BuscarProveedor from './BuscarProveedor';
export default class Formulario extends Component {
  state = {
    loading: false,
    proveedor: ''
  };
  componentDidCatch() {
    console.log('');
  }

  formatDate = date => {
    const arr = date.split('-');
    return `${arr[0]}-${arr[1]}-${arr[2]}`;
  };

  crearPayload = ({
    fechaDeEmision,
    fechaDeDespacho,
    comprador,
    moneda,
    bodega,
    sujetoAImpuestos,
    proveedor,
    terminoDePago,
    referencia,
    items
  }) => {
    const { variables } = this.props;
    const variablesParsed = this.parseVar(variables);
    const payee = proveedor
      ? {
          payee_info: proveedor
        }
      : get(variablesParsed, 'payee_id.default_webapp', undefined)
      ? {
          payee_id: get(variablesParsed, 'payee_id.default_webapp')
        }
      : {
          payee_info: '',
          payee_id: ''
        };

    const payload = {
      purchase_order: {
        reference:
          get(variablesParsed, 'reference.default_webapp', undefined) ||
          referencia
            ? referencia.toString()
            : '',
        issue_date:
          get(variablesParsed, 'issue_date.default_webapp', undefined) ||
          fechaDeEmision
            ? fechaDeEmision.toString()
            : '',
        shipping_date:
          get(variablesParsed, 'shipping_date.default_webapp', undefined) ||
          fechaDeDespacho
            ? fechaDeDespacho.toString()
            : '',
        purchaser_id:
          get(variablesParsed, 'purchaser_id.default_webapp', undefined) ||
          comprador
            ? comprador.toString()
            : '',
        currency_id:
          get(variablesParsed, 'currency_id.default_webapp', undefined) ||
          moneda
            ? moneda.toString()
            : '',
        agency_id:
          get(variablesParsed, 'agency_id.default_webapp', undefined) || bodega
            ? bodega.toString()
            : '',
        taxable:
          get(variablesParsed, 'taxable.default_webapp', undefined) ||
          sujetoAImpuestos
            ? '1'
            : '0',
        // payee_id:
        //   get(variablesParsed, "payee_id.default_webapp", undefined) ||
        //   proveedor
        //     ? proveedor.toString()
        //     : "",
        charge_term_id:
          get(variablesParsed, 'charge_term_id.default_webapp', undefined) ||
          terminoDePago
            ? terminoDePago.toString()
            : '',
        purchase_order_details_attributes: {
          ...items
        },
        ...payee
      }
    };
    return payload;
  };

  handleSubmit = async () => {
    try {
      this.setState({
        loading: true
      });

      const items = get(
        this.props.variables.find(
          vari => vari.id === 'purchase_order_details_attributes'
        ),
        'wPredefinido',
        null
      );

      // @ts-ignore
      const payload = this.crearPayload({
        ...this.props,
        items: JSON.parse(items),
        proveedor: this.state.proveedor
      });
      const { data } = await Axios.post(LAMBDAS.crearOrdenDeCompra, payload, {
        headers
      });
      navigate('/ordenes-de-compra');
    } catch (error) {
      console.error(error.message || 'Error!');
    }
  };

  willBlock = ({
    variablesParsed,
    valores: {
      bodega,
      comprador,
      factura,
      fechaDeDespacho,
      fechaDeEmision,
      importar,
      moneda,
      origenDeLaMercaderia,
      referencia,
      sujetoAImpuestos,
      terminoDePago
    }
  }) => {
    const vars = [
      // Text
      { name: 'agency_id', valor: bodega },
      { name: 'charge_term_id', valor: terminoDePago },
      { name: 'currency_id', valor: moneda },
      { name: 'invoice', valor: factura },
      { name: 'issue_date', valor: fechaDeEmision },
      { name: 'origin', valor: origenDeLaMercaderia },
      { name: 'payee_id', valor: this.state.proveedor },
      { name: 'purchaser_id', valor: comprador },
      { name: 'reference', valor: referencia },
      { name: 'shipping_date', valor: fechaDeDespacho },
      // Booleans
      { name: 'taxable', valor: sujetoAImpuestos },
      { name: 'import', valor: importar }
    ];
    // Validar si traen required_webapp
    // Validar si trae default_webapp
    let req = vars.map(variable => {
      const required =
        get(variablesParsed, [variable.name, 'required_webapp']) === 'true';
      const def = get(variablesParsed, [variable.name, 'default_webapp']);
      const hide = get(variablesParsed, [variable.name, 'hidden_webapp']);

      const block1 = !!!def && required && !!!variable.valor && hide !== 'true';
      const block2 =
        !!!def && !required && !!!variable.valor && hide !== 'true';
      const block = block1 || block2;
      return {
        ...variable,
        required: required,
        default: def,
        block
      };
    });

    return req.some(re => re.block);
  };

  getValuesFromVars = obj => {
    return get(obj, 'editValues');
  };

  parseVar = vars => {
    return {
      agency_id: this.getValuesFromVars(
        vars.find(variable => variable.id === 'agency_id')
      ),
      charge_term_id: this.getValuesFromVars(
        vars.find(variable => variable.id === 'charge_term_id')
      ),
      currency_id: this.getValuesFromVars(
        vars.find(variable => variable.id === 'currency_id')
      ),
      import: this.getValuesFromVars(
        vars.find(variable => variable.id === 'import')
      ),
      invoice: this.getValuesFromVars(
        vars.find(variable => variable.id === 'invoice')
      ),
      issue_date: this.getValuesFromVars(
        vars.find(variable => variable.id === 'issue_date')
      ),
      origin: this.getValuesFromVars(
        vars.find(variable => variable.id === 'origin')
      ),
      payee_id: this.getValuesFromVars(
        vars.find(variable => variable.id === 'payee_id')
      ),
      purchaser_id: this.getValuesFromVars(
        vars.find(variable => variable.id === 'purchaser_id')
      ),
      reference: this.getValuesFromVars(
        vars.find(variable => variable.id === 'reference')
      ),
      shipping_date: this.getValuesFromVars(
        vars.find(variable => variable.id === 'shipping_date')
      ),
      taxable: this.getValuesFromVars(
        vars.find(variable => variable.id === 'taxable')
      )
    };
  };

  guardarProveedor = proveedor => {
    this.setState({
      proveedor
    });
  };

  returnVisible = variables => {
    const vars = [
      { nombre: 'reference', text: 'Referencia' },
      { nombre: 'taxable', text: 'Sujeto a impuestos' },
      { nombre: 'invoice', text: 'Factura' },
      { nombre: 'issue_date', text: 'Fecha de Emisión' },
      { nombre: 'shipping_date', text: 'Fecha de Despacho' },
      { nombre: 'charge_term_id', text: 'Termino de Pago' },
      { nombre: 'payee_id', text: 'Proveedor' },
      { nombre: 'origin', text: 'Origen de la Mercaderia' },
      { nombre: 'agency_id', text: 'Bodega destino' },
      { nombre: 'purchaser_id', text: 'Bodega destino' },
      { nombre: 'currency_id', text: 'Moneda' },
      { nombre: 'import', text: 'Importar' }
    ];

    const ret = {};

    vars.forEach(v => {
      const nombre = v.nombre;
      const text = v.text;
      const name = get(variables, [nombre, 'new_name_webapp']);

      ret[nombre] = {
        hidden: get(variables, [nombre, 'hidden_webapp']) === 'true',
        name: name ? name : text,
        required: get(variables, [nombre, 'required_webapp']),
        default: get(variables, [nombre, 'default_webapp'])
      };
    });

    return ret;
  };

  render() {
    const {
      referencia,
      sujetoAImpuestos,
      factura,
      fechaDeEmision,
      fechaDeDespacho,
      terminoDePago,
      origenDeLaMercaderia,
      bodega,
      comprador,
      moneda,
      importar,

      terminosDePago,
      bodegas,
      compradores,
      monedas,
      variables,

      onChange,

      monedaOnChange,
      terminoDePagoChange,
      bodegasOnChange,
      compradorOnChange,

      checkOnChange
    } = this.props;
    const variablesParsed = this.parseVar(variables);
    const {
      reference,
      taxable,
      invoice,
      issue_date,
      shipping_date,
      charge_term_id,
      payee_id,
      origin,
      agency_id,
      purchaser_id,
      currency_id,
      import: importV
    } = this.returnVisible(variablesParsed);

    const block = this.willBlock({
      variablesParsed,
      valores: {
        bodega,
        comprador,
        factura,
        fechaDeDespacho,
        fechaDeEmision,
        importar,
        moneda,
        origenDeLaMercaderia,
        referencia,
        sujetoAImpuestos,
        terminoDePago
      }
    });
    return (
      <Form size="huge" onSubmit={this.handleSubmit}>
        {!reference.hidden && (
          <Form.Group>
            {/* reference */}
            <Form.Field>
              <Campo
                label={reference.name}
                name="referencia"
                onChange={onChange}
                placeholder={reference.name}
                value={referencia}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!taxable.hidden && (
          <Form.Group>
            {/* taxable */}
            <Form.Field>
              <Checkbox
                checked={sujetoAImpuestos}
                label={taxable.name}
                name="sujetoAImpuestos"
                toggle
                onChange={checkOnChange}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!invoice.hidden && (
          <Form.Group>
            {/* invoice */}
            <Form.Field>
              <Campo
                label={invoice.name}
                value={factura}
                onChange={onChange}
                name="factura"
                placeholder={invoice.name}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!issue_date.hidden && (
          <Form.Group>
            {/* issue_date */}
            <Form.Field required>
              <Campo
                label={issue_date.name}
                value={fechaDeEmision}
                name="fechaDeEmision"
                placeholder={issue_date.name}
                onChange={onChange}
                type="date"
              />
            </Form.Field>
          </Form.Group>
        )}

        {!shipping_date.hidden && (
          <Form.Group>
            {/* shipping_date */}
            <Form.Field required>
              <Campo
                label={shipping_date.name}
                value={fechaDeDespacho}
                name="fechaDeDespacho"
                placeholder={shipping_date.name}
                onChange={onChange}
                type="date"
              />
            </Form.Field>
          </Form.Group>
        )}

        {!charge_term_id.hidden && (
          <Form.Group>
            {/* charge_term_id */}
            <Form.Field required>
              <label>{charge_term_id.name}</label>
              <Dropdown
                onChange={terminoDePagoChange}
                options={terminosDePago}
                placeholder={charge_term_id.name}
                selection
                value={terminoDePago}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!payee_id.hidden && (
          <Form.Group>
            {/* payee_id */}
            <Form.Field required>
              <label>{payee_id.name}</label>
              <BuscarProveedor guardarProveedor={this.guardarProveedor} />
            </Form.Field>
          </Form.Group>
        )}

        {!origin.hidden && (
          <Form.Group>
            {/* origin */}
            <Form.Field>
              <Campo
                label={origin.name}
                value={origenDeLaMercaderia}
                name="origenDeLaMercaderia"
                placeholder={origin.name}
                onChange={onChange}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!agency_id.hidden && (
          <Form.Group>
            {/* agency_id */}
            <Form.Field required>
              <label>{agency_id.name}</label>
              <Dropdown
                onChange={bodegasOnChange}
                options={bodegas}
                placeholder={agency_id.name}
                selection
                value={bodega}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!purchaser_id.hidden && (
          <Form.Group>
            {/* purchaser_id */}
            <Form.Field>
              <label>{purchaser_id.name}</label>
              <Dropdown
                onChange={compradorOnChange}
                options={compradores}
                placeholder={purchaser_id.name}
                selection
                value={comprador}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!currency_id.hidden && (
          <Form.Group>
            {/* currency_id */}
            <Form.Field required>
              <label>{currency_id.name}</label>
              <Dropdown
                onChange={monedaOnChange}
                options={monedas}
                placeholder={currency_id.name}
                selection
                value={moneda}
              />
            </Form.Field>
          </Form.Group>
        )}

        {!importV.hidden && (
          <Form.Group>
            {/* import */}
            <Form.Field>
              <Checkbox
                checked={importar}
                label={importV.name}
                onChange={checkOnChange}
                name="importar"
                toggle
              />
            </Form.Field>
          </Form.Group>
        )}

        <Button
          type="submit"
          size="massive"
          disabled={block}
          loading={this.state.loading}
          primary
        >
          Crear OC
        </Button>
        <Divider hidden />
      </Form>
    );
  }
}
