import * as prompts from "prompts";

/**
 * 자주 쓰이는 값만 있습니다.
 */
export default class PromptBuilder<T extends string> {
  row: prompts.PromptObject;

  constructor() {
    this.row = { type: null, name: '' };
  }

  setType(value: prompts.PromptType | prompts.Falsy | ((value: T) => (prompts.PromptType | prompts.Falsy))) {
    this.row.type = value;
    return this;
  }

  setName(value: string) {
    this.row.name = value;
    return this;
  }

  setMessage(value: prompts.ValueOrFunc<string>) {
    this.row.message = value;
    return this;
  }

  setInitial(value: prompts.InitialReturnValue | prompts.PrevCaller<string, prompts.InitialReturnValue | Promise<prompts.InitialReturnValue>>) {
    this.row.initial = value;
    return this;
  }

  setValidate(fn: prompts.PrevCaller<string, boolean | string | Promise<boolean | string>>) {
    this.row.validate = fn;
    return this;
  }

  setChoices(value: prompts.Choice[] | prompts.PrevCaller<string, prompts.Choice[] | prompts.Falsy>) {
    this.row.choices = value;
    return this;
  }

  toJSON() {
    if (this.row.name === '') throw new Error("Name is empty.");
    return this.row;
  }
}
