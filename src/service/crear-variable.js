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
    const ZAURU_DOMAIN = process.env.GATSBY_ZAURU_DOMAIN;
    const url = ZAURU_DOMAIN + process.env.GATSBY_ZAURU_CREAR_VARIABLE;
    let response = await axios.post(url, event.body, { headers: headers });
    console.log({ url, payload: JSON.stringify(event.body) });
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
