//@ts-check
import React, { Component, Fragment } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { navigate } from 'gatsby';
import Axios from 'axios';
import { LAMBDAS, ACTIVAR_PERSONALIZACION } from '../../utils/utils';
import Tabla1 from '../Componentes/Tabla1';
import { get } from 'propx';
export default class Pagina2 extends Component {
  state = {
    varIniciales: [],
    extras: [],
    loading: false
  };

  componentDidMount() {
    let user = netlifyIdentity.currentUser();
    if (user === null) {
      navigate('/');
    } else {
      if (this.props.context.varIniciales.length === 0) this.callApis();
    }
  }

  actualizaTabla = () => {
    this.callApis();
  };

  callApis = async () => {
    try {
      this.props.context.save('loading', true);
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
        const textAreas = ['memo'];
        // Objeto a guardar si es EDIT
        const push = {
          id: nombre,
          isTextArea: textAreas.includes(nombre),
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
      this.props.context.save('varIniciales', varIniciales);
      this.props.context.save('varInicialesCOMPARE', varIniciales);
      this.props.context.save('extras', data2);
      this.props.context.save('loading', false);
    } catch (error) {
      console.error({ error });
    }
  };

  wasModified = obj => {
    const itemCompare = this.props.context.varInicialesCOMPARE.find(
      item => item.id === obj.id
    );

    const some = [
      obj.wNombre !== itemCompare.wNombre &&
        obj.wNombre.toString().trim() !== '' &&
        obj.wNombre !== undefined,
      obj.wPredefinido !== itemCompare.wPredefinido &&
        obj.wPredefinido.toString().trim() !== '' &&
        obj.wPredefinido !== undefined,
      obj.wObligatorio !== itemCompare.wObligatorio,
      obj.wEsconder !== itemCompare.wEsconder
    ];

    const someObj = {
      new_name_webapp: some[0],
      default_webapp: some[1],
      required_webapp: some[2],
      hidden_webapp: some[3]
    };

    const needsEdit = {
      new_name_webapp: obj.editValues.new_name_webapp !== undefined,
      default_webapp: obj.editValues.default_webapp !== undefined,
      required_webapp: obj.editValues.required_webapp !== undefined,
      hidden_webapp: obj.editValues.hidden_webapp !== undefined
    };

    const needsCreation = {
      new_name_webapp: obj.editValues.new_name_webapp === undefined,
      default_webapp: obj.editValues.default_webapp === undefined,
      required_webapp: obj.editValues.required_webapp === undefined,
      hidden_webapp: obj.editValues.hidden_webapp === undefined
    };

    const action = {
      new_name_webapp:
        someObj.new_name_webapp && needsEdit.new_name_webapp
          ? 'edit'
          : someObj.new_name_webapp && needsCreation.new_name_webapp
          ? 'create'
          : undefined,
      default_webapp:
        someObj.default_webapp && needsEdit.default_webapp
          ? 'edit'
          : someObj.default_webapp && needsCreation.default_webapp
          ? 'create'
          : undefined,
      required_webapp:
        someObj.required_webapp && needsEdit.required_webapp
          ? 'edit'
          : someObj.required_webapp && needsCreation.required_webapp
          ? 'create'
          : undefined,
      hidden_webapp:
        someObj.hidden_webapp && needsEdit.hidden_webapp
          ? 'edit'
          : someObj.hidden_webapp && needsCreation.hidden_webapp
          ? 'create'
          : undefined
    };

    return {
      modificado: some.some(item => item),
      some: someObj,
      needsEdit,
      needsCreation,
      action
    };
  };

  updateTable = ({ id, key, value }) => {
    const varIniciales = this.props.context.varIniciales.map(v => {
      let val = {};
      if (id === v.id) {
        const modificado = this.wasModified({
          ...v,
          [key]: value
        });
        val = { ...v, [key]: value, ...modificado };
        return val;
      }
      // validate equal mod
      return { ...v };
    });
    this.props.context.save('varIniciales', varIniciales);
  };

  render() {
    return (
      <Fragment>
        {ACTIVAR_PERSONALIZACION ? (
          <Tabla1
            loading={this.props.context.loading}
            actualizaTabla={this.actualizaTabla}
            varIniciales={this.props.context.varIniciales}
            updateTable={this.updateTable}
          />
        ) : null}
      </Fragment>
    );
  }
}
