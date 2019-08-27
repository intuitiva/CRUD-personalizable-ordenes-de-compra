import React, { Component } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { navigate } from "gatsby";
import { Layout } from "../components/Layout";
import gatsbyConfig from "../../gatsby-config";
import "../css/style.css";

export default class Index extends Component {
  componentDidMount() {
    let user = netlifyIdentity.currentUser();
    if (user !== null) navigate("/ordenes-de-compra");
  }
  render() {
    let TituloPrincipal = gatsbyConfig.siteMetadata.titulos.app;
    return (
      <Layout>
        <div className="pt-8">
          <h1>{TituloPrincipal}</h1>
        </div>
      </Layout>
    );
  }
}
