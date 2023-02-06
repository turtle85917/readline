import * as prompts from "prompts";
/**
 * Create a prompt json.
 */
export declare class PromptBuilder<T extends string> {
    private row;
    /**
     * Initialization.
     */
    constructor();
    setType(value: prompts.PromptType | prompts.Falsy | ((value: T) => (prompts.PromptType | prompts.Falsy))): this;
    setName(value: string): this;
    setMessage(value: prompts.ValueOrFunc<string>): this;
    setInitial(value: prompts.InitialReturnValue | prompts.PrevCaller<string, prompts.InitialReturnValue | Promise<prompts.InitialReturnValue>>): this;
    setValidate(fn: prompts.PrevCaller<string, boolean | string | Promise<boolean | string>>): this;
    setChoices(value: prompts.Choice[] | prompts.PrevCaller<string, prompts.Choice[] | prompts.Falsy>): this;
    toJSON(): prompts.PromptObject<string>;
}
