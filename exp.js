import config from './gatsby-config.js';
import tiposDeTurno from './dev/tiposDeTurno';
import turnos from './dev/turnos';
import turnosNoVendidos from './dev/turnosNoVendidos';

let env = config.siteMetadata.env;

let isDev = env === 'development';

export { env, isDev, tiposDeTurno, turnos, turnosNoVendidos };
