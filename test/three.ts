import { TextStyle } from "./enum/TextStyle";
import { ansiFrame } from "./utils/ansiFrame";

process.stdout.write([
  ansiFrame('████', TextStyle.F_CYAN),
  `${ansiFrame('████', TextStyle.F_CYAN)}┌─ ${ansiFrame("콘서티", TextStyle.F_MAGENTA)} ────────────────────────┐`,
  '  └─┤  야옹...                        │',
  `    └────────────────────────── ${ansiFrame('Q', TextStyle.F_RED, TextStyle.UNDERSCORE)}${ansiFrame('uit', TextStyle.F_RED)} ─┘`,
  `      (${ansiFrame("▶", TextStyle.F_BLUE, TextStyle.UNDERSCORE)}) 착한 고양이구나`,
  `      ( ) 츄르 줄까?`,
  `      ( ) 으으악!!!`
].join('\n'));
