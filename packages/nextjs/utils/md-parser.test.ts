import { parse } from "./md-parser";
import { expect, test } from "vitest";

const exampleMdInput = `
    Any kind of md document, with any kind of content, lists and checklists
    - [ ] Checklist item 1
    * [ ] Checklist item 2
      - [ ] Nested checklist inside checklist
        - Nested list inside checklist
          - [ ] Etc
    - List
      - [ ] Nested checklist inside list
      - [x] Already interacted checklist item
      - ✅ Another already interacted checklist item
`;

test("md-parser", () => {
  expect(parse(exampleMdInput)).toBeTruthy();
});
