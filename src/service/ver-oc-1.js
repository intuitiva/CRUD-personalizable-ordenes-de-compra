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
    const body = JSON.parse(event.body);
    const id = body.id;

    const ZAURU_DOMAIN = process.env.GATSBY_ZAURU_DOMAIN;
    const URL_PART1 = process.env.GATSBY_ZAURU_VER_OC_1;
    const URL_PART2 = process.env.GATSBY_ZAURU_VER_OC_2;
    const url = `${ZAURU_DOMAIN}${URL_PART1}${id}${URL_PART2}`;

    console.log({ url, id });
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
