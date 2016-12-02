#!/usr/bin/env node
'use strict';

const spawn = require('child_process').spawn;
const path = require('path');

function copyEnv(envs) {
	return envs.map(function(env) {
		const value = process.env[env] || '';
		return `-Dd2l.galen.utils.env.${env}=${value}`;
	});
}

function run(argv, config, entrypoint) {
	let args = [
		'test',
		entrypoint,
		`-Dd2l.galen.utils.config=${config}`
	];
	argv.reportDir && args.push('--htmlreport', argv.reportDir);
	argv.dumpsDir && args.push('-Dd2l.galen.utils.dumps=' + argv.dumpsDir);
	argv.groups && args.push('--groups', argv.groups);
	args = args.concat(copyEnv(argv.includeEnv), argv._.slice(1));

	const command = [];
	const re = /("(.*?)"|'(.*?)'|([^"'\s]+))+(?=\s*|\s*$)/g;
	let match;
	while ((match = re.exec(argv.command))) {
		command.push(match[2] || match[3] || match[4]);
	}
	args = command.splice(1).concat(args);

	spawn(command[0], args, {
		stdio: 'inherit'
	})
		.on('error', (error) => {
			console.error(error); // eslint-disable-line no-console
			process.exit(1);
		})
		.on('exit', (code) => process.exit(code));
}

require('yargs')
	.usage('$0 <cmd> [args]')
	.describe('c', 'command to run galen')
	.default('c', 'galen')
	.alias('c', 'command')
	.global('c')
	.describe('i', 'include space separated list of environment variables as System Properties under d2l.galen.utils.env.*')
	.alias('i', 'include-env')
	.global('i')
	.array('i')
	.default('i', [])
	.describe('g', 'comma separated list of groups to run')
	.alias('g', 'groups')
	.global('g')
	.command('test <config>', 'Run D2L Galen tests', {
		entrypoint: {
			alias: 'e',
			default: require.resolve('../galen/entrypoint.test')
		},
		reportDir: {
			alias: 'r',
			default: 'reports'
		}
	}, (argv) => {
		const configPath = path.resolve(process.cwd(), argv.config);
		run(argv, configPath, argv.entrypoint);
	})
	.command('dump <config>', 'Create dump', {
		dumpsDir: {
			alias: 'd',
			default: 'dumps'
		}
	}, (argv) => {
		const configPath = path.resolve(process.cwd(), argv.config);
		run(argv, configPath, require.resolve('../galen/entrypoint.test'));
	})
	.strict()
	.demand(1)
	.help()
	.argv;
