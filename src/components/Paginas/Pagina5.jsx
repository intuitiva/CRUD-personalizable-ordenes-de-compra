//@ts-check
import React, { Component, Fragment } from "react";
import { Header } from "semantic-ui-react";
import netlifyIdentity from "netlify-identity-widget";
import { navigate } from "gatsby";
import Formulario from "../Componentes/CrearOC/Formulario";
import Axios from "axios";
import { get } from "propx";
import { LAMBDAS } from "../../utils/utils";

export default class Pagina5 extends Component {
  constructor(props) {
    super(props);
    var todayDate = new Date().toISOString().slice(0, 10);

    this.state = {
      bodega: null,
      comprador: null,
      factura: "",
      fechaDeDespacho: todayDate,
      fechaDeEmision: todayDate,
      importar: false,
      moneda: 1,
      loading: false,
      origenDeLaMercaderia: null,
      proveedor: "",
      referencia: "",
      sujetoAImpuestos: false,
      terminoDePago: null,
      variables: []
    };
  }

  componentDidMount() {
    let user = netlifyIdentity.currentUser();
    if (user === null) {
      navigate("/");
    } else {
      this.callApis();
    }
  }

  crearTerminos = ct => {
    if (!ct) return [];

    return ct.map(item => ({
      key: item.id,
      text: item.name,
      value: item.id,
      complete: item
    }));
  };

  crearBodegas = ct => {
    if (!ct) return [];

    return ct.map(item => ({
      key: item.id,
      text: item.name,
      value: item.id,
      complete: item
    }));
  };

  crearComprador = ct => {
    if (!ct) return [];

    return ct.map(item => ({
      key: item.id,
      text: item.name,
      value: item.id,
      complete: item
    }));
  };

  crearMonedas = () => [
    {
      key: 1,
      text: "GTQ",
      value: 1
    },
    {
      key: 2,
      text: "USD",
      value: 2
    }
  ];

  getVariables = async () => {
    try {
      //@ts-ignore
      const { data: data1 } = await Axios.get(LAMBDAS.get1);
      //@ts-ignore
      const { data: data2 } = await Axios.get(LAMBDAS.get2);
      const varIniciales = [];

      function match(array, nombre, postfix) {
        return array.find(item => item.name === `${nombre}${postfix}`);
      }

      // @ts-ignore
      for (var [nombre, propiedades] of Object.entries(data1)) {
        const objectNeedsEdit = {
          edit: {
            [`${nombre}_new_name_webapp`]: match(
              data2,
              nombre,
              "_new_name_webapp"
            ),
            [`${nombre}_required_webapp`]: match(
              data2,
              nombre,
              "_required_webapp"
            ),
            [`${nombre}_default_webapp`]: match(
              data2,
              nombre,
              "_default_webapp"
            ),
            [`${nombre}_hidden_webapp`]: match(data2, nombre, "_hidden_webapp")
          },
          editValues: {
            new_name_webapp: get(
              match(data2, nombre, "_new_name_webapp"),
              "value",
              undefined
            ),
            required_webapp: get(
              match(data2, nombre, "_required_webapp"),
              "value",
              undefined
            ),
            default_webapp: get(
              match(data2, nombre, "_default_webapp"),
              "value",
              undefined
            ),
            hidden_webapp: get(
              match(data2, nombre, "_hidden_webapp"),
              "value",
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
          wObligatorio: objectNeedsEdit.editValues.required_webapp === "true",
          wPredefinido: objectNeedsEdit.editValues.default_webapp,
          wEsconder: objectNeedsEdit.editValues.hidden_webapp === "true",
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
    }
  };

  callApis = async () => {
    try {
      this.setState({
        loading: true
      });
      const { data } = await Axios.get(LAMBDAS.prepararOc);
      const variables = await this.getVariables();
      const terminosDePago = this.crearTerminos(data.charge_terms);
      const bodegas = this.crearBodegas(data.agencies);
      const compradores = this.crearComprador(data.purchasers);
      const monedas = this.crearMonedas();

      this.setState({
        terminosDePago,
        bodegas,
        compradores,
        monedas,
        variables
      });
    } catch (error) {
      console.error(error.message);
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  actualiza = (e, { name, value }) => this.setState({ [name]: value });

  terminoDePagoChange = (e, { value }) =>
    this.setState({ terminoDePago: value });
  bodegasOnChange = (e, { value }) => this.setState({ bodega: value });
  compradorOnChange = (e, { value }) => this.setState({ comprador: value });
  monedaOnChange = (e, { value }) => this.setState({ moneda: value });

  checkOnChange = (e, { name }) => this.setState({ [name]: !this.state[name] });

  render() {
    const {
      referencia,
      sujetoAImpuestos,
      factura,
      fechaDeEmision,
      fechaDeDespacho,
      terminoDePago,
      proveedor,
      origenDeLaMercaderia,
      bodega,
      moneda,
      importar,

      terminosDePago,
      bodegas,
      compradores,
      monedas,
      comprador,
      variables,
      loading
    } = this.state;

    const propsForm = {
      referencia,
      sujetoAImpuestos,
      factura,
      fechaDeEmision,
      fechaDeDespacho,
      terminoDePago,
      proveedor,
      origenDeLaMercaderia,
      bodega,
      moneda,
      importar,
      comprador,

      terminosDePago,
      bodegas,
      compradores,
      monedas,

      variables,

      terminoDePagoChange: this.terminoDePagoChange,
      bodegasOnChange: this.bodegasOnChange,
      compradorOnChange: this.compradorOnChange,
      monedaOnChange: this.monedaOnChange,
      checkOnChange: this.checkOnChange,
      onChange: this.actualiza
    };
    if (loading) {
      return <Header as="h1">Cargando Formulario...</Header>;
    }
    return (
      <Fragment>
        <Header as="h1">Nueva Orden de Compra</Header>
        <Formulario {...propsForm} />
      </Fragment>
    );
  }
}
