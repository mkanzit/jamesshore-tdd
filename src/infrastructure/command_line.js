// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("../util/ensure");
const EventEmitter = require("events");
const infrastructureHelper = require("../util/infrastructure_helper");

const STDOUT_EVENT = "stdout";
const STDERR_EVENT = "stderr";

/** Wrapper for command-line processing */
module.exports = class CommandLine {

	static create() {
		ensure.signature(arguments, []);
		return new CommandLine(process);
	}

	static createNull({ args = [] } = {}) {
		ensure.signature(arguments, [[ undefined, { args: Array } ]]);
		return new CommandLine(new NullProcess(args));
	}

	constructor(proc) {
		this._process = proc;
		this._emitter = new EventEmitter();
	}

	args() {
		ensure.signature(arguments, []);
		return this._process.argv.slice(2);
	}

	writeStdout(text) {
		ensure.signature(arguments, [ String ]);
		this._process.stdout.write(text);
		this._emitter.emit(STDOUT_EVENT, text);
	}

	writeStderr(text) {
		ensure.signature(arguments, [ String ]);
		this._process.stderr.write(text);
		this._emitter.emit(STDERR_EVENT, text);
	}

	trackStdout() {
		return infrastructureHelper.trackOutput(this._emitter, STDOUT_EVENT);
	}

	trackStderr() {
		return infrastructureHelper.trackOutput(this._emitter, STDERR_EVENT);
	}

};

class NullProcess {

	constructor(args) {
		this._args = args;
	}

	get argv() {
		return [ "null_process_node", "null_process_script.js", ...this._args ];
	}

	get stdout() {
		return {
			write() {}
		};
	}

	get stderr() {
		return {
			write() {}
		};
	}

}