//@ts-check
import React, { Component, Fragment } from "react";
import { Table, Header } from "semantic-ui-react";
import PropTypes from "prop-types";

export default class DetalleItems extends Component {
  static propTypes = {
    esconder: PropTypes.bool.isRequired
  };

  static defaultProps = {
    esconder: false
  };

  getTotal = data => {
    var onlyValues = data.map(item => parseFloat(item.costo));
    return onlyValues.reduce((a, b) => a + b, 0);
  };

  render() {
    const { data, esconder, footer } = this.props;
    if (esconder === true) return null;
    const total = this.getTotal(data);
    const totalValue = parseFloat(total).toFixed(2);
    const { tax1, tax2, shipping, other_charges, discount } = footer;
    const subfooter = [
      {
        title: "Subtotal",
        value: totalValue
      },
      {
        title: "Impuesto 1",
        value: parseFloat(tax1).toFixed(2)
      },
      {
        title: "Impuesto 2",
        value: parseFloat(tax2).toFixed(2)
      },
      {
        title: "Envío",
        value: parseFloat(shipping).toFixed(2)
      },
      {
        title: "Otros Cargos",
        value: parseFloat(other_charges).toFixed(2)
      },
      {
        title: "Descuentos",
        value: parseFloat(discount).toFixed(2)
      },
      {
        title: "Total",
        value: totalValue
      },
      {
        title: "Debe",
        value: totalValue
      }
    ];
    return (
      <Fragment>
        <Header as="h1">Detalle de Items (Mercaderia de Materia Prima)</Header>
        <Table color="blue" inverted celled>
          <Table.Header>
            <Table.Row>
              <Table.Cell textAlign="center">Item</Table.Cell>
              <Table.Cell textAlign="center">Referencia</Table.Cell>
              <Table.Cell textAlign="center">Costo unitario</Table.Cell>
              <Table.Cell textAlign="center">Reservados</Table.Cell>
              <Table.Cell textAlign="center">Costo (Q)</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map(item => (
              <Table.Row key={item.key}>
                <Table.Cell textAlign="center">{item.item}</Table.Cell>
                <Table.Cell textAlign="center">{item.referencia}</Table.Cell>
                <Table.Cell textAlign="center">{item.costoUnitario}</Table.Cell>
                <Table.Cell textAlign="center">{item.reservados}</Table.Cell>
                <Table.Cell textAlign="right">
                  {parseFloat(item.costo).toFixed(2)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={4} textAlign="right">
                Subtotal (Items)
              </Table.Cell>
              <Table.Cell textAlign="right">
                <strong>{parseFloat(total).toFixed(2)}</strong>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <div
          style={{
            width: "250px",
            float: "right"
          }}
        >
          <Table>
            <Table.Body>
              {subfooter.map(item => (
                <Table.Row>
                  <Table.Cell colSpan={4} textAlign="right" width="4">
                    {item.title}
                  </Table.Cell>
                  <Table.Cell textAlign="right" width="2">
                    <strong>Q{item.value}</strong>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Fragment>
    );
  }
}
