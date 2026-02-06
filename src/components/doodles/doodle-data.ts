import { DoodleDef } from "@/types";

export const DOODLE_COUNT = 50;

// Hand-drawn style SVG doodles - simple line art with organic curves
// All use a 100x100 viewBox for consistency
export const doodles: DoodleDef[] = [
  // === FLOWERS (1-12) ===
  {
    id: 1,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Stem
      "M50 95 Q48 75 50 60 Q52 50 50 45",
      // Petals (5-petal flower)
      "M50 35 Q55 25 50 18 Q45 25 50 35",
      "M50 35 Q60 30 62 22 Q55 28 50 35",
      "M50 35 Q40 30 38 22 Q45 28 50 35",
      "M50 35 Q58 38 65 33 Q58 35 50 35",
      "M50 35 Q42 38 35 33 Q42 35 50 35",
      // Center
      "M50 32 Q52 30 50 28 Q48 30 50 32",
      // Leaf
      "M50 70 Q40 65 35 70 Q42 68 50 70",
    ],
  },
  {
    id: 2,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Stem
      "M50 95 Q52 80 48 65 Q46 55 50 48",
      // Daisy petals (longer)
      "M50 40 L50 20", "M50 40 L65 25", "M50 40 L35 25",
      "M50 40 L68 38", "M50 40 L32 38",
      "M50 40 L62 50", "M50 40 L38 50",
      // Center circle
      "M54 40 A4 4 0 1 1 46 40 A4 4 0 1 1 54 40",
      // Leaves
      "M48 72 Q38 68 32 72 Q40 70 48 72",
      "M50 62 Q60 58 66 62 Q58 60 50 62",
    ],
  },
  {
    id: 3,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Tulip stem
      "M50 95 Q48 78 50 55",
      // Tulip cup
      "M38 55 Q38 35 50 28 Q62 35 62 55 Q55 50 50 52 Q45 50 38 55",
      // Leaf
      "M50 80 Q35 75 30 82",
    ],
  },
  {
    id: 4,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Stem
      "M50 95 Q50 75 52 60 Q54 50 50 42",
      // Rose spiral
      "M50 38 Q58 35 56 28 Q52 25 48 28 Q44 32 48 36 Q52 40 58 38 Q64 34 60 26 Q54 20 46 24 Q40 30 44 38 Q50 44 58 40",
      // Leaf
      "M52 68 Q62 62 68 66 Q60 65 52 68",
      "M50 78 Q38 72 32 78 Q40 76 50 78",
    ],
  },
  {
    id: 5,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Stem
      "M50 95 Q48 80 50 65",
      // Sunflower petals
      "M50 55 Q50 42 48 35 Q50 40 52 35 Q50 42 50 55",
      "M50 55 Q58 46 64 42 Q58 46 62 50 Q56 48 50 55",
      "M50 55 Q42 46 36 42 Q42 46 38 50 Q44 48 50 55",
      "M50 55 Q56 48 64 52 Q58 50 56 55 Q54 52 50 55",
      "M50 55 Q44 48 36 52 Q42 50 44 55 Q46 52 50 55",
      // Center
      "M54 52 A4 5 0 1 1 46 52 A4 5 0 1 1 54 52",
      // Leaf
      "M50 80 Q60 74 66 78 Q58 76 50 80",
    ],
  },
  {
    id: 6,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Bell flower stem
      "M50 95 Q52 78 50 58",
      // Bell shape
      "M36 48 Q36 30 50 22 Q64 30 64 48 Q58 52 50 54 Q42 52 36 48",
      // Stamen
      "M50 42 L50 52",
      // Small dots inside
      "M46 46 L47 47", "M54 46 L53 47",
    ],
  },
  {
    id: 7,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Stem with curve
      "M50 95 Q45 80 42 70 Q38 60 42 50",
      // Poppy petals (4 large)
      "M42 45 Q32 35 28 25 Q38 30 42 45",
      "M42 45 Q52 35 58 25 Q50 32 42 45",
      "M42 45 Q30 42 22 38 Q28 42 42 45",
      "M42 45 Q48 50 55 45 Q50 48 42 45",
      // Center
      "M45 42 A3 3 0 1 1 39 42 A3 3 0 1 1 45 42",
      // Leaf
      "M44 72 Q54 66 60 70 Q52 68 44 72",
    ],
  },
  {
    id: 8,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Stem
      "M50 95 Q50 80 50 60",
      // Lavender buds (stacked small ovals)
      "M50 55 Q54 53 54 50 Q54 47 50 45",
      "M50 45 Q46 43 46 40 Q46 37 50 35",
      "M50 35 Q54 33 54 30 Q54 27 50 25",
      "M50 25 Q48 23 48 20 Q50 18 52 20 Q52 23 50 25",
      // Side leaves
      "M50 70 Q38 65 32 68 Q40 66 50 70",
      "M50 78 Q62 73 68 76 Q60 74 50 78",
    ],
  },
  {
    id: 9,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Curved stem
      "M45 95 Q42 80 44 68 Q48 55 55 48",
      // Lily petals (elongated)
      "M55 45 Q62 30 55 18 Q50 28 55 45",
      "M55 45 Q68 38 72 25 Q65 35 55 45",
      "M55 45 Q42 38 38 25 Q45 35 55 45",
      // Stamen lines
      "M55 40 L58 30", "M55 40 L52 30", "M55 40 L55 28",
      // Dots on stamen tips
      "M58 29 L59 28", "M52 29 L51 28", "M55 27 L55 26",
    ],
  },
  {
    id: 10,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Two stems
      "M40 95 Q38 78 40 60 Q42 52 40 45",
      "M60 95 Q62 80 60 65 Q58 55 60 48",
      // Small clustered flowers on first stem
      "M40 42 Q36 38 34 32 Q38 36 40 42",
      "M40 42 Q44 38 46 32 Q42 36 40 42",
      "M40 42 Q40 36 40 30 Q40 36 40 42",
      // Small clustered flowers on second stem
      "M60 44 Q56 40 54 34 Q58 38 60 44",
      "M60 44 Q64 40 66 34 Q62 38 60 44",
      "M60 44 Q60 38 60 32 Q60 38 60 44",
    ],
  },
  {
    id: 11,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Stem
      "M50 95 Q48 80 50 65 Q52 55 50 48",
      // Cherry blossom (5 round petals)
      "M50 42 Q47 35 44 30 Q48 34 50 42",
      "M50 42 Q53 35 56 30 Q52 34 50 42",
      "M50 42 Q56 40 62 38 Q56 42 50 42",
      "M50 42 Q44 40 38 38 Q44 42 50 42",
      "M50 42 Q50 48 50 52 Q50 48 50 42",
      // Center dot
      "M51 41 A1.5 1.5 0 1 1 49 41 A1.5 1.5 0 1 1 51 41",
    ],
  },
  {
    id: 12,
    category: "flower",
    viewBox: "0 0 100 100",
    paths: [
      // Drooping stem
      "M40 95 Q38 78 40 65 Q44 55 50 50 Q58 46 62 40",
      // Drooping flower head
      "M62 38 Q66 32 72 30 Q68 35 62 38",
      "M62 38 Q60 30 56 26 Q60 32 62 38",
      "M62 38 Q68 36 74 38 Q68 38 62 38",
      // Leaf
      "M40 75 Q30 70 26 74 Q32 72 40 75",
    ],
  },

  // === PLANTS (13-24) ===
  {
    id: 13,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Cactus body
      "M42 95 L42 40 Q42 30 50 30 Q58 30 58 40 L58 95",
      // Left arm
      "M42 60 L32 60 Q25 60 25 52 Q25 44 32 44 L32 50",
      // Right arm
      "M58 50 L68 50 Q75 50 75 42 Q75 34 68 34 L68 42",
      // Spines
      "M48 35 L48 32", "M52 35 L52 32",
      "M45 50 L43 48", "M55 45 L57 43",
    ],
  },
  {
    id: 14,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Fern: central spine
      "M50 95 Q48 70 50 40 Q52 30 50 20",
      // Left fronds
      "M50 30 Q38 28 30 22", "M49 40 Q36 38 28 34",
      "M48 50 Q34 50 26 46", "M48 60 Q34 62 26 58",
      "M49 70 Q36 74 28 70",
      // Right fronds
      "M50 30 Q62 28 70 22", "M51 40 Q64 38 72 34",
      "M52 50 Q66 50 74 46", "M52 60 Q66 62 74 58",
      "M51 70 Q64 74 72 70",
    ],
  },
  {
    id: 15,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Succulent rosette
      "M50 50 Q55 42 50 35 Q45 42 50 50",
      "M50 50 Q58 46 60 38 Q54 44 50 50",
      "M50 50 Q42 46 40 38 Q46 44 50 50",
      "M50 50 Q60 50 65 44 Q58 50 50 50",
      "M50 50 Q40 50 35 44 Q42 50 50 50",
      "M50 50 Q56 56 62 52 Q56 54 50 50",
      "M50 50 Q44 56 38 52 Q44 54 50 50",
      // Pot
      "M36 60 L38 80 Q38 85 50 85 Q62 85 62 80 L64 60 Z",
    ],
  },
  {
    id: 16,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Vine going up
      "M30 95 Q35 80 40 70 Q48 55 45 45 Q40 35 45 25 Q50 18 55 25 Q60 35 55 45 Q52 55 60 70 Q65 80 70 95",
      // Small leaves along vine
      "M40 70 Q34 66 30 70", "M45 45 Q52 40 56 44",
      "M55 45 Q48 40 44 44", "M45 25 Q40 20 42 16",
      "M55 25 Q60 20 58 16",
    ],
  },
  {
    id: 17,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Bamboo stalk
      "M48 95 L48 15", "M52 95 L52 15",
      // Segments
      "M46 80 L54 80", "M46 60 L54 60", "M46 40 L54 40",
      // Leaves at top
      "M50 20 Q40 15 32 18 Q42 15 50 20",
      "M50 20 Q60 15 68 18 Q58 15 50 20",
      "M50 15 Q42 8 35 10 Q44 8 50 15",
      "M50 15 Q58 8 65 10 Q56 8 50 15",
    ],
  },
  {
    id: 18,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Aloe vera leaves fanning out
      "M50 85 Q48 70 45 55 Q42 45 38 30",
      "M50 85 Q52 70 55 55 Q58 45 62 30",
      "M50 85 Q45 68 38 55 Q30 45 24 35",
      "M50 85 Q55 68 62 55 Q70 45 76 35",
      "M50 85 Q50 68 50 50 Q50 38 50 22",
      // Spines
      "M38 40 L36 38", "M62 40 L64 38",
      "M30 42 L28 40", "M70 42 L72 40",
    ],
  },
  {
    id: 19,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Sprout
      "M50 95 Q50 80 50 65",
      // Two cotyledon leaves
      "M50 65 Q38 55 30 50 Q38 48 50 55 Q50 60 50 65",
      "M50 65 Q62 55 70 50 Q62 48 50 55 Q50 60 50 65",
      // Tiny new leaf
      "M50 55 Q48 48 46 42 Q50 46 54 42 Q52 48 50 55",
    ],
  },
  {
    id: 20,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Potted plant stem
      "M50 58 Q50 45 48 35 Q46 25 50 18",
      // Bushy top (scribble circles)
      "M50 22 Q58 18 60 25 Q62 32 55 35 Q48 38 42 32 Q38 26 42 20 Q46 15 54 16 Q60 18 62 24",
      // Pot
      "M35 62 L38 82 Q38 88 50 88 Q62 88 62 82 L65 62 Z",
      // Pot rim
      "M32 62 L68 62 Q68 58 50 58 Q32 58 32 62",
    ],
  },
  {
    id: 21,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Wheat stalk
      "M50 95 Q48 75 50 55 Q52 40 50 25",
      // Wheat grains (alternating sides)
      "M50 30 Q42 26 38 22 Q44 24 50 30",
      "M50 28 Q58 24 62 20 Q56 22 50 28",
      "M50 34 Q40 30 36 26 Q42 28 50 34",
      "M50 32 Q60 28 64 24 Q58 26 50 32",
      "M50 38 Q42 34 38 30 Q44 32 50 38",
      "M50 36 Q58 32 62 28 Q56 30 50 36",
      // Awn (top whisker)
      "M50 25 Q48 18 46 12", "M50 25 Q52 18 54 12",
    ],
  },
  {
    id: 22,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Moss/grass clump
      "M30 90 Q32 70 35 60 Q38 52 40 45",
      "M38 90 Q40 72 42 62 Q44 50 45 38",
      "M46 90 Q47 68 48 55 Q49 42 50 30",
      "M54 90 Q53 68 52 55 Q51 42 50 32",
      "M62 90 Q60 72 58 62 Q56 50 55 38",
      "M70 90 Q68 70 65 60 Q62 52 60 45",
    ],
  },
  {
    id: 23,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Clover stem
      "M50 95 Q48 80 50 65",
      // Three clover leaves (heart shapes)
      "M50 58 Q44 52 40 46 Q44 42 50 48",
      "M50 58 Q56 52 60 46 Q56 42 50 48",
      "M50 48 Q48 40 46 32 Q50 38 54 32 Q52 40 50 48",
      // Stem detail
      "M50 65 Q46 62 44 58",
    ],
  },
  {
    id: 24,
    category: "plant",
    viewBox: "0 0 100 100",
    paths: [
      // Dandelion stem
      "M50 95 Q48 80 50 55",
      // Dandelion puff (radiating lines)
      "M50 45 L50 20", "M50 45 L35 25", "M50 45 L65 25",
      "M50 45 L28 35", "M50 45 L72 35",
      "M50 45 L25 45", "M50 45 L75 45",
      "M50 45 L32 52", "M50 45 L68 52",
      // Small dots at ends
      "M50 19 L50 18", "M35 24 L34 23", "M65 24 L66 23",
      "M27 34 L26 33", "M73 34 L74 33",
      "M24 44 L23 44", "M76 44 L77 44",
    ],
  },

  // === LEAVES (25-32) ===
  {
    id: 25,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Monstera leaf
      "M50 90 Q50 70 50 55",
      "M50 55 Q30 45 25 25 Q35 35 50 30 Q48 22 42 15 Q55 22 55 30 Q65 35 75 25 Q70 45 50 55",
      // Holes in leaf
      "M42 40 Q44 36 46 40 Q44 42 42 40",
      "M55 38 Q57 34 59 38 Q57 40 55 38",
    ],
  },
  {
    id: 26,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Maple leaf shape
      "M50 90 Q50 75 50 60",
      "M50 55 Q42 48 30 35 Q40 42 42 48 Q38 42 28 40 Q38 48 50 50 Q45 48 35 55 Q45 52 50 55",
      "M50 55 Q58 48 70 35 Q60 42 58 48 Q62 42 72 40 Q62 48 50 50 Q55 48 65 55 Q55 52 50 55",
      "M50 50 Q48 38 50 25 Q52 38 50 50",
    ],
  },
  {
    id: 27,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Simple oval leaf
      "M50 90 Q50 72 50 55",
      "M50 52 Q35 42 30 28 Q40 18 50 15 Q60 18 70 28 Q65 42 50 52",
      // Midrib
      "M50 52 L50 18",
      // Veins
      "M50 25 Q42 22 38 25", "M50 25 Q58 22 62 25",
      "M50 35 Q40 33 35 36", "M50 35 Q60 33 65 36",
      "M50 45 Q42 44 38 46", "M50 45 Q58 44 62 46",
    ],
  },
  {
    id: 28,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Ginkgo fan leaf
      "M50 90 Q48 72 46 60 Q44 50 50 45",
      "M50 45 Q30 38 20 20 Q35 30 50 35 Q65 30 80 20 Q70 38 50 45",
      // Fan veins
      "M50 45 L35 25", "M50 45 L50 22", "M50 45 L65 25",
      "M50 45 L28 30", "M50 45 L72 30",
    ],
  },
  {
    id: 29,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Ivy leaf
      "M50 90 Q52 75 50 62",
      "M50 58 Q38 50 32 38 Q40 45 50 48",
      "M50 58 Q62 50 68 38 Q60 45 50 48",
      "M50 48 Q42 35 38 22 Q48 32 50 38",
      "M50 48 Q58 35 62 22 Q52 32 50 38",
      "M50 38 Q50 28 50 18",
    ],
  },
  {
    id: 30,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Palm frond
      "M50 90 Q48 70 46 55 Q44 42 42 30",
      // Frond blades
      "M44 50 Q30 42 20 38 Q32 44 44 50",
      "M44 44 Q28 35 18 30 Q30 38 44 44",
      "M43 38 Q30 28 22 22 Q32 30 43 38",
      "M44 50 Q56 44 66 42 Q54 46 44 50",
      "M44 44 Q58 36 68 32 Q56 38 44 44",
      "M43 38 Q56 30 64 25 Q54 32 43 38",
    ],
  },
  {
    id: 31,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Four-leaf clover
      "M50 90 Q50 75 50 58",
      // Four heart-shaped leaves
      "M50 55 Q42 48 38 40 Q42 36 50 45",
      "M50 55 Q58 48 62 40 Q58 36 50 45",
      "M50 45 Q42 38 38 30 Q42 26 50 35",
      "M50 45 Q58 38 62 30 Q58 26 50 35",
    ],
  },
  {
    id: 32,
    category: "leaf",
    viewBox: "0 0 100 100",
    paths: [
      // Eucalyptus branch
      "M50 90 Q48 75 46 60 Q44 48 42 35 Q40 25 38 15",
      // Pairs of round leaves
      "M44 70 Q36 66 32 70 Q36 72 44 70",
      "M46 70 Q54 66 58 70 Q54 72 46 70",
      "M43 55 Q34 50 30 54 Q34 56 43 55",
      "M45 55 Q54 50 58 54 Q54 56 45 55",
      "M42 40 Q34 36 30 40 Q34 42 42 40",
      "M43 40 Q50 36 54 40 Q50 42 43 40",
      "M40 28 Q34 24 30 28 Q34 30 40 28",
      "M41 28 Q46 24 50 28 Q46 30 41 28",
    ],
  },

  // === MUSHROOMS (33-38) ===
  {
    id: 33,
    category: "mushroom",
    viewBox: "0 0 100 100",
    paths: [
      // Classic mushroom cap
      "M25 55 Q25 30 50 22 Q75 30 75 55 Z",
      // Stem
      "M40 55 L42 85 Q42 90 50 90 Q58 90 58 85 L60 55",
      // Cap spots
      "M40 38 A3 3 0 1 1 46 38 A3 3 0 1 1 40 38",
      "M55 32 A2 2 0 1 1 59 32 A2 2 0 1 1 55 32",
      "M48 45 A2 2 0 1 1 52 45 A2 2 0 1 1 48 45",
    ],
  },
  {
    id: 34,
    category: "mushroom",
    viewBox: "0 0 100 100",
    paths: [
      // Tall thin mushroom
      "M46 55 L48 90",
      "M54 55 L52 90",
      // Small round cap
      "M35 55 Q35 38 50 32 Q65 38 65 55 Z",
      // Gills
      "M42 55 L44 50", "M50 55 L50 48", "M58 55 L56 50",
    ],
  },
  {
    id: 35,
    category: "mushroom",
    viewBox: "0 0 100 100",
    paths: [
      // Group of small mushrooms
      // Big one
      "M30 60 Q30 45 45 40 Q60 45 60 60 Z",
      "M42 60 L43 82 Q43 85 46 85 Q49 85 49 82 L50 60",
      // Medium one
      "M55 55 Q55 45 68 40 Q80 45 80 55 Z",
      "M64 55 L65 78 Q65 80 68 80 Q71 80 71 78 L72 55",
      // Tiny one
      "M18 65 Q18 58 26 55 Q34 58 34 65 Z",
      "M24 65 L25 78 Q25 80 26 80 Q27 80 27 78 L28 65",
    ],
  },
  {
    id: 36,
    category: "mushroom",
    viewBox: "0 0 100 100",
    paths: [
      // Chanterelle (wavy funnel shape)
      "M50 90 Q48 80 46 70 Q40 60 30 50 Q35 42 50 38 Q65 42 70 50 Q60 60 54 70 Q52 80 50 90",
      // Ridges
      "M38 48 Q44 55 46 65",
      "M50 40 Q50 52 50 68",
      "M62 48 Q56 55 54 65",
    ],
  },
  {
    id: 37,
    category: "mushroom",
    viewBox: "0 0 100 100",
    paths: [
      // Flat shelf mushroom
      "M20 55 Q20 40 50 35 Q80 40 80 55 Q65 58 50 60 Q35 58 20 55",
      // Stem (short)
      "M44 60 L46 80 Q46 85 50 85 Q54 85 54 80 L56 60",
      // Gills
      "M30 54 Q40 56 50 58", "M70 54 Q60 56 50 58",
      "M35 52 Q42 55 50 57", "M65 52 Q58 55 50 57",
    ],
  },
  {
    id: 38,
    category: "mushroom",
    viewBox: "0 0 100 100",
    paths: [
      // Puffy round mushroom (puffball)
      "M30 55 Q28 30 50 22 Q72 30 70 55 Q60 60 50 62 Q40 60 30 55",
      // Tiny stem
      "M45 62 L46 75 Q46 78 50 78 Q54 78 54 75 L55 62",
      // Texture dots
      "M42 35 L43 36", "M50 30 L51 31", "M58 35 L59 36",
      "M45 45 L46 46", "M55 42 L56 43", "M38 45 L39 46",
      "M62 42 L63 43",
    ],
  },

  // === INSECTS (39-44) ===
  {
    id: 39,
    category: "insect",
    viewBox: "0 0 100 100",
    paths: [
      // Butterfly body
      "M50 35 L50 65",
      // Left wings
      "M50 42 Q30 30 25 20 Q30 35 38 40 Q32 50 28 58 Q38 52 50 50",
      // Right wings
      "M50 42 Q70 30 75 20 Q70 35 62 40 Q68 50 72 58 Q62 52 50 50",
      // Antennae
      "M50 35 Q44 28 38 22", "M50 35 Q56 28 62 22",
      // Wing dots
      "M38 35 A2 2 0 1 1 42 35 A2 2 0 1 1 38 35",
      "M58 35 A2 2 0 1 1 62 35 A2 2 0 1 1 58 35",
    ],
  },
  {
    id: 40,
    category: "insect",
    viewBox: "0 0 100 100",
    paths: [
      // Ladybug body
      "M35 50 Q35 30 50 25 Q65 30 65 50 Q65 68 50 72 Q35 68 35 50",
      // Center line
      "M50 28 L50 72",
      // Head
      "M42 28 Q42 20 50 18 Q58 20 58 28",
      // Spots
      "M42 40 A3 3 0 1 1 48 40 A3 3 0 1 1 42 40",
      "M52 40 A3 3 0 1 1 58 40 A3 3 0 1 1 52 40",
      "M42 55 A2 2 0 1 1 46 55 A2 2 0 1 1 42 55",
      "M54 55 A2 2 0 1 1 58 55 A2 2 0 1 1 54 55",
      "M47 48 A2 2 0 1 1 53 48 A2 2 0 1 1 47 48",
      // Antennae
      "M46 20 Q40 14 36 10", "M54 20 Q60 14 64 10",
    ],
  },
  {
    id: 41,
    category: "insect",
    viewBox: "0 0 100 100",
    paths: [
      // Bee body (striped oval)
      "M35 50 Q35 35 50 30 Q65 35 65 50 Q65 65 50 70 Q35 65 35 50",
      // Stripes
      "M38 42 Q50 40 62 42",
      "M37 50 Q50 48 63 50",
      "M38 58 Q50 56 62 58",
      // Wings
      "M45 32 Q35 22 30 15 Q38 22 45 32",
      "M55 32 Q65 22 70 15 Q62 22 55 32",
      // Stinger
      "M50 70 L50 78",
      // Antennae
      "M46 32 Q42 24 38 20", "M54 32 Q58 24 62 20",
    ],
  },
  {
    id: 42,
    category: "insect",
    viewBox: "0 0 100 100",
    paths: [
      // Snail shell spiral
      "M55 45 Q65 42 68 50 Q70 60 60 62 Q50 64 48 55 Q46 48 52 44 Q56 42 58 48 Q60 52 56 54 Q52 56 50 52",
      // Body
      "M48 58 Q40 62 30 65 Q25 68 22 72 Q28 70 35 68 Q42 65 48 62",
      // Eye stalks
      "M35 60 Q32 54 28 50", "M40 58 Q38 52 36 48",
      // Eye dots
      "M27 49 A1.5 1.5 0 1 1 29 49", "M35 47 A1.5 1.5 0 1 1 37 47",
    ],
  },
  {
    id: 43,
    category: "insect",
    viewBox: "0 0 100 100",
    paths: [
      // Dragonfly body
      "M50 25 L50 75",
      // Head
      "M46 25 Q46 20 50 18 Q54 20 54 25 Q52 27 50 27 Q48 27 46 25",
      // Upper wings
      "M50 32 Q30 25 20 20 Q32 30 50 35",
      "M50 32 Q70 25 80 20 Q68 30 50 35",
      // Lower wings
      "M50 40 Q32 36 24 32 Q34 40 50 44",
      "M50 40 Q68 36 76 32 Q66 40 50 44",
      // Tail segments
      "M49 55 L51 55", "M49 62 L51 62", "M49 69 L51 69",
    ],
  },
  {
    id: 44,
    category: "insect",
    viewBox: "0 0 100 100",
    paths: [
      // Caterpillar body segments
      "M20 55 Q20 48 28 48 Q36 48 36 55 Q36 62 28 62 Q20 62 20 55",
      "M34 52 Q34 45 42 45 Q50 45 50 52 Q50 59 42 59 Q34 59 34 52",
      "M48 50 Q48 43 56 43 Q64 43 64 50 Q64 57 56 57 Q48 57 48 50",
      "M62 52 Q62 45 70 45 Q78 45 78 52 Q78 59 70 59 Q62 59 62 52",
      // Head
      "M76 50 Q82 48 85 50 Q82 52 76 50",
      // Eyes
      "M82 49 A1 1 0 1 1 84 49",
      // Antenna
      "M84 48 Q86 42 88 40", "M84 48 Q88 44 90 42",
      // Legs
      "M28 62 L26 70", "M42 59 L40 67", "M56 57 L54 65", "M70 59 L68 67",
    ],
  },

  // === TREES (45-50) ===
  {
    id: 45,
    category: "tree",
    viewBox: "0 0 100 100",
    paths: [
      // Pine tree trunk
      "M48 90 L48 55", "M52 90 L52 55",
      // Pine layers
      "M50 15 L30 45 L38 42 L22 58 L35 55 L18 70 L82 70 L65 55 L78 58 L62 42 L70 45 Z",
    ],
  },
  {
    id: 46,
    category: "tree",
    viewBox: "0 0 100 100",
    paths: [
      // Oak tree trunk
      "M44 90 L44 55", "M56 90 L56 55",
      // Bushy crown (cloud shape)
      "M50 55 Q25 55 22 40 Q20 25 35 20 Q42 12 50 15 Q58 12 65 20 Q80 25 78 40 Q75 55 50 55",
      // Crown detail
      "M35 30 Q40 25 50 28", "M65 30 Q60 25 50 28",
    ],
  },
  {
    id: 47,
    category: "tree",
    viewBox: "0 0 100 100",
    paths: [
      // Willow trunk
      "M48 90 Q46 70 48 55 Q50 45 48 35",
      "M52 90 Q54 70 52 55 Q50 45 52 35",
      // Drooping branches
      "M48 38 Q35 35 25 50 Q22 58 20 68",
      "M48 40 Q38 40 30 55 Q28 62 26 72",
      "M52 38 Q65 35 75 50 Q78 58 80 68",
      "M52 40 Q62 40 70 55 Q72 62 74 72",
      "M50 35 Q50 45 48 60 Q46 72 44 80",
      "M50 35 Q50 45 52 60 Q54 72 56 80",
    ],
  },
  {
    id: 48,
    category: "tree",
    viewBox: "0 0 100 100",
    paths: [
      // Palm tree trunk (curved)
      "M50 90 Q48 78 46 68 Q42 55 44 45 Q46 35 50 28",
      // Palm fronds
      "M50 28 Q35 22 18 28 Q30 22 50 28",
      "M50 28 Q65 22 82 28 Q70 22 50 28",
      "M50 28 Q30 18 15 22 Q28 15 50 28",
      "M50 28 Q70 18 85 22 Q72 15 50 28",
      "M50 28 Q50 15 50 10 Q50 15 50 28",
      // Coconuts
      "M48 32 A3 3 0 1 1 54 32 A3 3 0 1 1 48 32",
    ],
  },
  {
    id: 49,
    category: "tree",
    viewBox: "0 0 100 100",
    paths: [
      // Bonsai pot
      "M30 82 L33 92 Q33 95 50 95 Q67 95 67 92 L70 82 Z",
      // Trunk (twisted)
      "M48 82 Q42 72 40 65 Q38 55 42 48 Q46 42 50 38",
      "M52 82 Q52 72 50 65 Q48 58 50 50 Q52 44 50 38",
      // Crown
      "M50 38 Q38 35 35 28 Q38 22 50 20 Q62 22 65 28 Q62 35 50 38",
      // Branch left
      "M42 55 Q32 52 28 48 Q34 45 42 50",
    ],
  },
  {
    id: 50,
    category: "tree",
    viewBox: "0 0 100 100",
    paths: [
      // Cherry blossom tree trunk
      "M48 90 L46 60 Q44 50 40 42",
      "M52 90 L54 60 Q56 50 60 42",
      // Branch left
      "M42 48 Q32 42 22 38",
      // Branch right
      "M58 48 Q68 42 78 38",
      // Blossom clusters (circles)
      "M38 38 A6 6 0 1 1 50 38 A6 6 0 1 1 38 38",
      "M54 36 A5 5 0 1 1 64 36 A5 5 0 1 1 54 36",
      "M22 34 A5 5 0 1 1 32 34 A5 5 0 1 1 22 34",
      "M68 34 A5 5 0 1 1 78 34 A5 5 0 1 1 68 34",
      "M44 28 A4 4 0 1 1 52 28 A4 4 0 1 1 44 28",
    ],
  },
];

export function getDoodleById(id: number): DoodleDef | undefined {
  return doodles.find((d) => d.id === id);
}
