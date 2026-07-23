export const DEFAULT_CHUNK_SIZE = 1000;
export const DEFAULT_CHUNK_OVERLAP = 200;

/**
 * Order matters!
 * We always try to split using the highest semantic boundary first.
 */
export const SEPARATORS = [
  "\n\n", // paragraphs
  "\n",   // lines
  ". ",   // sentences
  "! ",
  "? ",
  "; ",
  ", ",
  " ",    // words
  "",     // characters (fallback)
];