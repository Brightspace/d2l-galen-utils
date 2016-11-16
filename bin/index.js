#!/usr/bin/env node
'use strict';

const spawn = require('child_process').spawn;
const path = require('path');

function run(argv, config, test, entrypoint) {
	let args = [
		'test',
		entrypoint,
		`-Dd2l.galen.utils.config=${config}`,
		`-Dd2l.galen.utils.test=${test}`
	];
	argv.dumpsDir && args.push('-Dd2l.galen.utils.dumps=' + argv.dumpsDir);
	args = args.concat(argv._.slice(1));

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
	.alias('c', 'command')
	.describe('c', 'command to run galen')
	.default('c', 'galen')
	.global('c')
	.command('test <config>', 'Run D2L Galen tests', {
		entrypoint: {
			alias: 'e',
			default: require.resolve('../galen/entrypoint.test')
		},
		test: {
			alias: 't',
			default: require.resolve('../galen/check.js')
		}
	}, (argv) => {
		const configPath = path.resolve(process.cwd(), argv.config);
		const testPath = path.resolve(process.cwd(), argv.test);
		run(argv, configPath, testPath, argv.entrypoint);
	})
	.command('dump <config>', 'Create dump', {
		dumpsDir: {
			alias: 'd',
			default: 'dumps'
		}
	}, (argv) => {
		const configPath = path.resolve(process.cwd(), argv.config);
		const testPath = require.resolve('../galen/dump.js');
		run(argv, configPath, testPath, require.resolve('../galen/entrypoint.test'));
	})
	.strict()
	.demand(1)
	.help()
	.argv;