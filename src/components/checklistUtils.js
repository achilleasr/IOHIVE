/**
 * Helpers for working with BEEP's category tree, shared by the checklist
 * manager and the dynamic inspection form.
 *
 * A category node looks like:
 *   { id, name, type, input, trans: { en, nl, ... }, description, source, children: [...] }
 *
 * Top-level nodes with input === 'label' are SECTION HEADERS (Colony, Food,
 * Production, Weather, ...). Their `children` are the actual inputs. Inputs can
 * themselves nest (a boolean with children shown when it's "Yes", a list with
 * list_item children).
 */

const LANG = "en";

/** Human label for a node, falling back through trans -> name. */
export function label(node) {
  if (!node) return "";
  if (node.trans && node.trans[LANG]) return node.trans[LANG];
  if (node.trans && node.trans.nl) return node.trans.nl;
  // prettify the snake_case machine name as a last resort
  return (node.name || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Section headers are the top-level grouping rows. */
export function isSection(node) {
  return (
    node?.input === "label" &&
    Array.isArray(node.children) &&
    node.children.length > 0
  );
}

/**
 * Which UI control a node's `input` maps to in our renderer.
 * Mirrors beep-vue-app's checklist-input switch, collapsed to what we support.
 */
export function controlFor(input) {
  switch (input) {
    case "boolean":
    case "boolean_yes_red":
    case "list_item":
      return "boolean";
    case "smileys_3":
      return "smileys";
    case "score":
      return "stars";
    case "text":
      return "text";
    case "date":
      return "date";
    case "list":
      return "checklist"; // multi-select of list_item children
    case "options":
      return "radio"; // single-select of children, stores child id
    case "select":
      return "select"; // single-select dropdown, stores child id
    case "number":
    case "number_0_decimals":
    case "number_negative":
    case "number_positive":
      return "number";
    case "number_1_decimals":
      return "number1";
    case "number_2_decimals":
      return "number2";
    case "number_3_decimals":
      return "number3";
    case "number_degrees":
    case "number_percentage":
    case "grade":
    case "slider":
    case "score_amount":
    case "score_quality":
      return "slider";
    case "label":
      return "label";
    default:
      return "number"; // safe fallback
  }
}

/** Step for numeric controls. */
export function stepFor(control) {
  if (control === "number1") return 0.1;
  if (control === "number2") return 0.01;
  if (control === "number3") return 0.001;
  return 1;
}

/** Slider bounds by input type (degrees/percentage/grade differ). */
export function sliderRange(input) {
  if (input === "number_percentage") return { min: 0, max: 100 };
  if (input === "number_degrees") return { min: -20, max: 50 };
  if (input === "grade" || input === "slider") return { min: 0, max: 10 };
  return { min: 0, max: 10 };
}

/**
 * Build a renderable structure from a checklist's `categories` tree.
 *
 * The tree is genuinely recursive: a section (input 'label') has children that
 * are either real inputs OR further sub-sections (also 'label'). BEEP renders
 * this with a recursive fieldset. We mirror that by producing a flat list of
 * sections, where nested sub-sections are hoisted into their own section with a
 * `depth` so the form can indent them. Every renderable input ends up under
 * exactly one section, so nothing is dropped.
 *
 * Returns: [ { id, label, depth, items: [inputNode, ...] }, ... ]
 */
export function flattenSections(categories) {
  if (!Array.isArray(categories)) return [];
  const out = [];

  const visit = (nodes, depth, inheritedSection) => {
    // Inputs that belong directly to the current section (not sub-labels)
    const directItems = [];
    const subSections = [];

    for (const node of nodes || []) {
      if (!node) continue;
      if (
        node.input === "label" &&
        Array.isArray(node.children) &&
        node.children.length
      ) {
        subSections.push(node);
      } else if (node.input && node.input !== "label") {
        directItems.push(node);
      }
    }

    if (directItems.length) {
      out.push({
        id: inheritedSection?.id ?? "_loose",
        label: inheritedSection ? label(inheritedSection) : "General",
        depth,
        items: directItems,
      });
    }
    for (const sub of subSections) {
      visit(sub.children, inheritedSection ? depth + 1 : depth, sub);
    }
  };

  // Top level: each top node is normally a section (label). Non-label top nodes
  // get bucketed under a synthetic "General" section.
  const topSections = categories.filter((c) => isSection(c));
  const topLoose = categories.filter(
    (c) => c && c.input && c.input !== "label",
  );

  if (topLoose.length) {
    out.push({ id: "_general", label: "General", depth: 0, items: topLoose });
  }
  for (const section of topSections) {
    visit(section.children, 0, section);
  }
  return out.filter((g) => g.items.length > 0);
}

/**
 * @deprecated kept for compatibility; prefer flattenSections.
 * Returns [{ section, items }] one level deep.
 */
export function groupedInputs(categories) {
  return flattenSections(categories).map((g) => ({
    section: { id: g.id, trans: { en: g.label }, name: g.label },
    items: g.items,
  }));
}

/**
 * Coerce a raw form value to what BEEP expects for the items map.
 * Booleans/smileys/grades are numbers; lists are comma strings of selected ids; text stays string.
 */
export function coerceValue(input, value) {
  if (value == null || value === "") return null;
  const numericInputs = [
    "boolean",
    "boolean_yes_red",
    "list_item",
    "smileys_3",
    "score",
    "grade",
    "slider",
    "number",
    "number_0_decimals",
    "number_1_decimals",
    "number_2_decimals",
    "number_3_decimals",
    "number_negative",
    "number_positive",
    "number_degrees",
    "number_percentage",
    "score_amount",
    "score_quality",
    "options",
    "select",
  ];
  if (numericInputs.includes(input)) {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
  if (Array.isArray(value)) return value.length ? value.join(",") : null;
  return value;
}
