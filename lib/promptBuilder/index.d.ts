import * as prompts from "prompts";
/**
 * 자주 쓰이는 값만 있습니다.
 */
export default class PromptBuilder<T extends string> {
    row: prompts.PromptObject;
    constructor();
    setType(value: prompts.PromptType | prompts.Falsy | ((value: T) => (prompts.PromptType | prompts.Falsy))): this;
    setName(value: string): this;
    setMessage(value: prompts.ValueOrFunc<string>): this;
    setInitial(value: prompts.InitialReturnValue | prompts.PrevCaller<string, prompts.InitialReturnValue | Promise<prompts.InitialReturnValue>>): this;
    setValidate(fn: prompts.PrevCaller<string, boolean | string | Promise<boolean | string>>): this;
    setChoices(value: prompts.Choice[] | prompts.PrevCaller<string, prompts.Choice[] | prompts.Falsy>): this;
    toJSON(): prompts.PromptObject<string>;
}
