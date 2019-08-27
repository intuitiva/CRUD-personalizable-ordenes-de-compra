//@ts-check
import axios from "axios";
import { headers } from "../utils/utils";
import JSON from "circular-json";

//@ts-ignore
exports.handler = async (event, context) => {
  try {
    const value = JSON.parse(event.body);
    const ZAURU_DOMAIN = process.env.GATSBY_ZAURU_DOMAIN;
    const url =
      ZAURU_DOMAIN + process.env.GATSBY_ZAURU_BUSCAR_PROVEEDOR + value.text;

    console.log({ url, payload: JSON.stringify(value) });
    let response = await axios.get(url, { headers: headers });
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
