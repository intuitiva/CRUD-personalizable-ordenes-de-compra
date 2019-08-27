//@ts-check
import axios from "axios";
import JSON from "circular-json";

//@ts-ignore
exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Metodo no aceptado." };
    }

    const APP_DOMAIN = process.env.GATSBY_LAMBDA_DOMAIN;
    const url = APP_DOMAIN + process.env.GATSBY_LAMBDA_CREAR_VARIABLE;
    console.log({ url });
    let response1 = await axios.post(url, event.body.res1);
    console.log("1", JSON.stringify(response1));
    let response2 = await axios.post(url, event.body.res2);
    console.log("2", JSON.stringify(response2));
    let response3 = await axios.post(url, event.body.res3);
    console.log("3", JSON.stringify(response3));
    let response4 = await axios.post(url, event.body.res4);
    console.log("4", JSON.stringify(response4));

    return {
      statusCode: 200,
      body: JSON.stringify({ response1, response2, response3, response4 })
    };
  } catch (error) {
    console.log(JSON.stringify(error.message));
    return {
      statusCode: 502,
      body: JSON.stringify(error)
    };
  }
};
