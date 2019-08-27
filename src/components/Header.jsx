//@ts-check
import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import SEO from './seo';
import { ACTIVAR_PERSONALIZACION } from '../utils/utils';
//@ts-ignore
class Header extends Component {
  componentDidMount() {
    netlifyIdentity.init();
    netlifyIdentity.on('login', user => {
      navigate('/');
    });
    netlifyIdentity.on('logout', () => {
      navigate('/');
    });
  }

  onClick = (e, { path }) => {
    navigate(path);
  };

  renderPersonalizacion = () => (
    <Menu.Item
      name="personalizacion"
      path="/personalizacion"
      onClick={this.onClick}
      active={window.location.pathname.includes('/personalizacion')}
    />
  );

  render() {
    const user = netlifyIdentity.currentUser();
    let logged = !(user === null);
    return (
      <div>
        <SEO
          description="app"
          title="Personalización de órdenes de compra"
          keywords={[`gatsby`, `turnos`, `react`, `tailwindcss`]}
        />

        <Menu>
          {logged ? (
            <React.Fragment>
              <Menu.Item
                name="ordenes-de-compra"
                path="/ordenes-de-compra"
                onClick={this.onClick}
                active={window.location.pathname.includes('/ordenes-de-compra')}
              />
              {ACTIVAR_PERSONALIZACION && this.renderPersonalizacion()}
              <Menu.Item
                name="crear-nueva-orden"
                path="/crear-nueva-orden"
                onClick={this.onClick}
                active={window.location.pathname.includes('/crear-nueva-orden')}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Menu.Item name="Inicio" path="/" onClick={this.onClick} />
            </React.Fragment>
          )}

          <Menu.Menu position="right">
            {logged ? (
              <React.Fragment>
                <Menu.Item
                  name="Log out"
                  onClick={() => {
                    netlifyIdentity.logout();
                    navigate('/');
                  }}
                />
                <Menu.Item>{user ? user.email : ''}</Menu.Item>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Menu.Item
                  name="Login"
                  onClick={() => netlifyIdentity.open()}
                />
              </React.Fragment>
            )}
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export { Header };
