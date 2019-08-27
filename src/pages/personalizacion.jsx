//@ts-check
import React, { Component } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { Layout } from "../components/Layout";
import RutaPrivada from "../components/RutaPrivada";
import { navigate } from "gatsby";
import { Consumer } from "../components/context/context";
import ContextProvider from "../components/context/Provider";
import Pagina2 from "../components/Paginas/Pagina2";

export default class App extends Component {
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
                <Pagina2 context={value} />
              </RutaPrivada>
            </Layout>
          )}
        </Consumer>
      </ContextProvider>
    );
  }
}
