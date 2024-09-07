import pointer from "json-pointer";
import type { ListItem, Root, Text } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import rehypeStringify from "remark-stringify";
import { unified } from "unified";
import { EXIT, visit } from "unist-util-visit";

const getChildText = (node: ListItem) => {
  let text = "";
  visit(node, "text", function (node: Text) {
    text = node.value;
    return EXIT;
  });
  return text;
};

export const PARSERS = [
  {
    marker: "✅",
    type: "correct",
    detect: (node: ListItem, marker: string) => getChildText(node).startsWith(marker),
    clear: (text: string, marker: string) => text.replace(new RegExp(`^${marker}[\s ]?`), ""),
    apply: (text: string, marker: string) => `${marker} ${text}`,
  },
  {
    marker: "❌",
    type: "critical",
    detect: (node: ListItem, marker: string) => getChildText(node).startsWith(marker),
    clear: (text: string, marker: string) => text.replace(new RegExp(`^${marker}[\s ]?`), ""),
    apply: (text: string, marker: string) => `${marker} ${text}`,
  },
  {
    marker: "⚠️",
    type: "acceptable",
    detect: (node: ListItem, marker: string) => getChildText(node).startsWith(marker),
    clear: (text: string, marker: string) => text.replace(new RegExp(`^${marker}[\s ]?`), ""),
    apply: (text: string, marker: string) => `${marker} ${text}`,
  },
  {
    marker: "N/A",
    type: "not applicable",
    detect: (node: ListItem) => {
      // @ts-expect-error
      return node?.children?.[0].children?.[0].type === "delete";
    },
    clear: (_text: string, _marker: string, node: ListItem) => {
      // @ts-expect-error
      node.children[0].children[0] = node.children[0].children[0].children[0];
    },
    apply: (_text: string, _marker: string, node: ListItem) => {
      // @ts-expect-error
      node.children[0].children[0] = {
        type: "delete",
        children: [
          {
            type: "text",
            value: getChildText(node),
          },
        ],
      };
    },
  },
] as const;

export type Checkbox = ListItem & {
  path?: string;
  conclusion?: (typeof PARSERS)[number]["type"];
  comment?: string;
};

const parseCustomMarkers = function (node: Checkbox) {
  const text = getChildText(node);
  // check if list item contains one of the known custom markers
  for (const { marker, type, detect, clear } of PARSERS) {
    if (detect(node, marker)) {
      // @ts-expect-error
      node.children[0].children[0].value = clear(text, marker, node);
      // record as checked
      node.checked = true;
      // record conclusion type
      node.conclusion = type;
    }
  }
  // if checkbox is not custom
  if (node.checked === true && node.conclusion === undefined) {
    // make it default type ("correct")
    node.conclusion = PARSERS[0].type;
  }
};

const renderCustomMarkers = function (node: Checkbox) {
  if (node.conclusion === undefined) {
    return;
  }
  const text = getChildText(node);
  node.checked = null;
  const parser = PARSERS.find(c => c.type === node.conclusion);
  if (parser) {
    // @ts-expect-error
    node.children[0].children[0].value = parser.apply(text, parser.marker, node);
  }
};

export const parseMd = function (text: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(text);
  // console.log(JSON.stringify(tree, null, 2));
  // add json `path` property to every node
  visit(tree, function (node, index, parent) {
    // @ts-expect-error
    node.path = parent ? `${parent.path}/children/${index}` : "";
  });
  const currentCheckboxes: Checkbox[] = [];
  const defaultCheckboxes: Checkbox[] = [];
  visit(tree, "listItem", function (node: Checkbox) {
    parseCustomMarkers(node);
    // collect all checkboxes into one list
    if (node.checked !== null && node.checked !== undefined) {
      currentCheckboxes.push({ ...node });
      // remove all recorded states
      node.checked = false;
      node.conclusion = undefined;
      defaultCheckboxes.push({ ...node });
    }
  });
  return { tree, currentCheckboxes, defaultCheckboxes };
};

export const renderMd = function ({ tree, checkboxes }: { tree: Root; checkboxes: Checkbox[] }) {
  // apply modified checkboxes back to the md tree
  for (const checkbox of checkboxes) {
    // @ts-expect-error
    pointer.set(tree, `${checkbox.path}/conclusion`, checkbox.conclusion);
  }
  visit(tree, "listItem", renderCustomMarkers);
  return unified().use(remarkGfm).use(rehypeStringify).stringify(tree).replace(/^\n/gm, "");
};
