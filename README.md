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
  GATSBY_LAMBDA_DOMAIN='https://sitio_x.netlify.com/.netlify/functions/'
```
## Instalación y configuración
### 1. Instalar dependencias (para localhost)

Si usas npm

```bash
$ npm install
```

Si usas yarn

```bash
$ yarn install
```

### Deployment en Netlify

1. Conectar github con Netlify, y publicar
2. Habilitar dominio
3. Habilitar HTTPS
4. Agregar las variables de entorno y sus valores
5. Habilitar Netlify Identity y configurarlo para que sea invite only
6. Invitar a alguien

Licencia MIT
