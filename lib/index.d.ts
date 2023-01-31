/// <reference types="node" />
import * as prompts from "prompts";
import * as readline from "node:readline";
import PromptBuilder from "./promptBuilder";
export default class Readline {
    prompt?: string;
    rline: readline.Interface;
    private autoFoucs;
    private listener;
    private processing;
    /**
     * 초기화
     */
    constructor();
    /**
     * 사용자와의 상호작용을 사용하기 위함.
     *
     * @param prompt 배열
     */
    processPrompts<T extends string, U extends Record<T, any | undefined>>(promptObjects: PromptBuilder<T>[], callback: (response: U, objects: prompts.PromptObject<T>) => void): Promise<U>;
    /**
     * 입력이 완료되었을 때 리스너 호출.
     *
     * @param listener 입력이 완료되어 Enter 키를 눌렀을 때 호출
     */
    addInputListener(listener: (...args: string[]) => void): this;
    /**
     * 프로세스가 죽었을 때 리스너 호출. `Ctrl + C` / `Ctrl + D`(*지원 안되는 경우, 무시됨*)을 눌렀을 때 프로세스 종료.
     *
     * @param listener 프로세스가 죽었을 때 호출.
     */
    addCloseListener(listener: (code: number) => void): void;
    /**
     * 사용자의 입력이 완료되었을 때 자동 스크롤을 내릴지 여부 값을 지정.
     *
     * @param value 자동 스크롤 여부 값
     */
    setAutoFocus(value: boolean): void;
    /**
     * 사용자의 입력을 기다릴 때 출력될 prompt를 지정.
     *
     * @param value prompt 값
     */
    setPrompt(value?: string): void;
    /**
     * 터미널의 스크롤을 터미널의 최근 출력된 값에 맞춰 조정.
     */
    clearScreen(value?: boolean): void;
}
