"use strict";
/*
* File: promptBuilder.ts
*
* Copyright (c) 2022-2022 turtle85917
*
* Licensed under MIT License. Please see more defails in LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptBuilder = void 0;
/**
 * Create a prompt json.
 */
class PromptBuilder {
    row;
    /**
     * Initialization.
     */
    constructor() {
        this.row = { type: null, name: '' };
    }
    setType(value) {
        this.row.type = value;
        return this;
    }
    setName(value) {
        this.row.name = value;
        return this;
    }
    setMessage(value) {
        this.row.message = value;
        return this;
    }
    setInitial(value) {
        this.row.initial = value;
        return this;
    }
    setValidate(fn) {
        this.row.validate = fn;
        return this;
    }
    setChoices(value) {
        this.row.choices = value;
        return this;
    }
    toJSON() {
        if (this.row.name === '')
            throw new Error("Name is empty.");
        return this.row;
    }
}
exports.PromptBuilder = PromptBuilder;
//# sourceMappingURL=promptBuilder.js.map