import { parse, render } from "./md-parser";
import { describe, expect, test } from "vitest";

const EXAMPLE_MD_INPUT = `Any kind of md document, with any kind of content, lists and checklists
- [ ] Checklist item 1
* [ ] Checklist item 2
- ~~Crossed list item~~
- [ ] ~~Crossed checklist item~~
  - [ ] Nested checklist inside checklist
    - Nested list inside checklist
      - [ ] Etc
- List
  - [x] Already interacted checklist item
  - ✅ Another already interacted checklist item
  - ❌ Already marked as critical
  - ⚠️ Already marked as acceptable
`;

const EXPECTED_MD_TEMPLATE = `Any kind of md document, with any kind of content, lists and checklists
* [ ] Checklist item 1
- [ ] Checklist item 2
* [ ] Crossed list item
* [ ] Crossed checklist item
  * [ ] Nested checklist inside checklist
    * Nested list inside checklist
      * [ ] Etc
* List
  * [ ] Already interacted checklist item
  * [ ] Another already interacted checklist item
  * [ ] Already marked as critical
  * [ ] Already marked as acceptable
`;

const EXPECTED_MD_RENDER = `Any kind of md document, with any kind of content, lists and checklists
* ✅ Checklist item 1
- [ ] Checklist item 2
* ~~Crossed list item~~
* ~~Crossed checklist item~~
  * [ ] Nested checklist inside checklist
    * Nested list inside checklist
      * [ ] Etc
* List
  * ✅ Already interacted checklist item
  * ✅ Another already interacted checklist item
  * ❌ Already marked as critical
  * ⚠️ Already marked as acceptable
`;

describe("md-parser", async () => {
  const { tree, checkboxes } = await parse(EXAMPLE_MD_INPUT);

  test("correctly clears up the checklist (against EXPECTED_MD_TEMPLATE)", async () => {
    expect(tree).toBeTruthy();
    const renderedEmpty = await render({ tree, checkboxes: [] });
    expect(renderedEmpty).toEqual(EXPECTED_MD_TEMPLATE);
  });

  test("correctly applies custom checkboxes (against EXPECTED_MD_RENDER)", async () => {
    checkboxes[0].conclusion = "correct";
    const renderedWithChecks = await render({ tree, checkboxes });
    expect(renderedWithChecks).toEqual(EXPECTED_MD_RENDER);
  });
});

// TODO
// + parse the checklist
// + get list of checklists
// + add uniuqe id to every checklist item (`path`)
// + get vaues of the checklists
// + support more check types
// + support "not applicable" type
// - extract comments of the checklists
// - provide html rendering function?
// - mark checklists and non-checklists by different css classes
