//@ts-check
import React, { Component, Fragment } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { navigate } from "gatsby";
import Datatable1 from "../Componentes/Datatable1";
import Axios from "axios";
import { LAMBDAS } from "../../utils/utils";
import { get } from "propx";
import { Header } from "semantic-ui-react";

export default class Pagina3 extends Component {
  state = {
    var: [],
    loading: true
  };

  componentDidMount() {
    let user = netlifyIdentity.currentUser();
    if (user === null) {
      navigate("/");
    } else {
      this.callApis();
    }
  }

  callApis = async () => {
    try {
      this.props.context.save("loading", true);
      await this.setState({ loading: true });
      //@ts-ignore
      const { data: data1 } = await Axios.get(LAMBDAS.get1);
      //@ts-ignore
      const { data: data2 } = await Axios.get(LAMBDAS.get2);
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
      this.setState({
        var: varIniciales
      });
      this.props.context.save("varIniciales", varIniciales);
      this.props.context.save("varInicialesCOMPARE", varIniciales);
      this.props.context.save("extras", data2);
      this.props.context.save("loading", false);
      await this.setState({ loading: false });
    } catch (error) {
      console.error({ error });
    }
  };

  render() {
    return (
      <Fragment>
        {this.state.var.length === 0 ? (
          <Header as="h1">Cargando Órdenes de Compra...</Header>
        ) : (
          <Fragment>
            <h1>Órdenes de Compra</h1>
            <Datatable1 variables={this.state.var} loading={false} />
          </Fragment>
        )}
      </Fragment>
    );
  }
}
