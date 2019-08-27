# Personalización de campos de ordenes de compra abiertas

Este proyecto consiste en mostrar una vista personalizada de las ordenes de compra abiertas (autorizadas y no recibidas y no autorizadas).

## Características del proyecto:
1. Está diseñado para funcionar con netlify (www.netlify.com)
2. Utiliza netlify identiy para dar permisos de acceso
3. Utiliza netilify-functions para hacer los POST y PUT al API de Zauru
4. Utiliza variables de entorno de netlify para definir los parámetros sensibles

## Variables de entorno que se necesita crear en netlify para que funcione

```
  GATSBY_EMAIL='correo_x@zauru.com'
  GATSBY_TOKEN='1234567890ABCAD'
  GATSBY_EDITAR='false'
  GATSBY_ACTIVAR_PERSONALIZACION='true'

  GATSBY_ZAURU_DOMAIN='https://app.zauru.com'
  GATSBY_ZAURU_GET1='/apps/documents_structures/purchase_order.json'
  GATSBY_ZAURU_GET2='/apps/webapp_vars.json'
  GATSBY_ZAURU_CREAR_VARIABLE='/apps/webapp_vars.json'
  GATSBY_ZAURU_ORDENES_DE_COMPRA='/purchases/purchase_orders/datatables.json'
  GATSBY_ZAURU_OBTENER_ORDENES_DE_COMPRA='/purchases/purchase_orders/new.json'
  GATSBY_ZAURU_CREAR_ORDENES_DE_COMPRA='/purchases/purchase_orders.json'
  GATSBY_ZAURU_BUSCAR_PROVEEDOR='/settings/payees/autocomplete.json?term='

  GATSBY_ZAURU_EDITAR_VARIABLE1='/apps/webapp_vars/'
  GATSBY_ZAURU_EDITAR_VARIABLE2='.json'

  GATSBY_ZAURU_VER_OC_1='/purchases/purchase_orders/'
  GATSBY_ZAURU_VER_OC_2='.json'
  
  GATSBY_ZAURU_AUTORIZAR_OC_1='/purchases/purchase_orders/'
  GATSBY_ZAURU_AUTORIZAR_OC_2='/authorize.json'
  
  GATSBY_ZAURU_PREPARAR_OC='/purchases/purchase_orders/new.json'

  GATSBY_LAMBDA_DOMAIN='https://sitio_x.netlify.com/.netlify/functions/'
  GATSBY_LAMBDA_GET1='get1'
  GATSBY_LAMBDA_GET2='get2'
  GATSBY_LAMBDA_CREAR_VARIABLE='crear-variable'
  GATSBY_LAMBDA_EDITAR_VARIABLE='editar-variable'
  GATSBY_LAMBDA_CREAR_4_VARIABLE='crear-4-variables'
  GATSBY_LAMBDA_ORDENES_DE_COMPRA='ordenes-de-compra'
  GATSBY_LAMBDA_OBTENER_ORDENES_DE_COMPRA='obtener-ordenes-compra'
  GATSBY_LAMBDA_CREAR_ORDENES_DE_COMPRA='crear-orden-compra'
  GATSBY_LAMBDA_VER_OC='ver-oc-1'
  GATSBY_LAMBDA_BUSCAR_PROVEEDOR='buscar-proveedor'
 
  GATSBY_PREPARAR_OC='preparar-creacion-oc'
  GATSBY_AUTORIZAR_OC='autorizar-oc'
