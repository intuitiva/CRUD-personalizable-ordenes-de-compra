//@ts-check
import React, { Component, Fragment } from "react";
import { Table, Header } from "semantic-ui-react";
import PropTypes from "prop-types";

export default class EncabezadoVerOC extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    data: []
  };

  render() {
    const { data } = this.props;
    return (
      <Fragment>
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
      </Fragment>
    );
  }
}
