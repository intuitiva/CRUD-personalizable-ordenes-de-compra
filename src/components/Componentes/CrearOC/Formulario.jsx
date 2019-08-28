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
    let payee = {};
    if (proveedor) {
      payee.payee_info = proveedor.toString();
      payee.payee_id = '';
    } else {
      payee.payee_info = '';
      payee.payee_id = get(
        variablesParsed,
        'payee_id.default_webapp',
        ''
      ).toString();
    }
    // const payload = {
    //   purchase_order: {
    //     reference: referencia,
    //     issue_date: fechaDeEmision,
    //     shipping_date: fechaDeDespacho,
    //     purchaser_id: comprador,
    //     currency_id: moneda,
    //     agency_id: bodega,
    //     taxable: sujetoAImpuestos,
    //     charge_term_id: terminoDePago,
    //     purchase_order_details_attributes: {
    //       ...items
    //     },
    //     ...payee
    //   }
    // };

    const payload = {
      purchase_order: {
        reference: referencia
          ? referencia.toString()
          : get(variablesParsed, 'reference.default_webapp', ''),
        issue_date: fechaDeEmision
          ? fechaDeEmision.toString()
          : get(variablesParsed, 'issue_date.default_webapp', ''),
        shipping_date: fechaDeDespacho
          ? fechaDeDespacho.toString()
          : get(variablesParsed, 'shipping_date.default_webapp', ''),
        purchaser_id: comprador
          ? comprador.toString()
          : get(variablesParsed, 'purchaser_id.default_webapp', ''),
        currency_id: moneda
          ? moneda.toString()
          : get(variablesParsed, 'currency_id.default_webapp', ''),
        agency_id: bodega
          ? bodega.toString()
          : get(variablesParsed, 'agency_id.default_webapp', ''),
        taxable: sujetoAImpuestos ? '1' : '0',
        charge_term_id: terminoDePago
          ? terminoDePago.toString()
          : get(variablesParsed, 'charge_term_id.default_webapp', ''),
        purchase_order_details_attributes: {
          ...items
        },
        ...payee
      }
    };
    console.log({ payload, variablesParsed });
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
      console.log({ payload });
      const { data } = await Axios.post(LAMBDAS.crearOrdenDeCompra, payload, {
        headers
      });
      navigate('/ordenes-de-compra');
    } catch (error) {
      console.error({ error } || 'Error!');
    }
  };

  willBlock = () =>
    //   {
    //   variablesParsed,
    //   valores: {
    //     bodega,
    //     comprador,
    //     factura,
    //     fechaDeDespacho,
    //     fechaDeEmision,
    //     importar,
    //     moneda,
    //     origenDeLaMercaderia,
    //     referencia,
    //     sujetoAImpuestos,
    //     terminoDePago
    //   }
    // }
    {
      // const vars = [
      //   // Text
      //   { name: 'agency_id', valor: bodega },
      //   { name: 'charge_term_id', valor: terminoDePago },
      //   { name: 'currency_id', valor: moneda },
      //   { name: 'invoice', valor: factura },
      //   { name: 'issue_date', valor: fechaDeEmision },
      //   { name: 'origin', valor: origenDeLaMercaderia },
      //   { name: 'payee_id', valor: this.state.proveedor },
      //   { name: 'purchaser_id', valor: comprador },
      //   { name: 'reference', valor: referencia },
      //   { name: 'shipping_date', valor: fechaDeDespacho },
      //   // Booleans
      //   { name: 'taxable', valor: sujetoAImpuestos },
      //   { name: 'import', valor: importar }
      // ];
      // // Validar si traen required_webapp
      // // Validar si trae default_webapp
      // let req = vars.map(variable => {
      //   const required =
      //     get(variablesParsed, [variable.name, 'required_webapp']) === 'true';
      //   const def = get(variablesParsed, [variable.name, 'default_webapp']);
      //   const hide = get(variablesParsed, [variable.name, 'hidden_webapp']);

      //   const block1 = !!!def && required && !!!variable.valor && hide !== 'true';
      //   const block2 =
      //     !!!def && !required && !!!variable.valor && hide !== 'true';
      //   const block = block1 || block2;
      //   return {
      //     ...variable,
      //     required: required,
      //     default: def,
      //     block
      //   };
      // });

      // return req.some(re => re.block);
      return false;
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
      { nombre: 'reference', text: 'reference' },
      { nombre: 'taxable', text: 'taxable' },
      { nombre: 'invoice', text: 'invoice' },
      { nombre: 'issue_date', text: 'issue_date' },
      { nombre: 'shipping_date', text: 'shipping_date' },
      { nombre: 'charge_term_id', text: 'charge_term_id' },
      { nombre: 'payee_id', text: 'payee_id' },
      { nombre: 'origin', text: 'origin' },
      { nombre: 'agency_id', text: 'agency_id' },
      { nombre: 'purchaser_id', text: 'purchaser_id' },
      { nombre: 'currency_id', text: 'currency_id' },
      { nombre: 'import', text: 'import' }
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

    // const block = this.willBlock({
    //   variablesParsed,
    //   valores: {
    //     bodega,
    //     comprador,
    //     factura,
    //     fechaDeDespacho,
    //     fechaDeEmision,
    //     importar,
    //     moneda,
    //     origenDeLaMercaderia,
    //     referencia,
    //     sujetoAImpuestos,
    //     terminoDePago
    //   }
    // });

    console.log({
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
      importV
    });

    return (
      <Form size="huge" onSubmit={this.handleSubmit}>
        {reference.hidden === true ? null : (
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

        {taxable.hidden === true ? null : (
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

        {invoice.hidden === true ? null : (
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

        {issue_date.hidden === true ? null : (
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

        {shipping_date.hidden === true ? null : (
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

        {charge_term_id.hidden === true ? null : (
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

        {payee_id.hidden === true ? null : (
          <Form.Group>
            {/* payee_id */}
            <Form.Field required>
              <label>{payee_id.name}</label>
              <BuscarProveedor guardarProveedor={this.guardarProveedor} />
            </Form.Field>
          </Form.Group>
        )}

        {origin.hidden === true ? null : (
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

        {agency_id.hidden === true ? null : (
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

        {purchaser_id.hidden === true ? null : (
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

        {currency_id.hidden === true ? null : (
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

        {importV.hidden === true ? null : (
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
          disabled={false}
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