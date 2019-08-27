//@ts-check
import axios from 'axios';
import { headers } from '../utils/utils';
import JSON from 'circular-json';

//@ts-ignore
exports.handler = async (event, context) => {
  try {
    var API_PARAMS =
      '?' +
      Object.keys(event.queryStringParameters)
        .map(key => key + '=' + event.queryStringParameters[key])
        .join('&');
    console.log(JSON.stringify(API_PARAMS));
    const ZAURU_DOMAIN = process.env.GATSBY_ZAURU_DOMAIN;
    const url =
      ZAURU_DOMAIN + process.env.GATSBY_ZAURU_ORDENES_DE_COMPRA + API_PARAMS;
    const payload = JSON.stringify({
      start: '0',
      length: '40',
      search: { value: '', regex: 'false' }
    });
    let response = await axios.post(url, payload, { headers: headers });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 502,
      body: JSON.stringify(error)
    };
  }
};
