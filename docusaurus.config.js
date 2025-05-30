// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'VALAWAI documentation',
	tagline: 'Towards Value-Aware AI',
	favicon: 'img/favicon.ico',
	url: 'https://VALAWAI.github.com',
	baseUrl: '/docs',
	organizationName: 'VALAWAI', // Usually your GitHub org/user name.
	projectName: 'docs', // Usually your repo name.
	deploymentBranch: 'gh-pages',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					routeBasePath: '/',
					sidebarPath: './sidebars.js',
					remarkPlugins: [remarkMath],
					rehypePlugins: [rehypeKatex],
				},
				theme: {
					customCss: './src/css/custom.css',
				},
			}),
		],
	],
	stylesheets: [
		{
			href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
			type: 'text/css',
			integrity:
				'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
			crossorigin: 'anonymous',
		},
	],
	themes: [
		'docusaurus-theme-github-codeblock'
	],
	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			// Replace with your project's social card
			image: 'img/docusaurus-social-card.jpg',
			navbar: {
				logo: {
					alt: 'VALAWAI Logo',
					src: 'img/logo.png',
				},
				items: [
					{
						position: 'left',
						to: '/introduction',
						label: 'Introduction',
					},
					{
						position: 'left',
						to: '/architecture',
						label: 'Architecture',
					},
					{
						position: 'left',
						to: '/use_cases',
						label: 'Use cases',
					},
					{
						position: 'left',
						to: '/components',
						label: 'Components',
					},
					{
						position: 'left',
						to: '/tutorials',
						label: 'Tutorials',
					},
					{
						position: 'left',
						to: '/demonstrations',
						label: 'Demonstrations',
					},
					{
						href: 'https://github.com/VALAWAI/docs',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Contents',
						items: [
							{
								label: 'Introduction',
								to: '/introduction',
							},
							{
								label: 'Architecture',
								to: '/architecture',
							},
							{
								label: 'Use cases',
								to: '/use_cases',
							},
							{
								label: 'Components',
								to: '/components',
							},
							{
								label: 'Tutorials',
								to: '/tutorials',
							},
							{
								label: 'Demonstrations',
								to: '/demonstrations',
							}
						],
					},
					{
						title: 'Acknowledgement',
						items: [
							{
								html: '<p>VALAWAI project is funded by the European Union under the European Innovation Council (EIC) research and innovation programme under Grant Agreement number 101070930.</p>'
							}, {
								html: '<img loading="lazy" decoding="async" class="alignleft wp-image-2239" src="img/EN-Funded-by-the-EU-NEG-325x217.png" alt="" width="300" height="63" srcset="https://valawai.eu/wp-content/uploads/2023/01/EN-Funded-by-the-EU-NEG-768x161.png 768w, https://valawai.eu/wp-content/uploads/2023/01/EN-Funded-by-the-EU-NEG-1536x322.png 1536w, https://valawai.eu/wp-content/uploads/2023/01/EN-Funded-by-the-EU-NEG-2048x430.png 2048w, https://valawai.eu/wp-content/uploads/2023/01/EN-Funded-by-the-EU-NEG-1280x269.png 1280w" sizes="(max-width: 300px) 100vw, 300px">'
							}
						]
					},
					{
						title: 'More',
						items: [
							{
								label: 'Project web page',
								href: 'https://valawai.eu/',
							},
							{
								label: 'Twitter',
								href: 'https://twitter.com/ValawaiEU',
							},
							{
								label: 'GitHub',
								href: 'https://github.com/VALAWAI',
							},
						],
					},
				],
				copyright: `Copyright © 2022-2026 VALAWAI.`,
			},
			prism: {
				theme: prismThemes.github,
				darkTheme: prismThemes.dracula,
				additionalLanguages: ['bash', 'java', 'json', 'properties', 'xml-doc','toml', 'docker'],
			},
			codeblock: {
				showGithubLink: true,
				githubLinkLabel: 'View on GitHub',
				showRunmeLink: false,
				runmeLinkLabel: 'Checkout via Runme'
			}
		}),
};

export default config;
