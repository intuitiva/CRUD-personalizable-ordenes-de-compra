//@ts-check
import axios from "axios";
import { headers } from "../utils/utils";
import JSON from "circular-json";

exports.handler = async (event, context) => {
  try {
    const ZAURU_DOMAIN = process.env.GATSBY_ZAURU_DOMAIN;
    const URL = ZAURU_DOMAIN + process.env.GATSBY_ZAURU_GET1;
    console.log(URL, headers);
    let response = await axios.get(URL, { headers: headers });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log(JSON.stringify(error.message));
    return {
      statusCode: 502,
      body: JSON.stringify(error)
    };
  }
};
