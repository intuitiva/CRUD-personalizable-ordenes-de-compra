//@ts-check
import React, { Component, Fragment } from "react";
import { Table, Header, Message } from "semantic-ui-react";
import { arrayOf, bool, object } from "prop-types";

export default class ProveedorOC extends Component {
  static propTypes = {
    data: arrayOf(object),
    esconder: bool
  };

  static defaultProps = {
    data: [],
    esconder: false
  };

  render() {
    const { data, esconder } = this.props;
    return (
      <Fragment>
        {esconder ? null : (
          <Message>
            <Message.Header>Proveedor</Message.Header>
            <Table basic="very" celled collapsing>
              <Table.Body>
                {data.map(item => (
                  <Table.Row key={item.title}>
                    <Table.Cell>
                      <Header as="h4" image>
                        <Header.Content>{item.title}:</Header.Content>
                      </Header>
                    </Table.Cell>
                    <Table.Cell>{item.value}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Message>
        )}
      </Fragment>
    );
  }
}
