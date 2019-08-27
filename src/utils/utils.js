const headers = {
  Accept: 'application/json',
  'Content-type': 'application/json',
  'X-User-Email': process.env.GATSBY_EMAIL,
  'X-User-Token': process.env.GATSBY_TOKEN
};

const ZAURU_DOMAIN = process.env.GATSBY_ZAURU_DOMAIN;
const APP_DOMAIN = process.env.GATSBY_LAMBDA_DOMAIN;
const ACTIVAR_PERSONALIZACION =
  process.env.GATSBY_ACTIVAR_PERSONALIZACION === 'true';
const EDITAR = process.env.GATSBY_EDITAR === 'true';

const ZAURU_ENDPOINTS = {
  get1: ZAURU_DOMAIN + process.env.GATSBY_ZAURU_GET1,
  get2: ZAURU_DOMAIN + process.env.GATSBY_ZAURU_GET2,
  crearVariable: ZAURU_DOMAIN + process.env.GATSBY_ZAURU_CREAR_VARIABLE
};

const LAMBDAS = {
  get1: APP_DOMAIN + process.env.GATSBY_LAMBDA_GET1,
  get2: APP_DOMAIN + process.env.GATSBY_LAMBDA_GET2,
  crearVariable: APP_DOMAIN + process.env.GATSBY_LAMBDA_CREAR_VARIABLE,
  editarVariable: APP_DOMAIN + process.env.GATSBY_LAMBDA_EDITAR_VARIABLE,
  crear4Variables: APP_DOMAIN + process.env.GATSBY_LAMBDA_CREAR_4_VARIABLE,
  ordenesDeCompra: APP_DOMAIN + process.env.GATSBY_LAMBDA_ORDENES_DE_COMPRA,
  obtenerOrdenesDeCompra:
    APP_DOMAIN + process.env.GATSBY_LAMBDA_OBTENER_ORDENES_DE_COMPRA,
  verOC: APP_DOMAIN + process.env.GATSBY_LAMBDA_VER_OC,

  prepararOc: APP_DOMAIN + process.env.GATSBY_PREPARAR_OC,
  crearOrdenDeCompra:
    APP_DOMAIN + process.env.GATSBY_LAMBDA_CREAR_ORDENES_DE_COMPRA,
  buscarProveedor: APP_DOMAIN + process.env.GATSBY_LAMBDA_BUSCAR_PROVEEDOR,
  autorizarOC: APP_DOMAIN + process.env.GATSBY_AUTORIZAR_OC,
  datatable: APP_DOMAIN + process.env.GATSBY_LAMBDA_ORDENES_DE_COMPRA
};
export { headers, ZAURU_ENDPOINTS, LAMBDAS, ACTIVAR_PERSONALIZACION, EDITAR };
