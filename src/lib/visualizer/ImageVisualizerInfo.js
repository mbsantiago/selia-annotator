const NAME = 'Visualizador de imagenes SELIA';
const VERSION = '1.0';
const DESCRIPTION = 'Visualizador web que usa el contexto 2d' +
  ' de un canvas HTML5 para presentar imagenes png/jpg';
const CONFIGURATION_SCHEMA = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "title": "The Root Schema",
  "required": [
    "transformMatrix"
  ],
  "properties": {
    "transformMatrix": {
      "$id": "#/properties/transformMatrix",
      "type": "object",
      "title": "The Transformmatrix Schema",
      "required": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
      ],
      "properties": {
        "a": {
          "$id": "#/properties/transformMatrix/properties/a",
          "type": "number",
          "title": "The A Schema",
          "default": 0,
          "examples": [
            1
          ]
        },
        "b": {
          "$id": "#/properties/transformMatrix/properties/b",
          "type": "number",
          "title": "The B Schema",
          "default": 0,
          "examples": [
            0
          ]
        },
        "c": {
          "$id": "#/properties/transformMatrix/properties/c",
          "type": "number",
          "title": "The C Schema",
          "default": 0,
          "examples": [
            0
          ]
        },
        "d": {
          "$id": "#/properties/transformMatrix/properties/d",
          "type": "number",
          "title": "The D Schema",
          "default": 0,
          "examples": [
            1
          ]
        },
        "e": {
          "$id": "#/properties/transformMatrix/properties/e",
          "type": "number",
          "title": "The E Schema",
          "default": 0,
          "examples": [
            0
          ]
        },
        "f": {
          "$id": "#/properties/transformMatrix/properties/f",
          "type": "number",
          "title": "The F Schema",
          "default": 0,
          "examples": [
            0
          ]
        }
      }
    }
  }
}

export {
  NAME,
  VERSION,
  DESCRIPTION,
  CONFIGURATION_SCHEMA
}
