require("dotenv").config();

export default {
	vue: {
		config: {
			productionTip: true,
			devtools: false,
			performance: true
		}
	},

	target: 'server',

	head: {
		htmlAttrs:  {
			lang: "ar",
			dir: "rtl"
		},
	  
		title: 'إضحك لين تفطس',
		titleTemplate: '%s | فطسني',
		meta: [{charset: 'utf-8'}, { name: 'viewport', content: 'width=device-width, initial-scale=1'},{
				hid: 'description', name: 'description', content: ''}],
		link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
			{rel: 'apple-touch-icon',sizes: "180x180", type: 'image/x-icon', href: '/assets/img/icons/apple-touch-icon.png'},
			{rel: 'icon', sizes:"32x32", type: 'image/png', href: '/assets/img/icons/favicon-32x32.png'},
			{rel: 'icon', sizes:"16x16", type: 'image/png', href: '/assets/img/icons/favicon-16x16.png'},
			{rel: 'manifest',  href: '/assets/img/icons/site.webmanifest'},
            { rel: 'stylesheet', href: 'https://pro.fontawesome.com/releases/v5.15.1/css/all.css'}, //add for example your Google Fonts link here
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300'},
            { rel: 'stylesheet', href: '//fonts.googleapis.com/earlyaccess/notonaskharabic.css'},
        ]
	},

	css: [
		'@/assets/css/main.scss'
	],

	plugins: [
        '~/plugins/vue-observe-visibility.client',
		'~/plugins/meilisearch',
        '~/plugins/f6snypi',
		'~/plugins/bootstrap.client'
	],

    components: true,

	buildModules: [
		[
			'@nuxtjs/moment', {
				locales: ['ar'],
				defaultLocale: 'ar',
				timezone: true,
				plugins: [
					'moment-transform',
				]
			}
		],
		'@nuxt/components'
	],

	modules: [
		'bootstrap-vue/nuxt',
		'@nuxtjs/axios',
		'@nuxtjs/dotenv',
        '@nuxtjs/auth',
        '@nuxtjs/markdownit'
    ],
    markdownit: {
        injected: true
      },
    
	axios: {
        baseURL: process.env.API_AUTH_URL,
        withCredentials: true
	},

	build: {},

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
