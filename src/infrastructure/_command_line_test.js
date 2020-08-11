// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("../util/assert");
const CommandLine = require("./command_line");
const testHelper = require("../util/test_helper");
// dependency_analysis: ./_command_line_test_args_runner
// dependency_analysis: ./_command_line_test_null_output_runner
// dependency_analysis: ./_command_line_test_output_runner

describe("CommandLine", function() {

	it("provides command-line arguments", async function() {
		const args = [ "my arg 1", "my arg 2" ];
		const { stdout } = await testHelper.runModuleAsync(
			__dirname,
			"./_command_line_test_args_runner.js",
			{ args }
		);
		assert.equal(stdout, '["my arg 1","my arg 2"]');
	});

	it("writes to stdout and stderr", async function() {
		const { stdout, stderr } = await testHelper.runModuleAsync(
			__dirname,
			"./_command_line_test_output_runner.js",
			{ failOnStderr: false }
		);
		assert.equal(stdout, "my stdout", "stdout");
		assert.equal(stderr, "my stderr", "stderr");
	});

	it("tracks writes to stdout and stderr", function() {
		const commandLine = CommandLine.createNull();
		const stdout = commandLine.trackStdout();
		const stderr = commandLine.trackStderr();

		commandLine.writeStdout("my stdout");
		commandLine.writeStderr("my stderr");
		assert.deepEqual(stdout, [ "my stdout" ]);
		assert.deepEqual(stderr, [ "my stderr" ]);
	});


	describe("Nullability", function() {

		it("defaults to no arguments", function() {
			const commandLine = CommandLine.createNull();
			assert.deepEqual(commandLine.args(), []);
		});

		it("allows arguments to be configured", function() {
			const commandLine = CommandLine.createNull({ args: [ "one", "two" ]});
			assert.deepEqual(commandLine.args(), [ "one", "two" ]);
		});

		it("doesn't write output to command line", async function() {
			const { stdout, stderr } = await testHelper.runModuleAsync(
				__dirname,
				"./_command_line_test_null_output_runner.js",
				{ failOnStderr: false }
			);
			assert.equal(stdout, "", "stdout");
			assert.equal(stderr, "", "stderr");
		});

	});

});


