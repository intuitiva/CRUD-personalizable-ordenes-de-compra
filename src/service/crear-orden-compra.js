//@ts-check
import axios from "axios";
import { headers } from "../utils/utils";
import JSON from "circular-json";

//@ts-ignore
exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Metodo no aceptado." };
    }
    const payload = event.body;
    const ZAURU_DOMAIN = process.env.GATSBY_ZAURU_DOMAIN;
    const PATH = process.env.GATSBY_ZAURU_CREAR_ORDENES_DE_COMPRA;
    const url = `${ZAURU_DOMAIN}${PATH}`;
    console.log(JSON.stringify(payload));
    console.log(url);

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
