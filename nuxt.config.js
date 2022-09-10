require("dotenv").config();

export default {
	vue: {
		config: {
			productionTip: true,
			devtools: false,
			performance: true
		}
	},
	// Target (https://go.nuxtjs.dev/config-target)
	target: 'server',

	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		title: 'إضحك لين تفطس',
		titleTemplate: '%s | فطسني',
		meta: [{charset: 'utf-8'}, { name: 'viewport', content: 'width=device-width, initial-scale=1'},{
				hid: 'description', name: 'description', content: ''}],
		link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            { rel: 'stylesheet', href: 'https://pro.fontawesome.com/releases/v5.15.1/css/all.css'}, //add for example your Google Fonts link here
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300'},
            { rel: 'stylesheet', href: '//fonts.googleapis.com/earlyaccess/notonaskharabic.css'},
        ]
	},

	// Global CSS (https://go.nuxtjs.dev/config-css)
	css: [
		'@/assets/css/main.scss'
	],

	// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
	plugins: [
        '~/plugins/vue-observe-visibility.client',
		'~/plugins/meilisearch',
        '~/plugins/repository'
	],

	// Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,
    components: {
        dirs:[
            '~/components', {
                path: '~/components/navbar',
                prefix: 'Navbar'
            }
        ]
    },

	// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
	buildModules: [
		['@nuxtjs/moment', {
			locales: ['ar'],
			defaultLocale: 'ar',
			timezone: true,
			plugins: [
				'moment-transform',
			]

		}]
	],

	// Modules (https://go.nuxtjs.dev/config-modules)
	modules: [
		// https://go.nuxtjs.dev/bootstrap
		'bootstrap-vue/nuxt',
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		// Doc: https://github.com/nuxt-community/dotenv-module
		'@nuxtjs/dotenv',
		// Authentication library
        '@nuxtjs/auth',
        // Markdown Viewer
        '@nuxtjs/markdownit'
    ],
    markdownit: {
        injected: true
      },
    

	// Axios module configuration (https://go.nuxtjs.dev/config-axios)
	axios: {
        baseURL: process.env.API_AUTH_URL,
        withCredentials: true
	},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {},
	/*
	 ** Auth module configuration
	 ** See https://auth.nuxtjs.org/schemes/local.html#options
	 */
	auth: {
		strategies: {
			local: {
				endpoints: {
					login: {
						url: 'auth/local',
						method: 'post',
						propertyName: 'jwt'
					},
					user: {
						url: 'users/me',
						method: 'get',
						propertyName: false
					},
					logout: false
				}
            },           
		}
	},


}
