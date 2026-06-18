/**
 * Custom ESLint rules for safe, i18n-aware regex usage.
 *
 * Based on project conventions:
 * ✅ ALLOWED: validation, normalization, masking, simple extraction
 * ❌ BANNED: parsing HTML, XML, JSON, URLs, dates, SQL via regex
 *
 * i18n rules:
 * - Always use /u flag for user-input regex
 * - Use \p{L} instead of \w for names/text
 * - Use [0-9] instead of \d for strict digit matching
 */

/** @type {import('eslint').Rule.RuleModule} */
const requireUnicodeFlag = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Require /u flag on regex literals that use \\w, \\d, \\s or character classes, to ensure correct Unicode handling in i18n contexts.',
      recommended: true,
    },
    schema: [],
    messages: {
      missingUFlag:
        'Add the /u flag to this regex for correct Unicode/i18n behavior. ' +
        '\\w does not match Cyrillic, umlauts, or CJK characters.',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (!(node.value instanceof RegExp)) return;
        const { flags, source } = node.value;
        if (flags.includes('u') || flags.includes('v')) return; // already unicode
        // Trigger only when the pattern uses \w, \d, \s, or [...] character classes
        const needsUnicode = /\\[wWdDsS]/.test(source) || /\[/.test(source);
        if (!needsUnicode) return;
        context.report({
          node,
          messageId: 'missingUFlag',
          fix(fixer) {
            const raw = node.raw ?? '';
            // raw looks like /pattern/flags — insert u after last /
            const lastSlash = raw.lastIndexOf('/');
            return fixer.insertTextAfterRange(
              [node.range[0] + lastSlash, node.range[1]],
              'u'
            );
          },
        });
      },
    };
  },
};

/** @type {import('eslint').Rule.RuleModule} */
const noRegexForStructuredData = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow using regex to parse structured data formats (HTML, XML, JSON, URLs, dates). ' +
        'Use proper parsers instead: DOMParser, JSON.parse, new URL(), date-fns.',
      recommended: true,
    },
    schema: [],
    messages: {
      noHtmlRegex:
        'Do not parse HTML with regex. Use DOMParser or a library like cheerio.',
      noXmlRegex:
        'Do not parse XML with regex. Use DOMParser or xml2js.',
      noJsonRegex:
        'Do not extract JSON values with regex. Use JSON.parse().',
      noUrlRegex:
        'Do not parse URLs with regex. Use `new URL(str)` — it handles ports, IPv6, query params correctly.',
      noDateRegex:
        'Avoid parsing dates with regex. Use Intl.DateTimeFormat, date-fns, or dayjs for locale-aware parsing.',
      noSqlRegex:
        'Do not parse SQL with regex. SQL has nested quotes and escaping that regex cannot handle.',
    },
  },
  create(context) {
    // Patterns that strongly suggest the developer is parsing structured data
    const htmlPattern = /<\s*[a-zA-Z]/; // starts an HTML tag
    const xmlPattern = /<\?xml|<\/[a-zA-Z]/; // XML declaration or closing tag
    const jsonPattern = /^\{|^\[|":\s*["{[]/; // JSON object/array start
    const urlPattern = /https?:\/\/|:\/\//; // protocol
    const datePattern = /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/; // ISO or US date
    const sqlPattern = /SELECT\s+|INSERT\s+INTO|UPDATE\s+SET/i;

    return {
      Literal(node) {
        if (!(node.value instanceof RegExp)) return;
        const src = node.value.source;

        if (htmlPattern.test(src) && src.includes('</')) {
          return context.report({ node, messageId: 'noHtmlRegex' });
        }
        if (xmlPattern.test(src)) {
          return context.report({ node, messageId: 'noXmlRegex' });
        }
        if (jsonPattern.test(src) && src.includes('":')) {
          return context.report({ node, messageId: 'noJsonRegex' });
        }
        if (urlPattern.test(src) && src.includes('\\?')) {
          return context.report({ node, messageId: 'noUrlRegex' });
        }
        if (datePattern.test(src) && src.length > 20) {
          return context.report({ node, messageId: 'noDateRegex' });
        }
        if (sqlPattern.test(src)) {
          return context.report({ node, messageId: 'noSqlRegex' });
        }
      },
    };
  },
};

/** @type {import('eslint').Rule.RuleModule} */
const preferUnicodePropertyEscapes = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'In i18n contexts, prefer Unicode property escapes (\\p{L}, \\p{N}) over \\w and \\d ' +
        'when the regex has the /u flag. \\w only matches [A-Za-z0-9_] and misses Cyrillic, umlauts, CJK.',
      recommended: false, // warn-only by default
    },
    schema: [],
    messages: {
      preferPL:
        '\\w does not match non-Latin letters (Cyrillic, umlauts, CJK). ' +
        'Use \\p{L} or \\p{L}\\p{N} with the /u flag for i18n-safe matching.',
      preferPN:
        '\\d matches non-Arabic digits in some engines. ' +
        'Use [0-9] for strict ASCII digit matching, or \\p{N} for all Unicode digits.',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (!(node.value instanceof RegExp)) return;
        const { flags, source } = node.value;
        if (!flags.includes('u') && !flags.includes('v')) return; // only check unicode-flagged patterns

        if (/\\w/.test(source)) {
          context.report({ node, messageId: 'preferPL' });
        }
        if (/\\d/.test(source)) {
          context.report({ node, messageId: 'preferPN' });
        }
      },
    };
  },
};

/** @type {import('eslint').Rule.RuleModule} */
const noBacktrackingRegex = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Warn on regex patterns with potentially catastrophic backtracking (nested quantifiers). ' +
        'These can cause ReDoS (Regular Expression Denial of Service) vulnerabilities.',
    },
    schema: [],
    messages: {
      catastrophicBacktracking:
        'This regex contains nested quantifiers like (a+)+ or (a|aa)+ which can cause ' +
        'catastrophic backtracking (ReDoS). Rewrite using atomic groups, possessive quantifiers, ' +
        'or a dedicated parser.',
    },
  },
  create(context) {
    // Detect patterns like (X+)+ or (X*)* or (X|XX)+
    const dangerousPattern = /\([^)]*[+*][^)]*\)[+*]/;

    return {
      Literal(node) {
        if (!(node.value instanceof RegExp)) return;
        if (dangerousPattern.test(node.value.source)) {
          context.report({ node, messageId: 'catastrophicBacktracking' });
        }
      },
    };
  },
};

/** @type {Record<string, import('eslint').Rule.RuleModule>} */
export const regexRules = {
  'require-unicode-flag': requireUnicodeFlag,
  'no-regex-for-structured-data': noRegexForStructuredData,
  'prefer-unicode-property-escapes': preferUnicodePropertyEscapes,
  'no-backtracking-regex': noBacktrackingRegex,
};
