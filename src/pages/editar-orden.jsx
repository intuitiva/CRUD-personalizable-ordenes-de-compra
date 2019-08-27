//@ts-check
import React, { Component } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { Layout } from "../components/Layout";
import RutaPrivada from "../components/RutaPrivada";
import { navigate } from "gatsby";
import { Container } from "semantic-ui-react";
import { Consumer } from "../components/context/context";
import ContextProvider from "../components/context/Provider";
import Pagina6 from "../components/Paginas/Pagina6";

export default class EditarOC extends Component {
  state = {};

  componentDidMount() {
    let user = netlifyIdentity.currentUser();
    if (user === null) {
      navigate("/");
    }
  }

  render() {
    return (
      <ContextProvider>
        <Consumer>
          {value => (
            <Layout>
              <RutaPrivada>
                <Container>
                  <Pagina6 />
                </Container>
              </RutaPrivada>
            </Layout>
          )}
        </Consumer>
      </ContextProvider>
    );
  }
}
