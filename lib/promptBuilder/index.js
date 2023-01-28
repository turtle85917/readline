"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 자주 쓰이는 값만 있습니다.
 */
class PromptBuilder {
    row;
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
exports.default = PromptBuilder;
//# sourceMappingURL=index.js.map