let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development';

module.exports = {
	siteMetadata: {
		title: `Gatsby Personalización de Órdenes de Compra`,
		description: `Gatsby Personalización de Órdenes de Compra`,
		author: `@luispagarcia`,
		titulos:{
			landing: "Aplicación para Personalización de Órdenes de Compra",
			app: "Aplicación para Personalización de Órdenes de Compra"
		},
		env: activeEnv
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`
			}
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Gatsby Personalización de Órdenes de Compra`,
				short_name: `starter`,
				start_url: `/`,
				background_color: `#ffffff`,
				theme_color: `#4dc0b5`,
				display: `minimal-ui`,
				icon: `src/images/tailwind-icon.png` // This path is relative to the root of the site.
			}
		},
		`gatsby-plugin-postcss`,
		{
			resolve: 'gatsby-plugin-purgecss',
			options: {
				tailwind: true,
				purgeOnly: [ 'src/css/style.css' ] // Purge only tailwind
			}
		}
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		// 'gatsby-plugin-offline',
	]
};
