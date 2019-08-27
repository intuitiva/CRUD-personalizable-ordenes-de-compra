//@ts-check
import React, { Component, Fragment } from "react";
//@ts-ignore
import Para from "../../images/paragraph.png";
import {
  Table,
  Input,
  Checkbox,
  Button,
  Segment,
  Dimmer,
  Loader,
  Image,
  TextArea
} from "semantic-ui-react";
import PropTypes, { bool } from "prop-types";
import Axios from "axios";
import { array, func } from "prop-types";

//@ts-ignore
const Ast = () => <span style={{ fontWeight: "900" }}>*</span>;

const Loading = ({ text }) => (
  <Segment>
    <Dimmer active inverted>
      <Loader size="large">{text || "Cargando..."}</Loader>
    </Dimmer>

    <Image src={Para} />
  </Segment>
);

class Tabla1 extends Component {
  static propTypes = {
    updateTable: func,
    actualizaTabla: func,
    varIniciales: array,
    loading: bool
  };

  static defaultProps = {
    updateTable: () => {},
    actualizaTabla: () => {},
    varIniciales: [],
    loading: false
  };

  state = {
    loading: false
  };
  onChange = props => {
    this.props.updateTable(props);
  };

  actualizaTabla = () => {
    this.props.actualizaTabla();
  };

  crearVariablesIndividuales = async variables => {
    try {
      for (const variable of variables) {
        const {
          id,
          wNombre,
          wEsconder,
          wObligatorio,
          wPredefinido,
          action
        } = variable;
        const nombre = wNombre && wNombre.toString();
        const esconder = wEsconder && wEsconder.toString();
        const obligatorio = wObligatorio && wObligatorio.toString();
        const predefinido = wPredefinido && wPredefinido.toString();

        const APP_DOMAIN = process.env.GATSBY_LAMBDA_DOMAIN;
        const url = APP_DOMAIN + process.env.GATSBY_LAMBDA_CREAR_VARIABLE;
        var payload = {};

        if (action.new_name_webapp === "create") {
          payload = {
            // _new_name_webapp
            variable: {
              name: `${id}_new_name_webapp`,
              kind: "string",
              value: nombre,
              description: `${id}_new_name_webapp name`
            }
          };
          await Axios.post(url, payload);
        }

        if (action.required_webapp === "create") {
          payload = {
            // _required_webapp
            variable: {
              name: `${id}_required_webapp`,
              kind: "boolean",
              value: obligatorio,
              description: `${id}_required_webapp required`
            }
          };
          await Axios.post(url, payload);
        }

        if (action.default_webapp === "create") {
          payload = {
            // _default_webapp
            variable: {
              name: `${id}_default_webapp`,
              kind: "string",
              value: predefinido,
              description: `${id}_default_webapp default`
            }
          };
          await Axios.post(url, payload);
        }

        if (action.hidden_webapp === "create") {
          payload = {
            // _hidden_webapp
            variable: {
              name: `${id}_hidden_webapp`,
              kind: "boolean",
              value: esconder,
              description: `${id}_hidden_webapp hidden`
            }
          };
          await Axios.post(url, payload);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  editarVariablesIndividuales = async variables => {
    try {
      for (const variable of variables) {
        const {
          id,
          wNombre,
          wEsconder,
          wObligatorio,
          wPredefinido,
          edit,
          action
        } = variable;
        const nombre = wNombre && wNombre.toString();
        const esconder = wEsconder && wEsconder.toString();
        const obligatorio = wObligatorio && wObligatorio.toString();
        const predefinido = wPredefinido && wPredefinido.toString();
        const APP_DOMAIN = process.env.GATSBY_LAMBDA_DOMAIN;
        const url = APP_DOMAIN + process.env.GATSBY_LAMBDA_EDITAR_VARIABLE;
        var payload = {};
        if (action.new_name_webapp === "edit") {
          payload = {
            payload: {
              // _new_name_webapp
              variable: {
                name: `${id}_new_name_webapp`,
                kind: "string",
                value: nombre,
                description: `${id}_new_name_webapp name`
              }
            },
            id: edit[`${id}_new_name_webapp`].id
          };

          await Axios.post(url, {
            payload: payload.payload,
            id: payload.id
          });
        }

        if (action.required_webapp === "edit") {
          payload = {
            payload: {
              // _required_webapp
              variable: {
                name: `${id}_required_webapp`,
                kind: "boolean",
                value: obligatorio.toString(),
                description: `${id}_required_webapp required`
              }
            },
            id: edit[`${id}_required_webapp`].id
          };
          await Axios.post(url, {
            payload: payload.payload,
            id: payload.id
          });
        }

        if (action.default_webapp === "edit") {
          payload = {
            payload: {
              // _default_webapp
              variable: {
                name: `${id}_default_webapp`,
                kind: "string",
                value: predefinido,
                description: `${id}_default_webapp default`
              }
            },
            id: edit[`${id}_default_webapp`].id
          };
          await Axios.post(url, {
            payload: payload.payload,
            id: payload.id
          });
        }

        if (action.hidden_webapp === "edit") {
          payload = {
            payload: {
              // _hidden_webapp
              variable: {
                name: `${id}_hidden_webapp`,
                kind: "boolean",
                value: esconder.toString(),
                description: `${id}_hidden_webapp hidden`
              }
            },
            id: edit[`${id}_hidden_webapp`].id
          };
          await Axios.post(url, {
            payload: payload.payload,
            id: payload.id
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  haveCreate = variable => {
    return [
      variable.action.default_webapp === "create",
      variable.action.hidden_webapp === "create",
      variable.action.new_name_webapp === "create",
      variable.action.required_webapp === "create"
    ].some(an => an);
  };

  haveEdit = variable => {
    return [
      variable.action.default_webapp === "edit",
      variable.action.hidden_webapp === "edit",
      variable.action.new_name_webapp === "edit",
      variable.action.required_webapp === "edit"
    ].some(an => an);
  };

  guardarVariables = async () => {
    try {
      const { varIniciales } = this.props;
      this.setState({
        loading: true
      });

      // Obtener variables modificadas
      const variablesModificadas = varIniciales.filter(
        variable => variable.modificado
      );

      // Filtrar filas que continen dentro de action algun create
      const variablesConCreate = variablesModificadas.filter(this.haveCreate);

      // Filtrar filas que continen dentro de action algun edit
      const variablesConEdit = variablesModificadas.filter(this.haveEdit);

      await this.crearVariablesIndividuales(variablesConCreate);
      await this.editarVariablesIndividuales(variablesConEdit);
      this.actualizaTabla();
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  resolverTipo = type => {
    const tipos = {
      string: "text",
      integer: "number",
      date: "date",
      decimal: "number",
      text: "text",
      float: "number"
    };
    return tipos[type] || "text";
  };

  render() {
    const { varIniciales } = this.props;
    const canSave = varIniciales.find(item => item.modificado) === undefined;

    return (
      <Fragment>
        {this.props.loading || this.state.loading ? (
          <Loading
            text={
              this.props.loading
                ? "Obteniendo variables"
                : this.state.loading
                ? "Actualizando variables"
                : ""
            }
          />
        ) : (
          <Fragment>
            <br />

            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Campo Zauru</Table.HeaderCell>
                  <Table.HeaderCell>Nombre Campo Webapp</Table.HeaderCell>
                  <Table.HeaderCell>Tipo Zauru</Table.HeaderCell>
                  <Table.HeaderCell>Obligatorio Zauru</Table.HeaderCell>
                  <Table.HeaderCell>Obligatorio Webapp</Table.HeaderCell>
                  <Table.HeaderCell>Valor predefinido Zauru</Table.HeaderCell>
                  <Table.HeaderCell>Valor predefinido Webapp</Table.HeaderCell>
                  <Table.HeaderCell>Esconder el campo Webapp</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {varIniciales.map(variable => {
                  return (
                    <Table.Row key={variable.id}>
                      <Table.Cell>
                        {variable.modificado && <Ast />}
                        {`${" "}${variable.campoZauru}`}
                      </Table.Cell>
                      <Table.Cell
                        positive={variable.action.new_name_webapp !== undefined}
                      >
                        <Input
                          placeholder="Nombre"
                          onChange={e =>
                            this.onChange({
                              id: variable.id,
                              key: "wNombre",
                              value: e.target.value
                            })
                          }
                          value={variable.wNombre}
                        />
                      </Table.Cell>
                      <Table.Cell>{variable.type}</Table.Cell>
                      <Table.Cell>
                        {variable.required ? "Verdadero" : "Falso"}
                      </Table.Cell>
                      <Table.Cell
                        textAlign="center"
                        positive={variable.action.required_webapp !== undefined}
                      >
                        <Checkbox
                          toggle
                          onChange={() =>
                            this.onChange({
                              id: variable.id,
                              key: "wObligatorio",
                              value: !variable.wObligatorio
                            })
                          }
                          checked={variable.wObligatorio}
                        />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {variable.default ? variable.default.toString() : "-"}
                      </Table.Cell>
                      <Table.Cell
                        textAlign="center"
                        positive={variable.action.default_webapp !== undefined}
                      >
                        {variable.type === "boolean" ? (
                          <Checkbox
                            toggle
                            onChange={() => {
                              this.onChange({
                                id: variable.id,
                                key: "wPredefinido",
                                value: (!(
                                  variable.wPredefinido === "true"
                                )).toString()
                              });
                            }}
                            checked={variable.wPredefinido === "true"}
                          />
                        ) : variable.type === "text" ? (
                          <TextArea
                            placeholder="Valor"
                            // type={this.resolverTipo(variable.type)}
                            onChange={e =>
                              this.onChange({
                                id: variable.id,
                                key: "wPredefinido",
                                value: e.target.value
                              })
                            }
                            value={variable.wPredefinido}
                          />
                        ) : (
                          <Input
                            placeholder="Valor"
                            type={this.resolverTipo(variable.type)}
                            onChange={e =>
                              this.onChange({
                                id: variable.id,
                                key: "wPredefinido",
                                value: e.target.value
                              })
                            }
                            value={variable.wPredefinido}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell
                        positive={variable.action.hidden_webapp !== undefined}
                      >
                        <Checkbox
                          toggle
                          onChange={() =>
                            this.onChange({
                              id: variable.id,
                              key: "wEsconder",
                              value: !variable.wEsconder
                            })
                          }
                          checked={variable.wEsconder}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="8" />
                </Table.Row>
              </Table.Footer>
            </Table>

            <br />
            <Button
              color="blue"
              onClick={this.guardarVariables}
              content="Guardar"
              disabled={canSave}
              size="huge"
            />
            <br />
            <br />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default Tabla1;
