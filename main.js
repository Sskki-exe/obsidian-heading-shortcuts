/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => HeadingTogglerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/editorService.ts
var EditorService = class {
  getHeadingLevel(text) {
    const match = text.match(/^(#+)\s/);
    if (match) {
      return match[1].length;
    }
    return 0;
  }
  applyHeading(editor, line, level) {
    const oldLine = editor.getLine(line);
    const newLine = this._formatHeading(this._getHeadingText(oldLine), level);
    this._applyChange(editor, line, oldLine, newLine);
    const cursor = editor.getCursor();
    if (cursor.line === line && level !== 0 && cursor.ch < level + 1) {
      cursor.ch = level + 1;
      editor.setCursor(cursor);
    }
  }
  _getHeadingText(text) {
    return text.replace(/^(#+)\s/, "");
  }
  _formatHeading(text, level) {
    return level === 0 ? text : "#".repeat(level) + " " + text;
  }
  _applyChange(editor, line, oldLine, newLine) {
    if (oldLine === newLine) {
      return;
    }
    const cursor = editor.getCursor();
    editor.replaceRange(newLine, { line, ch: 0 }, { line, ch: oldLine.length });
    if (cursor.line === line) {
      cursor.ch += newLine.length - oldLine.length;
      cursor.ch = Math.max(0, cursor.ch);
      cursor.ch = Math.min(cursor.ch, newLine.length);
      editor.setCursor(cursor);
    }
  }
};

// src/main.ts
var HeadingTogglerPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.editorService = new EditorService();
    this.addCommand({
      id: "increase-heading-level",
      name: "Promote Heading (text ← H1 ← H6)",
      hotkeys: [{ modifiers: ["Mod"], key: "[" }],
      editorCallback: (editor) => this.increaseHeadingLevel(editor)
    });
    this.addCommand({
      id: "decrease-heading-level",
      name: "Demote Heading (text → H1 → H6)",
      hotkeys: [{ modifiers: ["Mod"], key: "]" }],
      editorCallback: (editor) => this.decreaseHeadingLevel(editor)
    });
    this.addCommand({
      id: "remove-heading-level",
      name: "Remove Heading (→ text)",
      hotkeys: [{ modifiers: ["Mod","Shift"], key: "]" }],
      editorCallback: (editor) => this.removeHeadingLevel(editor)
    });
  }
  increaseHeadingLevel(editor) {
    const line = editor.getCursor().line;
    const level = this.editorService.getHeadingLevel(editor.getLine(line));
    if (level == 0) {
      return;
    }
    const targetLevel = level === 0 ? 6 : level - 1;
    this.editorService.applyHeading(editor, line, targetLevel);
  }
  decreaseHeadingLevel(editor) {
    const line = editor.getCursor().line;
    const level = this.editorService.getHeadingLevel(editor.getLine(line));
    const targetLevel = level === 6 ? 6 : level + 1;
    this.editorService.applyHeading(editor, line, targetLevel);
  }
  removeHeadingLevel(editor) {
    const line = editor.getCursor().line;
    const level = this.editorService.getHeadingLevel(editor.getLine(line));
    const targetLevel = 0;
    this.editorService.applyHeading(editor, line, targetLevel);
  }
};
