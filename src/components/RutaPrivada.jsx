//@ts-check
import React from "react";
import netlifyIdentity from "netlify-identity-widget";

const RutaPrivada = ({ children }) => {
  const user = netlifyIdentity.currentUser();
  // Valida si existe un usuario logeado
  if (user === null) {
    return <h1>Debes estar loggeado para ver la aplicación</h1>;
  }

  return <div>{children}</div>;
};

export default RutaPrivada;
