import {
  ZodIssueCode,
  ZodParsedType,
  defaultErrorMap,
  ZodErrorMap,
  z,
} from "zod";

const jsonStringifyReplacer = (_: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

function joinValues<T extends any[]>(array: T, separator = " | "): string {
  return array
    .map((val) => (typeof val === "string" ? `'${val}'` : val))
    .join(separator);
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) return false;
  }

  return true;
};

const zodErrorMessages = {
  errors: {
    invalid_type: "צפוי {{expected}}, קיבלנו {{received}}",
    invalid_type_received_undefined: "נדרש",
    invalid_literal: "ערך לא תקין, צפוי {{expected}}",
    unrecognized_keys: "מפתחות לא מזוהים באובייקט: {{- keys}}",
    invalid_union: "קלט לא תקין",
    invalid_union_discriminator: "ערך מזהה לא תקין. צפוי {{- options}}",
    invalid_enum_value:
      "ערך לא תקין לסוג enum. ציפיתי ל-{{- options}}, קיבלתי '{{received}}'",
    invalid_arguments: "פרמטרים לפונקציה לא תקינים",
    invalid_return_type: "סוג ההחזרה של הפונקציה לא תקין",
    invalid_date: "תאריך לא תקין",
    custom: "קלט לא תקין",
    invalid_intersection_types: "לא ניתן למזג את הסוגים",
    not_multiple_of: "המספר חייב להיות מכפלה של {{multipleOf}}",
    not_finite: "המספר חייב להיות סופי",
    invalid_string: {
      email: 'כתובת דוא"ל לא תקינה',
      url: "כתובת אינטרנט לא תקינה",
      uuid: "מזהה UUID לא תקין",
      // "email" | "datetime" | "url" | "emoji" | "uuid" | "regex" | "cuid" | "cuid2" | "ulid" | "ip"
      ip: "כתובת IPv4 לא תקינה",
      emoji: "אמוג'י לא תקין",
      cuid2: "מזהה CUID לא תקין",
      ulid: "מזהה ULID לא תקין",
      cuid: "מזהה CUID לא תקין",
      regex: "קלט לא תקין",
      datetime: "תאריך ושעה לא תקינים",
      startsWith: 'קלט לא תקין: חייב להתחיל ב-"{{startsWith}}"',
      endsWith: 'קלט לא תקין: חייב להסתיים ב-"{{endsWith}}"',
    },
    too_small: {
      array: {
        exact: "המערך חייב להכיל בדיוק {{minimum}} איברים",
        inclusive: "המערך חייב להכיל לפחות {{minimum}} איברים",
        not_inclusive: "המערך חייב להכיל יותר מ-{{minimum}} איברים",
      },
      string: {
        exact: "המחרוזת חייבת להכיל בדיוק {{minimum}} תווים",
        inclusive: "המחרוזת חייבת להכיל לפחות {{minimum}} תווים",
        not_inclusive: "המחרוזת חייבת להכיל מעל {{minimum}} תווים",
      },
      number: {
        exact: "המספר חייב להיות בדיוק {{minimum}}",
        inclusive: "המספר חייב להיות גדול או שווה ל-{{minimum}}",
        not_inclusive: "המספר חייב להיות גדול מ-{{minimum}}",
      },
      bigint: {
        exact: "המספר חייב להיות בדיוק {{maximum}}",
        inclusive: "המספר חייב להיות קטן או שווה ל-{{maximum}}",
        not_inclusive: "המספר חייב להיות קטן מ-{{maximum}}",
      },
      set: {
        exact: "קלט לא תקין",
        inclusive: "קלט לא תקין",
        not_inclusive: "קלט לא תקין",
      },
      date: {
        exact: "התאריך חייב להיות בדיוק {{- minimum, datetime}}",
        inclusive: "התאריך חייב להיות גדול או שווה ל-{{- minimum, datetime}}",
        not_inclusive: "התאריך חייב להיות גדול מ-{{- minimum, datetime}}",
      },
    },
    too_big: {
      array: {
        exact: "המערך חייב להכיל בדיוק {{maximum}} איברים",
        inclusive: "המערך חייב להכיל לכל היותר {{maximum}} איברים",
        not_inclusive: "המערך חייב להכיל פחות מ-{{maximum}} איברים",
      },
      string: {
        exact: "המחרוזת חייבת להכיל בדיוק {{maximum}} תווים",
        inclusive: "המחרוזת חייבת להכיל לכל היותר {{maximum}} תווים",
        not_inclusive: "המחרוזת חייבת להכיל פחות מ-{{maximum}} תווים",
      },
      bigint: {
        exact: "המספר חייב להיות בדיוק {{maximum}}",
        inclusive: "המספר חייב להיות קטן או שווה ל-{{maximum}}",
        not_inclusive: "המספר חייב להיות קטן מ-{{maximum}}",
      },
      number: {
        exact: "המספר חייב להיות בדיוק {{maximum}}",
        inclusive: "המספר חייב להיות קטן או שווה ל-{{maximum}}",
        not_inclusive: "המספר חייב להיות קטן מ-{{maximum}}",
      },
      set: {
        exact: "קלט לא תקין",
        inclusive: "קלט לא תקין",
        not_inclusive: "קלט לא תקין",
      },
      date: {
        exact: "התאריך חייב להיות בדיוק {{- maximum, datetime}}",
        inclusive: "התאריך חייב להיות קטן או שווה ל-{{- maximum, datetime}}",
        not_inclusive: "התאריך חייב להיות קטן מ-{{- maximum, datetime}}",
      },
    },
  },
  validations: {
    email: 'כתובת דוא"ל',
    url: "כתובת אינטרנט",
    uuid: "מזהה UUID",
    cuid: "מזהה CUID",
    cuid2: "מזהה CUID",
    // "email" | "datetime" | "url" | "emoji" | "uuid" | "regex" | "cuid" | "cuid2" | "ulid" | "ip"
    ipv4: "כתובת IPv4",
    ulid: "מזהה ULID",
    emoji: "אמוג'י",
    regex: "קלט רגולרי",
    datetime: "תאריך ושעה",
  },
  types: {
    function: "פונקציה",
    number: "מספר",
    string: "מחרוזת",
    nan: "NaN",
    integer: "מספר שלם",
    float: "מספר עשרוני",
    boolean: "בוליאני",
    date: "תאריך",
    bigint: "מספר גדול",
    undefined: "לא מוגדר",
    symbol: "סמל",
    null: "null",
    array: "מערך",
    object: "אובייקט",
    unknown: "לא ידוע",
    promise: "Promise",
    void: "void",
    never: "לעולם לא",
    map: "מפה",
    set: "סט",
  },
} as const;

export const zodErrorMap: ZodErrorMap = (issue, ctx) => {
  let message: string;
  message = defaultErrorMap(issue, ctx).message;

  const path = issue.path.length > 0 ? { path: issue.path.join(".") } : {};

  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = zodErrorMessages.errors.invalid_type_received_undefined;
      } else {
        message = zodErrorMessages.errors.invalid_type
          .replace("{{expected}}", zodErrorMessages.types[issue.expected])
          .replace("{{received}}", zodErrorMessages.types[issue.received]);
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = zodErrorMessages.errors.invalid_literal.replace(
        "{{expected}}",
        JSON.stringify(issue.expected, jsonStringifyReplacer),
      );
      break;

    case ZodIssueCode.unrecognized_keys:
      message = zodErrorMessages.errors.unrecognized_keys.replace(
        "{{keys}}",
        joinValues(issue.keys, ", "),
      );
      break;

    case ZodIssueCode.invalid_union:
      message = zodErrorMessages.errors.invalid_union;
      break;

    case ZodIssueCode.invalid_union_discriminator:
      message = zodErrorMessages.errors.invalid_union_discriminator.replace(
        "{{options}}",
        joinValues(issue.options),
      );
      break;

    case ZodIssueCode.invalid_enum_value:
      message = zodErrorMessages.errors.invalid_enum_value
        .replace("{{options}}", joinValues(issue.options))
        .replace("{{received}}", issue.received.toString());
      break;

    case ZodIssueCode.invalid_arguments:
      message = zodErrorMessages.errors.invalid_arguments;
      break;

    case ZodIssueCode.invalid_return_type:
      message = zodErrorMessages.errors.invalid_return_type;
      break;

    case ZodIssueCode.invalid_date:
      message = zodErrorMessages.errors.invalid_date;
      break;

    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("startsWith" in issue.validation) {
          message = zodErrorMessages.errors.invalid_string.startsWith.replace(
            "{{startsWith}}",
            issue.validation.startsWith,
          );
        } else if ("endsWith" in issue.validation) {
          message = zodErrorMessages.errors.invalid_string.endsWith.replace(
            "{{endsWith}}",
            issue.validation.endsWith,
          );
        }
      } else {
        message = zodErrorMessages.errors.invalid_string[issue.validation];
      }
      break;

    case ZodIssueCode.too_small:
      const minKey = issue.exact
        ? "exact"
        : issue.inclusive
        ? "inclusive"
        : "not_inclusive";
      message = zodErrorMessages.errors.too_small[issue.type][minKey].replace(
        "{{minimum}}",
        issue.minimum.toString(),
      );
      break;

    case ZodIssueCode.too_big:
      const maxKey = issue.exact
        ? "exact"
        : issue.inclusive
        ? "inclusive"
        : "not_inclusive";
      message = zodErrorMessages.errors.too_big[issue.type][maxKey].replace(
        "{{maximum}}",
        issue.maximum.toString(),
      );
      break;

    case ZodIssueCode.custom:
      // For custom errors, you might need a different approach since it's not standardized like other errors.
      // If 'issue.params?.i18n' contains a direct message, you could use it as below.
      message = issue.params?.i18n || zodErrorMessages.errors.custom;
      break;

    case ZodIssueCode.invalid_intersection_types:
      message = zodErrorMessages.errors.invalid_intersection_types;
      break;

    case ZodIssueCode.not_multiple_of:
      message = zodErrorMessages.errors.not_multiple_of.replace(
        "{{multipleOf}}",
        issue.multipleOf.toString(),
      );
      break;

    case ZodIssueCode.not_finite:
      message = zodErrorMessages.errors.not_finite;
      break;
  }

  return { message };
};
