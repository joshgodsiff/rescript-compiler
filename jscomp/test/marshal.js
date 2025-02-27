'use strict';

var Bytes = require("../../lib/js/bytes.js");
var Caml_external_polyfill = require("../../lib/js/caml_external_polyfill.js");

function to_buffer(buff, ofs, len, v, flags) {
  if (ofs < 0 || len < 0 || ofs > (buff.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Marshal.to_buffer: substring out of bounds",
          Error: new Error()
        };
  }
  return Caml_external_polyfill.resolve("caml_output_value_to_buffer")(buff, ofs, len, v, flags);
}

function data_size(buff, ofs) {
  if (ofs < 0 || ofs > (buff.length - 20 | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Marshal.data_size",
          Error: new Error()
        };
  }
  return Caml_external_polyfill.resolve("caml_marshal_data_size")(buff, ofs);
}

function total_size(buff, ofs) {
  return 20 + data_size(buff, ofs) | 0;
}

function from_bytes(buff, ofs) {
  if (ofs < 0 || ofs > (buff.length - 20 | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Marshal.from_bytes",
          Error: new Error()
        };
  }
  var len = Caml_external_polyfill.resolve("caml_marshal_data_size")(buff, ofs);
  if (ofs > (buff.length - (20 + len | 0) | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Marshal.from_bytes",
          Error: new Error()
        };
  }
  return Caml_external_polyfill.resolve("caml_input_value_from_string")(buff, ofs);
}

function from_string(buff, ofs) {
  return from_bytes(Bytes.unsafe_of_string(buff), ofs);
}

var header_size = 20;

exports.to_buffer = to_buffer;
exports.header_size = header_size;
exports.data_size = data_size;
exports.total_size = total_size;
exports.from_bytes = from_bytes;
exports.from_string = from_string;
/* No side effect */
