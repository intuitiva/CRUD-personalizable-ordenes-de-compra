//@ts-check
import React, { Component, Fragment } from "react";
import { Header, Table } from "semantic-ui-react";
import netlifyIdentity from "netlify-identity-widget";
import { navigate } from "gatsby";

export default class VerDetallesOC extends Component {
  state = {};

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
      // const {data} = Axios.get(LAMBDAS.)
    } catch (error) {}
  };

  render() {
    return (
      <Fragment>
        <Header as="h1">Detalles de la OC</Header>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>reset rating</Table.Cell>
              <Table.Cell>None</Table.Cell>
              <Table.Cell>Resets rating to default value</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>set rating</Table.Cell>
              <Table.Cell>rating (integer)</Table.Cell>
              <Table.Cell>
                Sets the current star rating to specified value
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Fragment>
    );
  }
}
