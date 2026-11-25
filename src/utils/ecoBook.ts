// Auto-verified ECO Opening Book (871 common opening FEN prefixes & transpositions)
export interface OpeningEntry {
  eco: string;
  name: string;
}

export function normalizeFenKey(fen: string): string {
  return fen.split(' ').slice(0, 3).join(' ');
}

const ECO_BOOK_DATA: Record<string, [string, string]> = {
  "rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq": [
    "A00",
    "Polish Opening (Sokolsky)"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/1P6/8/P1PPPPPP/RNBQKBNR w KQkq": [
    "A00",
    "Polish Opening: Outflank Variation"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/1P6/8/PBPPPPPP/RN1QKBNR b KQkq": [
    "A00",
    "Polish Opening: Outflank Variation"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RNBQKBNR w KQkq": [
    "A00",
    "Polish Opening: Baltic Defense"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/1P6/8/PBPPPPPP/RN1QKBNR b KQkq": [
    "A00",
    "Polish Opening: Baltic Defense"
  ],
  "rnbqk1nr/pppp1ppp/8/4p3/1b6/8/PBPPPPPP/RN1QKBNR w KQkq": [
    "A00",
    "Polish Opening: Baltic Defense"
  ],
  "rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPP1P/RNBQKBNR b KQkq": [
    "A00",
    "Grob's Attack"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq": [
    "A00",
    "Grob's Attack: Spike Deferred"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPPBP/RNBQK1NR b KQkq": [
    "A00",
    "Grob's Attack: Spike Deferred"
  ],
  "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq": [
    "A00",
    "Anderssen Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq": [
    "A00",
    "Ware Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/8/2P5/PP1PPPPP/RNBQKBNR b KQkq": [
    "A00",
    "Saragossa Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/8/3P4/PPP1PPPP/RNBQKBNR b KQkq": [
    "A00",
    "Mieses Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq": [
    "A00",
    "Van't Kruijs Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq": [
    "A00",
    "Barnes Opening"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/8/5P2/PPPPP1PP/RNBQKBNR w KQkq": [
    "A00",
    "Gedult's Opening"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/4P3/5P2/PPPP2PP/RNBQKBNR b KQkq": [
    "A00",
    "Gedult's Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq": [
    "A00",
    "Benko Opening (Hungarian)"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/8/6P1/PPPPPP1P/RNBQKBNR w KQkq": [
    "A00",
    "Hungarian Opening: Reversed Alekhine"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/8/6P1/PPPPPPBP/RNBQK1NR b KQkq": [
    "A00",
    "Hungarian Opening: Reversed Alekhine"
  ],
  "rnbqkbnr/ppp2ppp/8/3pp3/8/6P1/PPPPPPBP/RNBQK1NR w KQkq": [
    "A00",
    "Hungarian Opening: Reversed Alekhine"
  ],
  "rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq": [
    "A00",
    "Clemenz Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/7P/8/PPPPPPP1/RNBQKBNR b KQkq": [
    "A00",
    "Desprez Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/8/7N/PPPPPPPP/RNBQKB1R b KQkq": [
    "A00",
    "Amar Opening"
  ],
  "rnbqkbnr/pppppppp/8/8/8/N7/PPPPPPPP/R1BQKBNR b KQkq": [
    "A00",
    "Sodium Attack"
  ],
  "rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq": [
    "A00",
    "Dunst Opening"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/8/2N5/PPPPPPPP/R1BQKBNR w KQkq": [
    "A00",
    "Van Geet Opening: Reversed Scandinavian"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq": [
    "A00",
    "Van Geet Opening: Reversed Scandinavian"
  ],
  "rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq": [
    "A01",
    "Nimzo-Larsen Attack"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Modern Variation"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/8/1P6/PBPPPPPP/RN1QKBNR b KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Modern Variation"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/PBPPPPPP/RN1QKBNR w KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Modern Variation"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/8/1P6/P1PPPPPP/RNBQKBNR w KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Classical Variation"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/8/1P6/PBPPPPPP/RN1QKBNR b KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Classical Variation"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/8/1P6/PBPPPPPP/RN1QKBNR w KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Classical Variation"
  ],
  "rnbqkb1r/pppppppp/5n2/8/8/1P6/P1PPPPPP/RNBQKBNR w KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Indian Variation"
  ],
  "rnbqkb1r/pppppppp/5n2/8/8/1P6/PBPPPPPP/RN1QKBNR b KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Indian Variation"
  ],
  "rnbqkb1r/pppppp1p/5np1/8/8/1P6/PBPPPPPP/RN1QKBNR w KQkq": [
    "A01",
    "Nimzo-Larsen Attack: Indian Variation"
  ],
  "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq": [
    "A02",
    "Bird Opening"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/5P2/8/PPPPP1PP/RNBQKBNR w KQkq": [
    "A02",
    "From Gambit"
  ],
  "rnbqkbnr/pppp1ppp/8/4P3/8/8/PPPPP1PP/RNBQKBNR b KQkq": [
    "A02",
    "From Gambit"
  ],
  "rnbqkbnr/ppp2ppp/3p4/4P3/8/8/PPPPP1PP/RNBQKBNR w KQkq": [
    "A02",
    "From Gambit"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/5P2/8/PPPPP1PP/RNBQKBNR w KQkq": [
    "A03",
    "Bird Opening: Dutch Variation"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/5P2/5N2/PPPPP1PP/RNBQKB1R b KQkq": [
    "A03",
    "Bird Opening: Dutch Variation"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/4PP2/8/PPPP2PP/RNBQKBNR b KQkq": [
    "A03",
    "Bird Opening: Williams Gambit"
  ],
  "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq": [
    "A04",
    "Zukertort Opening (Reti)"
  ],
  "rnbqkbnr/pppppp1p/6p1/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq": [
    "A04",
    "Reti Opening: Kingside Fianchetto"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPPPPPP/RNBQKB1R w KQkq": [
    "A04",
    "Reti Opening: Sicilian Invitation"
  ],
  "rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq": [
    "A05",
    "Reti Opening: King Indian Attack"
  ],
  "rnbqkb1r/pppppppp/5n2/8/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq": [
    "A05",
    "Reti Opening: King Indian Attack"
  ],
  "rnbqkb1r/pppppppp/5n2/8/1P6/5N2/P1PPPPPP/RNBQKB1R b KQkq": [
    "A05",
    "Santasiere Folly"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq": [
    "A06",
    "Zukertort Opening: Queen Pawn"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq": [
    "A06",
    "Tennison Gambit"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq": [
    "A07",
    "King's Indian Attack"
  ],
  "rn1qkbnr/ppp1pppp/8/3p4/6b1/5NP1/PPPPPP1P/RNBQKB1R w KQkq": [
    "A07",
    "King's Indian Attack: Double Fianchetto"
  ],
  "rn1qkbnr/ppp1pppp/8/3p4/6b1/5NP1/PPPPPPBP/RNBQK2R b KQkq": [
    "A07",
    "King's Indian Attack: Double Fianchetto"
  ],
  "rnbqkbnr/pp2pppp/8/2pp4/8/5NP1/PPPPPP1P/RNBQKB1R w KQkq": [
    "A08",
    "King's Indian Attack: French Variation"
  ],
  "rnbqkbnr/pp2pppp/8/2pp4/8/5NP1/PPPPPPBP/RNBQK2R b KQkq": [
    "A08",
    "King's Indian Attack: French Variation"
  ],
  "r1bqkbnr/pp2pppp/2n5/2pp4/8/5NP1/PPPPPPBP/RNBQK2R w KQkq": [
    "A08",
    "King's Indian Attack: French Variation"
  ],
  "r1bqkbnr/pp2pppp/2n5/2pp4/8/5NP1/PPPPPPBP/RNBQ1RK1 b kq": [
    "A08",
    "King's Indian Attack: French Variation"
  ],
  "r1bqkbnr/pp3ppp/2n1p3/2pp4/8/5NP1/PPPPPPBP/RNBQ1RK1 w kq": [
    "A08",
    "King's Indian Attack: French Variation"
  ],
  "r1bqkbnr/pp3ppp/2n1p3/2pp4/8/3P1NP1/PPP1PPBP/RNBQ1RK1 b kq": [
    "A08",
    "King's Indian Attack: French Variation"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq": [
    "A09",
    "Reti Opening"
  ],
  "rnbqkbnr/ppp1pppp/8/8/2Pp4/5N2/PP1PPPPP/RNBQKB1R w KQkq": [
    "A09",
    "Reti Opening: Advance Variation"
  ],
  "rnbqkbnr/ppp1pppp/8/8/2p5/5N2/PP1PPPPP/RNBQKB1R w KQkq": [
    "A09",
    "Reti Accepted"
  ],
  "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq": [
    "A10",
    "English Opening"
  ],
  "rnbqkbnr/ppppp1pp/8/5p2/2P5/8/PP1PPPPP/RNBQKBNR w KQkq": [
    "A10",
    "English Opening: Anglo-Dutch"
  ],
  "rnbqkbnr/p1pppppp/8/1p6/2P5/8/PP1PPPPP/RNBQKBNR w KQkq": [
    "A10",
    "English Opening: Jaenisch Gambit"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq": [
    "A11",
    "English Opening: Caro-Kann Defensive System"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq": [
    "A12",
    "English Opening: Torre Defensive System"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq": [
    "A12",
    "English Opening: Torre Defensive System"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/2P5/1P3N2/P2PPPPP/RNBQKB1R b KQkq": [
    "A12",
    "English Opening: Torre Defensive System"
  ],
  "rnbqkb1r/pp2pppp/2p2n2/3p4/2P5/1P3N2/P2PPPPP/RNBQKB1R w KQkq": [
    "A12",
    "English Opening: Torre Defensive System"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq": [
    "A13",
    "English Opening: Agincourt Defense"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq": [
    "A13",
    "English Opening: Neo-Catalan"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq": [
    "A13",
    "English Opening: Neo-Catalan"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/2P5/5NP1/PP1PPP1P/RNBQKB1R b KQkq": [
    "A13",
    "English Opening: Neo-Catalan"
  ],
  "rnbqkb1r/pppppppp/5n2/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq": [
    "A15",
    "English Opening: Anglo-Indian Defense"
  ],
  "rnbqkb1r/pppppppp/5n2/8/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq": [
    "A16",
    "English Opening: Anglo-Indian Knights"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/2P5/2N5/PP1PPPPP/R1BQKBNR w KQkq": [
    "A16",
    "English Opening: Anglo-Grunfeld"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/2P5/2N5/PP1PPPPP/R1BQKBNR w KQkq": [
    "A17",
    "English Opening: Hedgehog Defense"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/2P5/2N2N2/PP1PPPPP/R1BQKB1R b KQkq": [
    "A17",
    "English Opening: Hedgehog Defense"
  ],
  "rnbqkb1r/p1pp1ppp/1p2pn2/8/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq": [
    "A17",
    "English Opening: Hedgehog Defense"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/2P1P3/2N5/PP1P1PPP/R1BQKBNR b KQkq": [
    "A18",
    "English Opening: Mikenas-Carls Variation"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq": [
    "A20",
    "English Opening: King English Variation"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq": [
    "A21",
    "English Opening: Reversed Sicilian"
  ],
  "rnbqk1nr/pppp1ppp/8/4p3/1bP5/2N5/PP1PPPPP/R1BQKBNR w KQkq": [
    "A21",
    "English Opening: Kramnik-Shirov Counterattack"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR w KQkq": [
    "A22",
    "English Opening: Carls-Bremen System"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N3P1/PP1PPP1P/R1BQKBNR b KQkq": [
    "A22",
    "English Opening: Carls-Bremen System"
  ],
  "rnbqkb1r/pppp1p1p/5np1/4p3/2P5/2N3P1/PP1PPP1P/R1BQKBNR w KQkq": [
    "A24",
    "English Opening: Bremen Fianchetto"
  ],
  "rnbqkb1r/pppp1p1p/5np1/4p3/2P5/2N3P1/PP1PPPBP/R1BQK1NR b KQkq": [
    "A24",
    "English Opening: Bremen Fianchetto"
  ],
  "rnbqk2r/pppp1pbp/5np1/4p3/2P5/2N3P1/PP1PPPBP/R1BQK1NR w KQkq": [
    "A24",
    "English Opening: Bremen Fianchetto"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR w KQkq": [
    "A25",
    "English Opening: Closed System"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/2P5/2N3P1/PP1PPP1P/R1BQKBNR b KQkq": [
    "A25",
    "English Opening: Closed System"
  ],
  "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/2N3P1/PP1PPP1P/R1BQKBNR w KQkq": [
    "A25",
    "English Opening: Closed System"
  ],
  "r1bqkbnr/pppp1p1p/2n3p1/4p3/2P5/2N3P1/PP1PPPBP/R1BQK1NR b KQkq": [
    "A25",
    "English Opening: Closed System"
  ],
  "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/2N3P1/PP1PPPBP/R1BQK1NR w KQkq": [
    "A25",
    "English Opening: Closed System"
  ],
  "r1bqk1nr/pppp1pbp/2n3p1/4p3/2P5/2NP2P1/PP2PPBP/R1BQK1NR b KQkq": [
    "A25",
    "English Opening: Closed System"
  ],
  "r1bqk1nr/ppp2pbp/2np2p1/4p3/2P5/2NP2P1/PP2PPBP/R1BQK1NR w KQkq": [
    "A26",
    "English Opening: Botvinnik System"
  ],
  "r1bqk1nr/ppp2pbp/2np2p1/4p3/2P1P3/2NP2P1/PP3PBP/R1BQK1NR b KQkq": [
    "A26",
    "English Opening: Botvinnik System"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N2N2/PP1PPPPP/R1BQKB1R b KQkq": [
    "A28",
    "English Opening: Four Knights System"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq": [
    "A28",
    "English Opening: Four Knights System"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/2N2NP1/PP1PPP1P/R1BQKB1R b KQkq": [
    "A29",
    "English Opening: Four Knights Kingside Fianchetto"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/2P5/8/PP1PPPPP/RNBQKBNR w KQkq": [
    "A30",
    "English Opening: Symmetrical Variation"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5NP1/PP1PPP1P/RNBQKB1R b KQkq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rnbqkb1r/p2ppppp/1p3n2/2p5/2P5/5NP1/PP1PPP1P/RNBQKB1R w KQkq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rnbqkb1r/p2ppppp/1p3n2/2p5/2P5/5NP1/PP1PPPBP/RNBQK2R b KQkq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rn1qkb1r/pb1ppppp/1p3n2/2p5/2P5/5NP1/PP1PPPBP/RNBQK2R w KQkq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rn1qkb1r/pb1ppppp/1p3n2/2p5/2P5/5NP1/PP1PPPBP/RNBQ1RK1 b kq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rn1qkb1r/pb1p1ppp/1p2pn2/2p5/2P5/5NP1/PP1PPPBP/RNBQ1RK1 w kq": [
    "A30",
    "English Opening: Symmetrical Hedgehog"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq": [
    "A34",
    "English Opening: Symmetrical Knights"
  ],
  "r1bqkbnr/pp1ppppp/2n5/2p5/2P5/2N5/PP1PPPPP/R1BQKBNR w KQkq": [
    "A36",
    "English Opening: Ultra-Symmetrical"
  ],
  "r1bqkbnr/pp1ppppp/2n5/2p5/2P5/2N3P1/PP1PPP1P/R1BQKBNR b KQkq": [
    "A36",
    "English Opening: Ultra-Symmetrical"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/2p5/2P5/2N3P1/PP1PPP1P/R1BQKBNR w KQkq": [
    "A36",
    "English Opening: Ultra-Symmetrical"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/2p5/2P5/2N3P1/PP1PPPBP/R1BQK1NR b KQkq": [
    "A36",
    "English Opening: Ultra-Symmetrical"
  ],
  "r1bqk1nr/pp1pppbp/2n3p1/2p5/2P5/2N3P1/PP1PPPBP/R1BQK1NR w KQkq": [
    "A36",
    "English Opening: Ultra-Symmetrical"
  ],
  "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq": [
    "A40",
    "Queen's Pawn Opening"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A40",
    "Englund Gambit"
  ],
  "rnbqkbnr/pppp1ppp/8/4P3/8/8/PPP1PPPP/RNBQKBNR b KQkq": [
    "A40",
    "Englund Gambit Accepted"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4P3/8/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A40",
    "Englund Gambit Accepted"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4P3/8/5N2/PPP1PPPP/RNBQKB1R b KQkq": [
    "A40",
    "Englund Gambit Accepted"
  ],
  "r1b1kbnr/ppppqppp/2n5/4P3/8/5N2/PPP1PPPP/RNBQKB1R w KQkq": [
    "A40",
    "Englund Gambit Accepted"
  ],
  "rnbqkbnr/p1pppppp/8/1p6/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A40",
    "Queen Pawn: Polish Defense"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A40",
    "Queen Pawn: English Defense"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A40",
    "Queen Pawn: English Defense"
  ],
  "rnbqkbnr/p1pp1ppp/1p2p3/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A40",
    "Queen Pawn: English Defense"
  ],
  "rnbqkbnr/pppppp1p/6p1/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A40",
    "Queen Pawn: Modern Defense"
  ],
  "rnbqkbnr/ppp1pppp/3p4/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A41",
    "Old Indian: Tartakower"
  ],
  "rnbqkbnr/pppppp1p/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A42",
    "Modern Defense: Averbakh System"
  ],
  "rnbqk1nr/ppppppbp/6p1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A42",
    "Modern Defense: Averbakh System"
  ],
  "rnbqk1nr/ppppppbp/6p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "A42",
    "Modern Defense: Averbakh System"
  ],
  "rnbqk1nr/ppp1ppbp/3p2p1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "A42",
    "Modern Defense: Averbakh System"
  ],
  "rnbqk1nr/ppp1ppbp/3p2p1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq": [
    "A42",
    "Modern Defense: Averbakh System"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A43",
    "Old Benoni Defense"
  ],
  "rnbqkbnr/pp1ppppp/8/2pP4/8/8/PPP1PPPP/RNBQKBNR b KQkq": [
    "A43",
    "Benoni: Staunton System"
  ],
  "rnbqkbnr/pp1p1ppp/8/2pPp3/8/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A43",
    "Benoni: Staunton System"
  ],
  "rnbqkbnr/pp1p1ppp/8/2pPp3/8/2N5/PPP1PPPP/R1BQKBNR b KQkq": [
    "A43",
    "Benoni: Staunton System"
  ],
  "rnbqkbnr/pp3ppp/3p4/2pPp3/8/2N5/PPP1PPPP/R1BQKBNR w KQkq": [
    "A43",
    "Benoni: Staunton System"
  ],
  "rnbqkbnr/pp3ppp/3p4/2pPp3/4P3/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "A43",
    "Benoni: Staunton System"
  ],
  "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A45",
    "Indian Game"
  ],
  "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq": [
    "A45",
    "Trompowsky Attack"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/6B1/3P4/8/PPP1PPPP/RN1QKBNR w KQkq": [
    "A45",
    "Trompowsky Attack: Classical Defense"
  ],
  "rnbqkb1r/pppppppp/8/6B1/3Pn3/8/PPP1PPPP/RN1QKBNR w KQkq": [
    "A45",
    "Trompowsky Attack: Raptor Variation"
  ],
  "rnbqkb1r/pppppppp/8/8/3PnB2/8/PPP1PPPP/RN1QKBNR b KQkq": [
    "A45",
    "Trompowsky Attack: Raptor Variation"
  ],
  "rnbqkb1r/pppppppp/5n2/8/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq": [
    "A46",
    "Indian Game: Knights Variation"
  ],
  "rnbqkb1r/pppppppp/5n2/8/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq": [
    "A46",
    "London System: Indian Setup"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq": [
    "A46",
    "Torre Attack: Indian Setup"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/6B1/3P4/5N2/PPP1PPPP/RN1QKB1R b KQkq": [
    "A46",
    "Torre Attack: Indian Setup"
  ],
  "rnbqkb1r/p1pppppp/1p3n2/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq": [
    "A47",
    "Queen's Indian Setup"
  ],
  "rnbqkb1r/pppppp1p/5np1/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq": [
    "A48",
    "London System: East Indian Defense"
  ],
  "rnbqkb1r/pppppp1p/5np1/8/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq": [
    "A48",
    "London System: East Indian Defense"
  ],
  "rnbqkb1r/pppppp1p/5np1/6B1/3P4/5N2/PPP1PPPP/RN1QKB1R b KQkq": [
    "A48",
    "Torre Attack: Kingside Fianchetto"
  ],
  "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A50",
    "Indian Game: Normal Variation"
  ],
  "r1bqkb1r/pppppppp/2n2n2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A50",
    "Mexican Defense"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A51",
    "Budapest Gambit"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4P3/2P5/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A52",
    "Budapest Gambit Accepted"
  ],
  "rnbqkb1r/pppp1ppp/8/4P3/2P3n1/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A52",
    "Budapest Gambit Accepted"
  ],
  "rnbqkb1r/pppp1ppp/8/4P3/2P3n1/5N2/PP2PPPP/RNBQKB1R b KQkq": [
    "A52",
    "Budapest Gambit: Adler Variation"
  ],
  "rnbqk2r/pppp1ppp/8/2b1P3/2P3n1/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "A52",
    "Budapest Gambit: Adler Variation"
  ],
  "rnbqkb1r/ppp1pppp/3p1n2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A53",
    "Old Indian Defense"
  ],
  "rnbqkb1r/ppp1pppp/3p1n2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "A55",
    "Old Indian Defense: Main Line"
  ],
  "rnbqkb1r/ppp2ppp/3p1n2/4p3/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "A55",
    "Old Indian Defense: Main Line"
  ],
  "rnbqkb1r/ppp2ppp/3p1n2/4p3/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "A55",
    "Old Indian Defense: Main Line"
  ],
  "r1bqkb1r/pppn1ppp/3p1n2/4p3/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "A55",
    "Old Indian Defense: Main Line"
  ],
  "r1bqkb1r/pppn1ppp/3p1n2/4p3/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq": [
    "A55",
    "Old Indian Defense: Main Line"
  ],
  "rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A56",
    "Benoni Defense"
  ],
  "rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A56",
    "Czech Benoni Defense"
  ],
  "rnbqkb1r/pp1p1ppp/5n2/2pPp3/2P5/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A56",
    "Czech Benoni Defense"
  ],
  "rnbqkb1r/pp1p1ppp/5n2/2pPp3/2P5/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "A56",
    "Czech Benoni Defense"
  ],
  "rnbqkb1r/pp3ppp/3p1n2/2pPp3/2P5/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "A56",
    "Czech Benoni Defense"
  ],
  "rnbqkb1r/pp3ppp/3p1n2/2pPp3/2P1P3/2N5/PP3PPP/R1BQKBNR b KQkq": [
    "A56",
    "Czech Benoni Defense"
  ],
  "rnbqk2r/pp2bppp/3p1n2/2pPp3/2P1P3/2N5/PP3PPP/R1BQKBNR w KQkq": [
    "A56",
    "Czech Benoni Defense"
  ],
  "rnbqkb1r/p2ppppp/5n2/1ppP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A57",
    "Benko Gambit"
  ],
  "rnbqkb1r/p2ppppp/5n2/1PpP4/8/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A58",
    "Benko Gambit Accepted"
  ],
  "rnbqkb1r/3ppppp/p4n2/1PpP4/8/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A58",
    "Benko Gambit Accepted"
  ],
  "rnbqkb1r/3ppppp/P4n2/2pP4/8/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A58",
    "Benko Gambit Accepted"
  ],
  "rn1qkb1r/3ppppp/b4n2/2pP4/8/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A58",
    "Benko Gambit Accepted"
  ],
  "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A60",
    "Modern Benoni"
  ],
  "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "A61",
    "Modern Benoni: Fianchetto"
  ],
  "rnbqkb1r/pp1p1ppp/5n2/2pp4/2P5/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "A61",
    "Modern Benoni: Fianchetto"
  ],
  "rnbqkb1r/pp1p1ppp/5n2/2pP4/8/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "A61",
    "Modern Benoni: Fianchetto"
  ],
  "rnbqkb1r/pp3ppp/3p1n2/2pP4/8/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "A61",
    "Modern Benoni: Fianchetto"
  ],
  "rnbqkb1r/pp3ppp/3p1n2/2pP4/8/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "A61",
    "Modern Benoni: Fianchetto"
  ],
  "rnbqkb1r/pp3p1p/3p1np1/2pP4/8/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "A61",
    "Modern Benoni: Fianchetto"
  ],
  "rnbqkb1r/pp3p1p/3p1np1/2pP4/8/2N2NP1/PP2PP1P/R1BQKB1R b KQkq": [
    "A61",
    "Modern Benoni: Fianchetto"
  ],
  "rnbqkb1r/pp3ppp/3p1n2/2pP4/4P3/2N5/PP3PPP/R1BQKBNR b KQkq": [
    "A65",
    "Modern Benoni: Main Line"
  ],
  "rnbqkb1r/pp3p1p/3p1np1/2pP4/4P3/2N5/PP3PPP/R1BQKBNR w KQkq": [
    "A65",
    "Modern Benoni: Main Line"
  ],
  "rnbqkb1r/pp3p1p/3p1np1/2pP4/4P3/2N2N2/PP3PPP/R1BQKB1R b KQkq": [
    "A70",
    "Modern Benoni: Classical Variation"
  ],
  "rnbqk2r/pp3pbp/3p1np1/2pP4/4P3/2N2N2/PP3PPP/R1BQKB1R w KQkq": [
    "A70",
    "Modern Benoni: Classical Variation"
  ],
  "rnbqk2r/pp3pbp/3p1np1/2pP4/4P3/2N2N2/PP2BPPP/R1BQK2R b KQkq": [
    "A70",
    "Modern Benoni: Classical Variation"
  ],
  "rnbq1rk1/pp3pbp/3p1np1/2pP4/4P3/2N2N2/PP2BPPP/R1BQK2R w KQ": [
    "A70",
    "Modern Benoni: Classical Variation"
  ],
  "rnbq1rk1/pp3pbp/3p1np1/2pP4/4P3/2N2N2/PP2BPPP/R1BQ1RK1 b -": [
    "A70",
    "Modern Benoni: Classical Variation"
  ],
  "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "A80",
    "Dutch Defense"
  ],
  "rnbqkbnr/ppppp1pp/8/5p2/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "A80",
    "Staunton Gambit"
  ],
  "rnbqkbnr/ppppp1pp/8/5pB1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq": [
    "A80",
    "Hopton Attack"
  ],
  "rnbqkbnr/ppppp1pp/8/5p2/3P4/6P1/PPP1PP1P/RNBQKBNR b KQkq": [
    "A81",
    "Dutch Defense: Fianchetto Attack"
  ],
  "rnbqkbnr/ppppp1pp/8/8/3Pp3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "A83",
    "Staunton Gambit Accepted"
  ],
  "rnbqkbnr/ppppp1pp/8/8/3Pp3/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "A83",
    "Staunton Gambit Accepted"
  ],
  "rnbqkb1r/ppppp1pp/5n2/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "A83",
    "Staunton Gambit Accepted"
  ],
  "rnbqkb1r/ppppp1pp/5n2/6B1/3Pp3/2N5/PPP2PPP/R2QKBNR b KQkq": [
    "A83",
    "Staunton Gambit Accepted"
  ],
  "rnbqkbnr/ppppp1pp/8/5p2/2PP4/8/PP2PPPP/RNBQKBNR b KQkq": [
    "A85",
    "Dutch Defense: Queen Knight Variation"
  ],
  "rnbqkb1r/ppppp1pp/5n2/5p2/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "A85",
    "Dutch Defense: Queen Knight Variation"
  ],
  "rnbqkb1r/ppppp1pp/5n2/5p2/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "A85",
    "Dutch Defense: Queen Knight Variation"
  ],
  "rnbqkb1r/ppppp1pp/5n2/5p2/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbqkb1r/ppppp2p/5np1/5p2/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbqkb1r/ppppp2p/5np1/5p2/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbqk2r/ppppp1bp/5np1/5p2/2PP4/6P1/PP2PPBP/RNBQK1NR w KQkq": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbqk2r/ppppp1bp/5np1/5p2/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbq1rk1/ppppp1bp/5np1/5p2/2PP4/5NP1/PP2PPBP/RNBQK2R w KQ": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbq1rk1/ppppp1bp/5np1/5p2/2PP4/5NP1/PP2PPBP/RNBQ1RK1 b -": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbq1rk1/ppp1p1bp/3p1np1/5p2/2PP4/5NP1/PP2PPBP/RNBQ1RK1 w -": [
    "A87",
    "Dutch Defense: Leningrad Variation"
  ],
  "rnbqkb1r/pppp2pp/4pn2/5p2/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq": [
    "A90",
    "Dutch Defense: Stonewall Variation"
  ],
  "rnbqkb1r/pppp2pp/4pn2/5p2/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq": [
    "A90",
    "Dutch Defense: Stonewall Variation"
  ],
  "rnbqkb1r/ppp3pp/4pn2/3p1p2/2PP4/6P1/PP2PPBP/RNBQK1NR w KQkq": [
    "A90",
    "Dutch Defense: Stonewall Variation"
  ],
  "rnbqkb1r/ppp3pp/4pn2/3p1p2/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq": [
    "A90",
    "Dutch Defense: Stonewall Variation"
  ],
  "rnbqkb1r/pp4pp/2p1pn2/3p1p2/2PP4/5NP1/PP2PPBP/RNBQK2R w KQkq": [
    "A90",
    "Dutch Defense: Stonewall Variation"
  ],
  "rnbqkb1r/pp4pp/2p1pn2/3p1p2/2PP4/5NP1/PP2PPBP/RNBQ1RK1 b kq": [
    "A90",
    "Dutch Defense: Stonewall Variation"
  ],
  "rnbqk2r/pp4pp/2pbpn2/3p1p2/2PP4/5NP1/PP2PPBP/RNBQ1RK1 w kq": [
    "A90",
    "Dutch Defense: Stonewall Variation"
  ],
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq": [
    "B00",
    "King's Pawn Opening"
  ],
  "r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B00",
    "Nimzowitsch Defense"
  ],
  "r1bqkbnr/pppppppp/2n5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B00",
    "Nimzowitsch Defense: Kennedy Variation"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B00",
    "Nimzowitsch Defense: Kennedy Variation"
  ],
  "rnbqkbnr/p1pppppp/1p6/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B00",
    "Owen Defense"
  ],
  "rnbqkbnr/1ppppppp/p7/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B00",
    "St. George Defense"
  ],
  "rnbqkbnr/1ppppppp/p7/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B00",
    "St. George Defense"
  ],
  "rnbqkbnr/2pppppp/p7/1p6/3PP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B00",
    "St. George Defense"
  ],
  "rnbqkbnr/pppppp1p/8/6p1/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B00",
    "Borg Defense"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense"
  ],
  "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq": [
    "B01",
    "Scandinavian Defense: Mieses-Kotroc"
  ],
  "rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Mieses-Kotroc"
  ],
  "rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq": [
    "B01",
    "Scandinavian Defense: Main Line (Qa5)"
  ],
  "rnb1kbnr/ppp1pppp/8/q7/8/2N5/PPPP1PPP/R1BQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Main Line (Qa5)"
  ],
  "rnb1kbnr/ppp1pppp/8/q7/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "B01",
    "Scandinavian Defense: Main Line (Qa5)"
  ],
  "rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Main Line (Qa5)"
  ],
  "rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N2N2/PPP2PPP/R1BQKB1R b KQkq": [
    "B01",
    "Scandinavian Defense: Main Line (Qa5)"
  ],
  "rnb1kbnr/ppp1pppp/3q4/8/8/2N5/PPPP1PPP/R1BQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Gubinsky-Melts (Qd6)"
  ],
  "rnb1kbnr/ppp1pppp/3q4/8/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "B01",
    "Scandinavian Defense: Gubinsky-Melts (Qd6)"
  ],
  "rnb1kb1r/ppp1pppp/3q1n2/8/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Gubinsky-Melts (Qd6)"
  ],
  "rnbqkbnr/ppp1pppp/8/8/8/2N5/PPPP1PPP/R1BQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Classical (Qd8)"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3P4/8/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Modern Variation"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3P4/2P5/8/PP1P1PPP/RNBQKBNR b KQkq": [
    "B01",
    "Scandinavian Defense: Icelandic Gambit"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3P4/2P5/8/PP1P1PPP/RNBQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Icelandic Gambit"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B01",
    "Scandinavian Defense: Portuguese Variation"
  ],
  "rn1qkb1r/ppp1pppp/5n2/3P4/3P2b1/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B01",
    "Scandinavian Defense: Portuguese Variation"
  ],
  "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B02",
    "Alekhine's Defense"
  ],
  "rnbqkb1r/pppppppp/5n2/8/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq": [
    "B02",
    "Alekhine's Defense: Scandinavian Variation"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq": [
    "B02",
    "Alekhine's Defense: Scandinavian Variation"
  ],
  "rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq": [
    "B03",
    "Alekhine's Defense: Chase Variation"
  ],
  "rnbqkb1r/pppppppp/8/3nP3/8/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B03",
    "Alekhine's Defense: Chase Variation"
  ],
  "rnbqkb1r/pppppppp/8/3nP3/2P5/8/PP1P1PPP/RNBQKBNR b KQkq": [
    "B03",
    "Alekhine's Defense: Chase Variation"
  ],
  "rnbqkb1r/pppppppp/1n6/4P3/2P5/8/PP1P1PPP/RNBQKBNR w KQkq": [
    "B03",
    "Alekhine's Defense: Chase Variation"
  ],
  "rnbqkb1r/pppppppp/1n6/4P3/2PP4/8/PP3PPP/RNBQKBNR b KQkq": [
    "B03",
    "Alekhine's Defense: Chase Variation"
  ],
  "rnbqkb1r/pppppppp/8/3nP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B03",
    "Alekhine's Defense: Four Pawns Attack"
  ],
  "rnbqkb1r/ppp1pppp/3p4/3nP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B03",
    "Alekhine's Defense: Four Pawns Attack"
  ],
  "rnbqkb1r/ppp1pppp/3p4/3nP3/2PP4/8/PP3PPP/RNBQKBNR b KQkq": [
    "B03",
    "Alekhine's Defense: Four Pawns Attack"
  ],
  "rnbqkb1r/ppp1pppp/1n1p4/4P3/2PP4/8/PP3PPP/RNBQKBNR w KQkq": [
    "B03",
    "Alekhine's Defense: Four Pawns Attack"
  ],
  "rnbqkb1r/ppp1pppp/1n1p4/4P3/2PP1P2/8/PP4PP/RNBQKBNR b KQkq": [
    "B03",
    "Alekhine's Defense: Four Pawns Attack"
  ],
  "rnbqkb1r/ppp1pppp/1n1P4/8/2PP4/8/PP3PPP/RNBQKBNR b KQkq": [
    "B03",
    "Alekhine's Defense: Exchange Variation"
  ],
  "rnbqkb1r/ppp1pppp/3p4/3nP3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "B04",
    "Alekhine's Defense: Modern Variation"
  ],
  "rnbqkbnr/pppppp1p/6p1/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B06",
    "Modern Defense (Robatsch)"
  ],
  "rnbqkbnr/pppppp1p/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B06",
    "Modern Defense: Standard Line"
  ],
  "rnbqk1nr/ppppppbp/6p1/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B06",
    "Modern Defense: Standard Line"
  ],
  "rnbqk1nr/ppppppbp/6p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "B06",
    "Modern Defense: Standard Line"
  ],
  "rnbqk1nr/ppp1ppbp/3p2p1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "B06",
    "Modern Defense: Standard Line"
  ],
  "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B07",
    "Pirc Defense"
  ],
  "rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B07",
    "Pirc Defense"
  ],
  "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B07",
    "Pirc Defense"
  ],
  "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "B07",
    "Pirc Defense"
  ],
  "r1bqkb1r/pppnpppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "B07",
    "Pirc Defense: Lion / Philidor Setup"
  ],
  "rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "B07",
    "Pirc Defense: 150 Attack"
  ],
  "rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR b KQkq": [
    "B07",
    "Pirc Defense: 150 Attack"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/3PP3/2N1B3/PPP2PPP/R2QKBNR w KQkq": [
    "B07",
    "Pirc Defense: 150 Attack"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/3PP3/2N1B3/PPPQ1PPP/R3KBNR b KQkq": [
    "B07",
    "Pirc Defense: 150 Attack"
  ],
  "rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq": [
    "B08",
    "Pirc Defense: Classical System"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq": [
    "B08",
    "Pirc Defense: Classical System"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQK2R b KQkq": [
    "B08",
    "Pirc Defense: Classical System"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQK2R w KQ": [
    "B08",
    "Pirc Defense: Classical System"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 b -": [
    "B08",
    "Pirc Defense: Classical System"
  ],
  "rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq": [
    "B09",
    "Pirc Defense: Austrian Attack"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR w KQkq": [
    "B09",
    "Pirc Defense: Austrian Attack"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R b KQkq": [
    "B09",
    "Pirc Defense: Austrian Attack"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/3PPP2/2N2N2/PPP3PP/R1BQKB1R w KQ": [
    "B09",
    "Pirc Defense: Austrian Attack"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B10",
    "Caro-Kann Defense"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq": [
    "B10",
    "Caro-Kann Defense: Two Knights Attack"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq": [
    "B10",
    "Caro-Kann Defense: Two Knights Attack"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq": [
    "B10",
    "Caro-Kann Defense: Two Knights Attack"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/2P1P3/8/PP1P1PPP/RNBQKBNR b KQkq": [
    "B10",
    "Caro-Kann Defense: Accelerated Panov"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/2P1P3/8/PP1P1PPP/RNBQKBNR w KQkq": [
    "B10",
    "Caro-Kann Defense: Accelerated Panov"
  ],
  "rnbqkbnr/pp2pppp/2p5/3P4/2P5/8/PP1P1PPP/RNBQKBNR b KQkq": [
    "B10",
    "Caro-Kann Defense: Accelerated Panov"
  ],
  "rnbqkbnr/pp2pppp/8/3p4/2P5/8/PP1P1PPP/RNBQKBNR w KQkq": [
    "B10",
    "Caro-Kann Defense: Accelerated Panov"
  ],
  "rnbqkbnr/pp2pppp/8/3P4/8/8/PP1P1PPP/RNBQKBNR b KQkq": [
    "B10",
    "Caro-Kann Defense: Accelerated Panov"
  ],
  "rnbqkb1r/pp2pppp/5n2/3P4/8/8/PP1P1PPP/RNBQKBNR w KQkq": [
    "B10",
    "Caro-Kann Defense: Accelerated Panov"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq": [
    "B10",
    "Caro-Kann Defense: Hillbilly Attack"
  ],
  "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B12",
    "Caro-Kann Defense: Main Line"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B12",
    "Caro-Kann Defense: Main Line"
  ],
  "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B12",
    "Caro-Kann Defense: Advance Variation"
  ],
  "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B12",
    "Caro-Kann Defense: Advance Tal Variation"
  ],
  "rn1qkbnr/pp2pppp/2p5/3pPb2/3P3P/8/PPP2PP1/RNBQKBNR b KQkq": [
    "B12",
    "Caro-Kann Defense: Advance Tal Variation"
  ],
  "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "B12",
    "Caro-Kann Defense: Advance Short Variation"
  ],
  "rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "B12",
    "Caro-Kann Defense: Advance Short Variation"
  ],
  "rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R b KQkq": [
    "B12",
    "Caro-Kann Defense: Advance Short Variation"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/5P2/PPP3PP/RNBQKBNR b KQkq": [
    "B12",
    "Caro-Kann Defense: Fantasy Variation"
  ],
  "rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B13",
    "Caro-Kann Defense: Exchange Variation"
  ],
  "rnbqkbnr/pp2pppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B13",
    "Caro-Kann Defense: Exchange Variation"
  ],
  "rnbqkbnr/pp2pppp/8/3p4/3P4/3B4/PPP2PPP/RNBQK1NR b KQkq": [
    "B13",
    "Caro-Kann Defense: Exchange Variation"
  ],
  "rnbqkbnr/pp2pppp/8/3p4/2PP4/8/PP3PPP/RNBQKBNR b KQkq": [
    "B14",
    "Caro-Kann Defense: Panov-Botvinnik Attack"
  ],
  "rnbqkb1r/pp2pppp/5n2/3p4/2PP4/8/PP3PPP/RNBQKBNR w KQkq": [
    "B14",
    "Caro-Kann Defense: Panov-Botvinnik Attack"
  ],
  "rnbqkb1r/pp2pppp/5n2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR b KQkq": [
    "B14",
    "Caro-Kann Defense: Panov-Botvinnik Attack"
  ],
  "rnbqkb1r/pp3ppp/4pn2/3p4/2PP4/2N5/PP3PPP/R1BQKBNR w KQkq": [
    "B14",
    "Caro-Kann Defense: Panov-Botvinnik Attack"
  ],
  "rnbqkb1r/pp3ppp/4pn2/3p4/2PP4/2N2N2/PP3PPP/R1BQKB1R b KQkq": [
    "B14",
    "Caro-Kann Defense: Panov-Botvinnik Attack"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "B15",
    "Caro-Kann Defense: Tartakower Variation"
  ],
  "rnbqkbnr/pp2pppp/2p5/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "B15",
    "Caro-Kann Defense: Tartakower Variation"
  ],
  "rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq": [
    "B15",
    "Caro-Kann Defense: Tartakower Variation"
  ],
  "rnbqkb1r/pp2pppp/2p2n2/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq": [
    "B15",
    "Caro-Kann Defense: Tartakower Variation"
  ],
  "rnbqkb1r/pp2pppp/2p2N2/8/3P4/8/PPP2PPP/R1BQKBNR b KQkq": [
    "B15",
    "Caro-Kann Defense: Tartakower Variation"
  ],
  "rnbqkb1r/pp3ppp/2p2p2/8/3P4/8/PPP2PPP/R1BQKBNR w KQkq": [
    "B15",
    "Caro-Kann Defense: Tartakower Variation"
  ],
  "r1bqkbnr/pp1npppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR w KQkq": [
    "B17",
    "Caro-Kann Defense: Karpov Variation"
  ],
  "rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq": [
    "B18",
    "Caro-Kann Defense: Classical Variation"
  ],
  "rn1qkbnr/pp2pppp/2p5/5b2/3P4/6N1/PPP2PPP/R1BQKBNR b KQkq": [
    "B19",
    "Caro-Kann Defense: Classical Main Line"
  ],
  "rn1qkbnr/pp2pppp/2p3b1/8/3P4/6N1/PPP2PPP/R1BQKBNR w KQkq": [
    "B19",
    "Caro-Kann Defense: Classical Main Line"
  ],
  "rn1qkbnr/pp2pppp/2p3b1/8/3P3P/6N1/PPP2PP1/R1BQKBNR b KQkq": [
    "B19",
    "Caro-Kann Defense: Classical Main Line"
  ],
  "rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/6N1/PPP2PP1/R1BQKBNR w KQkq": [
    "B19",
    "Caro-Kann Defense: Classical Main Line"
  ],
  "rn1qkbnr/pp2ppp1/2p3bp/8/3P3P/5NN1/PPP2PP1/R1BQKB1R b KQkq": [
    "B19",
    "Caro-Kann Defense: Classical Main Line"
  ],
  "r2qkbnr/pp1nppp1/2p3bp/8/3P3P/5NN1/PPP2PP1/R1BQKB1R w KQkq": [
    "B19",
    "Caro-Kann Defense: Classical Main Line"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "B20",
    "Sicilian Defense"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq": [
    "B20",
    "Sicilian Defense: Bowdler Attack"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/P7/1PPP1PPP/RNBQKBNR b KQkq": [
    "B20",
    "Sicilian Defense: Mengarini Variation"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/1P2P3/8/P1PP1PPP/RNBQKBNR b KQkq": [
    "B20",
    "Sicilian Defense: Wing Gambit"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/4PP2/8/PPPP2PP/RNBQKBNR b KQkq": [
    "B21",
    "Sicilian Defense: McDonnell Attack"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "B21",
    "Sicilian Defense: Smith-Morra Gambit"
  ],
  "rnbqkbnr/pp1ppppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "B21",
    "Sicilian Defense: Smith-Morra Gambit"
  ],
  "rnbqkbnr/pp1ppppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq": [
    "B21",
    "Sicilian Defense: Smith-Morra Gambit"
  ],
  "rnbqkbnr/pp1ppppp/8/8/4P3/2p5/PP3PPP/RNBQKBNR w KQkq": [
    "B21",
    "Sicilian Defense: Smith-Morra Accepted"
  ],
  "rnbqkbnr/pp1ppppp/8/8/4P3/2N5/PP3PPP/R1BQKBNR b KQkq": [
    "B21",
    "Sicilian Defense: Smith-Morra Accepted"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR b KQkq": [
    "B22",
    "Sicilian Defense: Alapin Variation"
  ],
  "rnbqkb1r/pp1ppppp/5n2/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR w KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...Nf6)"
  ],
  "rnbqkb1r/pp1ppppp/5n2/2p1P3/8/2P5/PP1P1PPP/RNBQKBNR b KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...Nf6)"
  ],
  "rnbqkb1r/pp1ppppp/8/2pnP3/8/2P5/PP1P1PPP/RNBQKBNR w KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...Nf6)"
  ],
  "rnbqkb1r/pp1ppppp/8/2pnP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...Nf6)"
  ],
  "rnbqkb1r/pp1ppppp/8/3nP3/3p4/2P5/PP3PPP/RNBQKBNR w KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...Nf6)"
  ],
  "rnbqkb1r/pp1ppppp/8/3nP3/3p4/2P2N2/PP3PPP/RNBQKB1R b KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...Nf6)"
  ],
  "rnbqkbnr/pp2pppp/8/2pp4/4P3/2P5/PP1P1PPP/RNBQKBNR w KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...d5)"
  ],
  "rnbqkbnr/pp2pppp/8/2pP4/8/2P5/PP1P1PPP/RNBQKBNR b KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...d5)"
  ],
  "rnb1kbnr/pp2pppp/8/2pq4/8/2P5/PP1P1PPP/RNBQKBNR w KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...d5)"
  ],
  "rnb1kbnr/pp2pppp/8/2pq4/3P4/2P5/PP3PPP/RNBQKBNR b KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...d5)"
  ],
  "rnb1kb1r/pp2pppp/5n2/2pq4/3P4/2P5/PP3PPP/RNBQKBNR w KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...d5)"
  ],
  "rnb1kb1r/pp2pppp/5n2/2pq4/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq": [
    "B22",
    "Sicilian Defense: Alapin (2...d5)"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq": [
    "B23",
    "Sicilian Defense: Closed"
  ],
  "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq": [
    "B23",
    "Sicilian Defense: Grand Prix Attack"
  ],
  "r1bqkbnr/pp1ppppp/2n5/2p5/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq": [
    "B23",
    "Sicilian Defense: Grand Prix Attack"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/2p5/4PP2/2N5/PPPP2PP/R1BQKBNR w KQkq": [
    "B23",
    "Sicilian Defense: Grand Prix Attack"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/2p5/4PP2/2N2N2/PPPP2PP/R1BQKB1R b KQkq": [
    "B23",
    "Sicilian Defense: Grand Prix Attack"
  ],
  "r1bqk1nr/pp1pppbp/2n3p1/2p5/4PP2/2N2N2/PPPP2PP/R1BQKB1R w KQkq": [
    "B23",
    "Sicilian Defense: Grand Prix Attack"
  ],
  "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR b KQkq": [
    "B25",
    "Sicilian Defense: Closed Fianchetto"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR w KQkq": [
    "B25",
    "Sicilian Defense: Closed Fianchetto"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/2p5/4P3/2N3P1/PPPP1PBP/R1BQK1NR b KQkq": [
    "B25",
    "Sicilian Defense: Closed Fianchetto"
  ],
  "r1bqk1nr/pp1pppbp/2n3p1/2p5/4P3/2N3P1/PPPP1PBP/R1BQK1NR w KQkq": [
    "B25",
    "Sicilian Defense: Closed Fianchetto"
  ],
  "r1bqk1nr/pp1pppbp/2n3p1/2p5/4P3/2NP2P1/PPP2PBP/R1BQK1NR b KQkq": [
    "B25",
    "Sicilian Defense: Closed Fianchetto"
  ],
  "r1bqk1nr/pp2ppbp/2np2p1/2p5/4P3/2NP2P1/PPP2PBP/R1BQK1NR w KQkq": [
    "B25",
    "Sicilian Defense: Closed Fianchetto"
  ],
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq": [
    "B27",
    "Sicilian Defense: Open Invitation"
  ],
  "rnbqkbnr/pp1ppp1p/6p1/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "B27",
    "Sicilian Defense: Hyperaccelerated Dragon"
  ],
  "rnbqkbnr/1p1ppppp/p7/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "B28",
    "Sicilian Defense: O'Kelly Variation"
  ],
  "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "B30",
    "Sicilian Defense: Old Sicilian"
  ],
  "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq": [
    "B30",
    "Sicilian Defense: Rossolimo Variation"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "B31",
    "Sicilian Defense: Rossolimo Fianchetto"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/1Bp5/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq": [
    "B31",
    "Sicilian Defense: Rossolimo Fianchetto"
  ],
  "r1bqk1nr/pp1pppbp/2n3p1/1Bp5/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq": [
    "B31",
    "Sicilian Defense: Rossolimo Fianchetto"
  ],
  "r1bqkbnr/pp1ppppp/2n5/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "B32",
    "Sicilian Defense: Kalashnikov / Loewenthal"
  ],
  "r1bqkbnr/pp1ppppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "B32",
    "Sicilian Defense: Kalashnikov / Loewenthal"
  ],
  "r1bqkbnr/pp1ppppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq": [
    "B32",
    "Sicilian Defense: Kalashnikov / Loewenthal"
  ],
  "r1bqkbnr/pp1p1ppp/2n5/4p3/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "B32",
    "Sicilian Defense: Kalashnikov / Loewenthal"
  ],
  "r1bqkb1r/pp1ppppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Variation"
  ],
  "r1bqkb1r/pp1ppppp/2n2n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Variation"
  ],
  "r1bqkb1r/pp1p1ppp/2n2n2/4p3/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Variation"
  ],
  "r1bqkb1r/pp1p1ppp/2n2n2/1N2p3/4P3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Main Line"
  ],
  "r1bqkb1r/pp3ppp/2np1n2/1N2p3/4P3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Main Line"
  ],
  "r1bqkb1r/pp3ppp/2np1n2/1N2p1B1/4P3/2N5/PPP2PPP/R2QKB1R b KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Main Line"
  ],
  "r1bqkb1r/1p3ppp/p1np1n2/1N2p1B1/4P3/2N5/PPP2PPP/R2QKB1R w KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Main Line"
  ],
  "r1bqkb1r/1p3ppp/p1np1n2/4p1B1/4P3/N1N5/PPP2PPP/R2QKB1R b KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Main Line"
  ],
  "r1bqkb1r/5ppp/p1np1n2/1p2p1B1/4P3/N1N5/PPP2PPP/R2QKB1R w KQkq": [
    "B33",
    "Sicilian Defense: Sveshnikov Main Line"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "B35",
    "Sicilian Defense: Accelerated Dragon"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "B35",
    "Sicilian Defense: Accelerated Dragon"
  ],
  "r1bqk1nr/pp1pppbp/2n3p1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B35",
    "Sicilian Defense: Accelerated Dragon"
  ],
  "r1bqk1nr/pp1pppbp/2n3p1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq": [
    "B35",
    "Sicilian Defense: Accelerated Dragon"
  ],
  "r1bqk2r/pp1pppbp/2n2np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq": [
    "B35",
    "Sicilian Defense: Accelerated Dragon"
  ],
  "r1bqk2r/pp1pppbp/2n2np1/8/2BNP3/2N1B3/PPP2PPP/R2QK2R b KQkq": [
    "B35",
    "Sicilian Defense: Accelerated Dragon"
  ],
  "r1bqkbnr/pp1ppp1p/2n3p1/8/2PNP3/8/PP3PPP/RNBQKB1R b KQkq": [
    "B36",
    "Sicilian Defense: Maroczy Bind"
  ],
  "rnbqkbnr/pp1p1ppp/4p3/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "B40",
    "Sicilian Defense: French Variation"
  ],
  "rnbqkbnr/pp1p1ppp/4p3/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "B42",
    "Sicilian Defense: Kan Variation"
  ],
  "rnbqkbnr/pp1p1ppp/4p3/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "B42",
    "Sicilian Defense: Kan Variation"
  ],
  "rnbqkbnr/pp1p1ppp/4p3/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq": [
    "B42",
    "Sicilian Defense: Kan Variation"
  ],
  "rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "B42",
    "Sicilian Defense: Kan Variation"
  ],
  "rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/3B4/PPP2PPP/RNBQK2R b KQkq": [
    "B42",
    "Sicilian Defense: Kan Variation"
  ],
  "rnbqkb1r/pp1p1ppp/4pn2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "B45",
    "Sicilian Defense: Four Knights"
  ],
  "rnbqkb1r/pp1p1ppp/4pn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "B45",
    "Sicilian Defense: Four Knights"
  ],
  "r1bqkb1r/pp1p1ppp/2n1pn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B45",
    "Sicilian Defense: Four Knights"
  ],
  "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "B47",
    "Sicilian Defense: Taimanov Variation"
  ],
  "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "B47",
    "Sicilian Defense: Taimanov Variation"
  ],
  "r1b1kbnr/ppqp1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B47",
    "Sicilian Defense: Taimanov Variation"
  ],
  "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "B50",
    "Sicilian Defense: Modern (2...d6)"
  ],
  "rnbqkbnr/pp2pppp/3p4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq": [
    "B51",
    "Sicilian Defense: Moscow (Canal-Sokolsky)"
  ],
  "rn1qkbnr/pp1bpppp/3p4/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "B52",
    "Sicilian Defense: Moscow (3...Bd7)"
  ],
  "rn1qkbnr/pp1Bpppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq": [
    "B52",
    "Sicilian Defense: Moscow (3...Bd7)"
  ],
  "rn2kbnr/pp1qpppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "B52",
    "Sicilian Defense: Moscow (3...Bd7)"
  ],
  "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "B54",
    "Sicilian Defense: Open"
  ],
  "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "B54",
    "Sicilian Defense: Open"
  ],
  "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq": [
    "B54",
    "Sicilian Defense: Open"
  ],
  "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "B56",
    "Sicilian Defense: Classical"
  ],
  "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "B56",
    "Sicilian Defense: Classical"
  ],
  "r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B57",
    "Sicilian Defense: Classical Sozin"
  ],
  "r1bqkb1r/pp2pppp/2np1n2/8/2BNP3/2N5/PPP2PPP/R1BQK2R b KQkq": [
    "B57",
    "Sicilian Defense: Classical Sozin"
  ],
  "r1bqkb1r/pp2pppp/2np1n2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq": [
    "B60",
    "Sicilian Defense: Richter-Rauzer"
  ],
  "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B70",
    "Sicilian Defense: Dragon Variation"
  ],
  "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq": [
    "B72",
    "Sicilian Defense: Dragon Classical"
  ],
  "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq": [
    "B72",
    "Sicilian Defense: Dragon Classical"
  ],
  "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP1BPPP/R2QK2R b KQkq": [
    "B72",
    "Sicilian Defense: Dragon Classical"
  ],
  "rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq": [
    "B76",
    "Sicilian Defense: Dragon Yugoslav Attack"
  ],
  "rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQ": [
    "B76",
    "Sicilian Defense: Dragon Yugoslav Attack"
  ],
  "rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ": [
    "B76",
    "Sicilian Defense: Dragon Yugoslav Attack"
  ],
  "r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ": [
    "B76",
    "Sicilian Defense: Dragon Yugoslav Attack"
  ],
  "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B80",
    "Sicilian Defense: Scheveningen Variation"
  ],
  "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq": [
    "B80",
    "Sicilian Defense: Scheveningen English Attack"
  ],
  "rnbqkb1r/1p3ppp/p2ppn2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq": [
    "B80",
    "Sicilian Defense: Scheveningen English Attack"
  ],
  "rnbqkb1r/1p3ppp/p2ppn2/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq": [
    "B80",
    "Sicilian Defense: Scheveningen English Attack"
  ],
  "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq": [
    "B84",
    "Sicilian Defense: Scheveningen Classical"
  ],
  "rnbqkb1r/1p3ppp/p2ppn2/8/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq": [
    "B84",
    "Sicilian Defense: Scheveningen Classical"
  ],
  "rnbqkb1r/1p3ppp/p2ppn2/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 b kq": [
    "B84",
    "Sicilian Defense: Scheveningen Classical"
  ],
  "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "B90",
    "Sicilian Defense: Najdorf Variation"
  ],
  "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq": [
    "B90",
    "Sicilian Defense: Najdorf English Attack"
  ],
  "rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq": [
    "B90",
    "Sicilian Defense: Najdorf English Attack"
  ],
  "rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R b KQkq": [
    "B90",
    "Sicilian Defense: Najdorf English Attack"
  ],
  "rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1B3/PPP2PPP/R2QKB1R w KQkq": [
    "B90",
    "Sicilian Defense: Najdorf English Attack"
  ],
  "rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R b KQkq": [
    "B90",
    "Sicilian Defense: Najdorf English Attack"
  ],
  "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq": [
    "B92",
    "Sicilian Defense: Najdorf Opocensky (6.Be2)"
  ],
  "rnbqkb1r/1p3ppp/p2p1n2/4p3/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq": [
    "B92",
    "Sicilian Defense: Najdorf Opocensky (6.Be2)"
  ],
  "rnbqkb1r/1p3ppp/p2p1n2/4p3/4P3/1NN5/PPP1BPPP/R1BQK2R b KQkq": [
    "B92",
    "Sicilian Defense: Najdorf Opocensky (6.Be2)"
  ],
  "rnbqkb1r/1p2pppp/p2p1n2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq": [
    "B94",
    "Sicilian Defense: Najdorf (6.Bg5)"
  ],
  "rnbqkb1r/1p3ppp/p2ppn2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R w KQkq": [
    "B96",
    "Sicilian Defense: Najdorf Main Line"
  ],
  "rnbqkb1r/1p3ppp/p2ppn2/6B1/3NPP2/2N5/PPP3PP/R2QKB1R b KQkq": [
    "B96",
    "Sicilian Defense: Najdorf Main Line"
  ],
  "rnb1kb1r/1p3ppp/pq1ppn2/6B1/3NPP2/2N5/PPP3PP/R2QKB1R w KQkq": [
    "B97",
    "Sicilian Defense: Najdorf Poisoned Pawn"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "C00",
    "French Defense"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/4P3/3P4/PPP2PPP/RNBQKBNR b KQkq": [
    "C00",
    "French Defense: King Indian Attack"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq": [
    "C00",
    "French Defense: King Indian Attack"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/3P4/PPPN1PPP/R1BQKBNR b KQkq": [
    "C00",
    "French Defense: King Indian Attack"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq": [
    "C00",
    "French Defense: Two Knights Variation"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C00",
    "French Defense: Two Knights Variation"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq": [
    "C00",
    "French Defense: Two Knights Variation"
  ],
  "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "C01",
    "French Defense: Exchange Variation"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "C01",
    "French Defense: Exchange Variation"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3P4/3P4/8/PPP2PPP/RNBQKBNR b KQkq": [
    "C01",
    "French Defense: Exchange Variation"
  ],
  "rnbqkbnr/ppp2ppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq": [
    "C01",
    "French Defense: Exchange Variation"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq": [
    "C02",
    "French Defense: Advance Variation"
  ],
  "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq": [
    "C02",
    "French Defense: Advance Paulsen Attack"
  ],
  "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq": [
    "C02",
    "French Defense: Advance Paulsen Attack"
  ],
  "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR w KQkq": [
    "C02",
    "French Defense: Advance Paulsen Attack"
  ],
  "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq": [
    "C02",
    "French Defense: Advance Paulsen Attack"
  ],
  "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq": [
    "C02",
    "French Defense: Advance Paulsen Attack"
  ],
  "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2PB1N2/PP3PPP/RNBQK2R b KQkq": [
    "C02",
    "French Defense: Milner-Barry Gambit"
  ],
  "r1b1kbnr/pp3ppp/1qn1p3/3pP3/3p4/2PB1N2/PP3PPP/RNBQK2R w KQkq": [
    "C02",
    "French Defense: Milner-Barry Gambit"
  ],
  "r1b1kbnr/pp3ppp/1qn1p3/3pP3/3P4/3B1N2/PP3PPP/RNBQK2R b KQkq": [
    "C02",
    "French Defense: Milner-Barry Gambit"
  ],
  "r3kbnr/pp1b1ppp/1qn1p3/3pP3/3P4/3B1N2/PP3PPP/RNBQK2R w KQkq": [
    "C02",
    "French Defense: Milner-Barry Gambit"
  ],
  "r3kbnr/pp1b1ppp/1qn1p3/3pP3/3P4/3B1N2/PP3PPP/RNBQ1RK1 b kq": [
    "C02",
    "French Defense: Milner-Barry Gambit"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPPN1PPP/R1BQKBNR b KQkq": [
    "C03",
    "French Defense: Tarrasch Variation"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/8/PPPN1PPP/R1BQKBNR w KQkq": [
    "C05",
    "French Defense: Tarrasch Closed"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3pP3/3P4/8/PPPN1PPP/R1BQKBNR b KQkq": [
    "C05",
    "French Defense: Tarrasch Closed"
  ],
  "rnbqkb1r/pppn1ppp/4p3/3pP3/3P4/8/PPPN1PPP/R1BQKBNR w KQkq": [
    "C05",
    "French Defense: Tarrasch Closed"
  ],
  "rnbqkb1r/pppn1ppp/4p3/3pP3/3P4/3B4/PPPN1PPP/R1BQK1NR b KQkq": [
    "C05",
    "French Defense: Tarrasch Closed"
  ],
  "rnbqkb1r/pp1n1ppp/4p3/2ppP3/3P4/3B4/PPPN1PPP/R1BQK1NR w KQkq": [
    "C05",
    "French Defense: Tarrasch Closed"
  ],
  "rnbqkb1r/pp1n1ppp/4p3/2ppP3/3P4/2PB4/PP1N1PPP/R1BQK1NR b KQkq": [
    "C05",
    "French Defense: Tarrasch Closed"
  ],
  "r1bqkb1r/pp1n1ppp/2n1p3/2ppP3/3P4/2PB4/PP1N1PPP/R1BQK1NR w KQkq": [
    "C05",
    "French Defense: Tarrasch Closed"
  ],
  "rnbqkbnr/pp3ppp/4p3/2pp4/3PP3/8/PPPN1PPP/R1BQKBNR w KQkq": [
    "C07",
    "French Defense: Tarrasch Open"
  ],
  "rnbqkbnr/pp3ppp/4p3/2pP4/3P4/8/PPPN1PPP/R1BQKBNR b KQkq": [
    "C07",
    "French Defense: Tarrasch Open"
  ],
  "rnb1kbnr/pp3ppp/4p3/2pq4/3P4/8/PPPN1PPP/R1BQKBNR w KQkq": [
    "C07",
    "French Defense: Tarrasch Open"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "C10",
    "French Defense: Paulsen / Rubinstein"
  ],
  "rnbqkbnr/ppp2ppp/4p3/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "C10",
    "French Defense: Rubinstein Variation"
  ],
  "rnbqkbnr/ppp2ppp/4p3/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq": [
    "C10",
    "French Defense: Rubinstein Variation"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "C11",
    "French Defense: Classical Variation"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3pP3/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "C11",
    "French Defense: Steinitz Variation"
  ],
  "rnbqkb1r/pppn1ppp/4p3/3pP3/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "C11",
    "French Defense: Steinitz Variation"
  ],
  "rnbqkb1r/pppn1ppp/4p3/3pP3/3P1P2/2N5/PPP3PP/R1BQKBNR b KQkq": [
    "C11",
    "French Defense: Steinitz Variation"
  ],
  "rnbqkb1r/pp1n1ppp/4p3/2ppP3/3P1P2/2N5/PPP3PP/R1BQKBNR w KQkq": [
    "C11",
    "French Defense: Steinitz Variation"
  ],
  "rnbqkb1r/pp1n1ppp/4p3/2ppP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R b KQkq": [
    "C11",
    "French Defense: Steinitz Variation"
  ],
  "r1bqkb1r/pp1n1ppp/2n1p3/2ppP3/3P1P2/2N2N2/PPP3PP/R1BQKB1R w KQkq": [
    "C11",
    "French Defense: Steinitz Variation"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR b KQkq": [
    "C12",
    "French Defense: MacCutcheon Variation"
  ],
  "rnbqk2r/ppp2ppp/4pn2/3p2B1/1b1PP3/2N5/PPP2PPP/R2QKBNR w KQkq": [
    "C12",
    "French Defense: MacCutcheon Variation"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3p2B1/3PP3/2N5/PPP2PPP/R2QKBNR w KQkq": [
    "C14",
    "French Defense: Classical (Bg5 Be7)"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3pP1B1/3P4/2N5/PPP2PPP/R2QKBNR b KQkq": [
    "C14",
    "French Defense: Classical (Bg5 Be7)"
  ],
  "rnbqk2r/pppnbppp/4p3/3pP1B1/3P4/2N5/PPP2PPP/R2QKBNR w KQkq": [
    "C14",
    "French Defense: Classical (Bg5 Be7)"
  ],
  "rnbqk2r/pppnBppp/4p3/3pP3/3P4/2N5/PPP2PPP/R2QKBNR b KQkq": [
    "C14",
    "French Defense: Classical (Bg5 Be7)"
  ],
  "rnb1k2r/pppnqppp/4p3/3pP3/3P4/2N5/PPP2PPP/R2QKBNR w KQkq": [
    "C14",
    "French Defense: Classical (Bg5 Be7)"
  ],
  "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "C15",
    "French Defense: Winawer Variation"
  ],
  "rnbqk1nr/ppp2ppp/4p3/3pP3/1b1P4/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "C18",
    "French Defense: Winawer Poisoned Pawn"
  ],
  "rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "C18",
    "French Defense: Winawer Poisoned Pawn"
  ],
  "rnbqk1nr/pp3ppp/4p3/2ppP3/1b1P4/P1N5/1PP2PPP/R1BQKBNR b KQkq": [
    "C18",
    "French Defense: Winawer Poisoned Pawn"
  ],
  "rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1b5/1PP2PPP/R1BQKBNR w KQkq": [
    "C18",
    "French Defense: Winawer Poisoned Pawn"
  ],
  "rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR b KQkq": [
    "C18",
    "French Defense: Winawer Poisoned Pawn"
  ],
  "rnbqk2r/pp2nppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR w KQkq": [
    "C18",
    "French Defense: Winawer Poisoned Pawn"
  ],
  "rnbqk2r/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/2P2PPP/R1B1KBNR b KQkq": [
    "C18",
    "French Defense: Winawer Poisoned Pawn"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq": [
    "C20",
    "King's Pawn Game"
  ],
  "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq": [
    "C20",
    "Wayward Queen Attack"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/5Q2/PPPP1PPP/RNB1KBNR b KQkq": [
    "C20",
    "Napoleon Opening"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "C21",
    "Center Game"
  ],
  "rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "C21",
    "Center Game"
  ],
  "rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq": [
    "C21",
    "Danish Gambit"
  ],
  "rnbqkbnr/pppp1ppp/8/8/4P3/2p5/PP3PPP/RNBQKBNR w KQkq": [
    "C21",
    "Danish Gambit"
  ],
  "rnbqkbnr/pppp1ppp/8/8/2B1P3/2p5/PP3PPP/RNBQK1NR b KQkq": [
    "C21",
    "Danish Gambit"
  ],
  "rnbqkbnr/pppp1ppp/8/8/3QP3/8/PPP2PPP/RNB1KBNR b KQkq": [
    "C22",
    "Center Game Accepted"
  ],
  "r1bqkbnr/pppp1ppp/2n5/8/3QP3/8/PPP2PPP/RNB1KBNR w KQkq": [
    "C22",
    "Center Game Accepted"
  ],
  "r1bqkbnr/pppp1ppp/2n5/8/4P3/4Q3/PPP2PPP/RNB1KBNR b KQkq": [
    "C22",
    "Center Game Accepted"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq": [
    "C23",
    "Bishop's Opening"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq": [
    "C24",
    "Bishop's Opening: Berlin Defense"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/3P4/PPP2PPP/RNBQK1NR b KQkq": [
    "C24",
    "Bishop's Opening: Berlin Defense"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq": [
    "C25",
    "Vienna Game"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq": [
    "C26",
    "Vienna Game: Falkbeer Variation"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/2N5/PPPP1PPP/R1BQK1NR b KQkq": [
    "C27",
    "Vienna Game: Frankenstein-Dracula"
  ],
  "rnbqkb1r/pppp1ppp/8/4p3/2B1n3/2N5/PPPP1PPP/R1BQK1NR w KQkq": [
    "C27",
    "Vienna Game: Frankenstein-Dracula"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq": [
    "C29",
    "Vienna Gambit"
  ],
  "rnbqkb1r/ppp2ppp/5n2/3pp3/4PP2/2N5/PPPP2PP/R1BQKBNR w KQkq": [
    "C29",
    "Vienna Gambit"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq": [
    "C30",
    "King's Gambit"
  ],
  "rnbqk1nr/pppp1ppp/8/2b1p3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq": [
    "C30",
    "King's Gambit Declined: Classical"
  ],
  "rnbqk1nr/pppp1ppp/8/2b1p3/4PP2/5N2/PPPP2PP/RNBQKB1R b KQkq": [
    "C30",
    "King's Gambit Declined: Classical"
  ],
  "rnbqk1nr/ppp2ppp/3p4/2b1p3/4PP2/5N2/PPPP2PP/RNBQKB1R w KQkq": [
    "C30",
    "King's Gambit Declined: Classical"
  ],
  "rnbqkbnr/ppp2ppp/8/3pp3/4PP2/8/PPPP2PP/RNBQKBNR w KQkq": [
    "C31",
    "King's Gambit Declined: Falkbeer Countergambit"
  ],
  "rnbqkbnr/ppp2ppp/8/3Pp3/5P2/8/PPPP2PP/RNBQKBNR b KQkq": [
    "C31",
    "King's Gambit Declined: Falkbeer Countergambit"
  ],
  "rnbqkbnr/ppp2ppp/8/3P4/4pP2/8/PPPP2PP/RNBQKBNR w KQkq": [
    "C31",
    "King's Gambit Declined: Falkbeer Countergambit"
  ],
  "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNR w KQkq": [
    "C33",
    "King's Gambit Accepted"
  ],
  "rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R b KQkq": [
    "C36",
    "King's Gambit Accepted: Modern Defense"
  ],
  "rnbqkbnr/ppp2ppp/8/3p4/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq": [
    "C36",
    "King's Gambit Accepted: Modern Defense"
  ],
  "rnbqkbnr/pppp1p1p/8/6p1/4Pp2/5N2/PPPP2PP/RNBQKB1R w KQkq": [
    "C39",
    "King's Gambit Accepted: Kieseritzky"
  ],
  "rnbqkbnr/pppp1p1p/8/6p1/4Pp1P/5N2/PPPP2P1/RNBQKB1R b KQkq": [
    "C39",
    "King's Gambit Accepted: Kieseritzky"
  ],
  "rnbqkbnr/pppp1p1p/8/8/4PppP/5N2/PPPP2P1/RNBQKB1R w KQkq": [
    "C39",
    "King's Gambit Accepted: Kieseritzky"
  ],
  "rnbqkbnr/pppp1p1p/8/4N3/4PppP/8/PPPP2P1/RNBQKB1R b KQkq": [
    "C39",
    "King's Gambit Accepted: Kieseritzky"
  ],
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq": [
    "C40",
    "King's Knight Opening"
  ],
  "rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C40",
    "Elephant Gambit"
  ],
  "rnbqkbnr/pppp2pp/8/4pp2/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C40",
    "Latvian Gambit"
  ],
  "rnbqkbnr/pppp2pp/5p2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C40",
    "Damiano Defense"
  ],
  "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C41",
    "Philidor Defense"
  ],
  "rnbqkbnr/ppp2ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "C41",
    "Philidor Defense: Exchange Variation"
  ],
  "rnbqkbnr/ppp2ppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "C41",
    "Philidor Defense: Exchange Variation"
  ],
  "rnbqkbnr/ppp2ppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq": [
    "C41",
    "Philidor Defense: Exchange Variation"
  ],
  "rnbqkb1r/ppp2ppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "C41",
    "Philidor Defense: Exchange Variation"
  ],
  "rnbqkb1r/ppp2ppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "C41",
    "Philidor Defense: Exchange Variation"
  ],
  "rnbqk2r/ppp1bppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq": [
    "C41",
    "Philidor Defense: Exchange Variation"
  ],
  "r1bqkbnr/pppn1ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "C41",
    "Philidor Defense: Hanham Variation"
  ],
  "r1bqkbnr/pppn1ppp/3p4/4p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq": [
    "C41",
    "Philidor Defense: Hanham Variation"
  ],
  "r1bqkbnr/pp1n1ppp/2pp4/4p3/2BPP3/5N2/PPP2PPP/RNBQK2R w KQkq": [
    "C41",
    "Philidor Defense: Hanham Variation"
  ],
  "r1bqkbnr/pp1n1ppp/2pp4/4p3/2BPP3/5N2/PPP2PPP/RNBQ1RK1 b kq": [
    "C41",
    "Philidor Defense: Hanham Variation"
  ],
  "r1bqk1nr/pp1nbppp/2pp4/4p3/2BPP3/5N2/PPP2PPP/RNBQ1RK1 w kq": [
    "C41",
    "Philidor Defense: Hanham Variation"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C42",
    "Petrov's Defense (Russian Game)"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq": [
    "C42",
    "Petrov's Defense: Stafford Gambit"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq": [
    "C42",
    "Petrov's Defense: Stafford Gambit"
  ],
  "r1bqkb1r/pppp1ppp/2N2n2/8/4P3/8/PPPP1PPP/RNBQKB1R b KQkq": [
    "C42",
    "Petrov's Defense: Stafford Gambit"
  ],
  "r1bqkb1r/ppp2ppp/2p2n2/8/4P3/8/PPPP1PPP/RNBQKB1R w KQkq": [
    "C42",
    "Petrov's Defense: Stafford Gambit"
  ],
  "rnbqkb1r/ppp2ppp/3p1n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq": [
    "C42",
    "Petrov's Defense: Classical Attack"
  ],
  "rnbqkb1r/ppp2ppp/3p1n2/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq": [
    "C42",
    "Petrov's Defense: Classical Attack"
  ],
  "rnbqkb1r/ppp2ppp/3p4/8/4n3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C42",
    "Petrov's Defense: Classical Attack"
  ],
  "rnbqkb1r/ppp2ppp/3p4/8/3Pn3/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "C42",
    "Petrov's Defense: Classical Attack"
  ],
  "rnbqkb1r/ppp2ppp/8/3p4/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "C42",
    "Petrov's Defense: Classical Attack"
  ],
  "rnbqkb1r/ppp2ppp/8/3p4/3Pn3/3B1N2/PPP2PPP/RNBQK2R b KQkq": [
    "C42",
    "Petrov's Defense: Classical Attack"
  ],
  "rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "C43",
    "Petrov's Defense: Modern (Steinitz) Attack"
  ],
  "rnbqkb1r/pppp1ppp/8/4p3/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "C43",
    "Petrov's Defense: Modern (Steinitz) Attack"
  ],
  "rnbqkb1r/pppp1ppp/8/4p3/3Pn3/3B1N2/PPP2PPP/RNBQK2R b KQkq": [
    "C43",
    "Petrov's Defense: Modern (Steinitz) Attack"
  ],
  "rnbqkb1r/ppp2ppp/8/3pp3/3Pn3/3B1N2/PPP2PPP/RNBQK2R w KQkq": [
    "C43",
    "Petrov's Defense: Modern (Steinitz) Attack"
  ],
  "rnbqkb1r/ppp2ppp/8/3pN3/3Pn3/3B4/PPP2PPP/RNBQK2R b KQkq": [
    "C43",
    "Petrov's Defense: Modern (Steinitz) Attack"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq": [
    "C44",
    "Open Game: Normal"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2P2N2/PP1P1PPP/RNBQKB1R b KQkq": [
    "C44",
    "Ponziani Opening"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq": [
    "C44",
    "Scotch Gambit"
  ],
  "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq": [
    "C44",
    "Scotch Gambit"
  ],
  "r1bqkbnr/pppp1ppp/2n5/8/2BpP3/5N2/PPP2PPP/RNBQK2R b KQkq": [
    "C44",
    "Scotch Gambit"
  ],
  "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq": [
    "C45",
    "Scotch Game"
  ],
  "r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "C45",
    "Scotch Game: Classical Variation"
  ],
  "r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/4B3/PPP2PPP/RN1QKB1R b KQkq": [
    "C45",
    "Scotch Game: Classical Variation"
  ],
  "r1b1k1nr/pppp1ppp/2n2q2/2b5/3NP3/4B3/PPP2PPP/RN1QKB1R w KQkq": [
    "C45",
    "Scotch Game: Classical Variation"
  ],
  "r1b1k1nr/pppp1ppp/2n2q2/2b5/3NP3/2P1B3/PP3PPP/RN1QKB1R b KQkq": [
    "C45",
    "Scotch Game: Classical Variation"
  ],
  "r1b1k2r/ppppnppp/2n2q2/2b5/3NP3/2P1B3/PP3PPP/RN1QKB1R w KQkq": [
    "C45",
    "Scotch Game: Classical Variation"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "C45",
    "Scotch Game: Schmidt Variation"
  ],
  "r1bqkb1r/pppp1ppp/2N2n2/8/4P3/8/PPP2PPP/RNBQKB1R b KQkq": [
    "C45",
    "Scotch Game: Schmidt Variation"
  ],
  "r1bqkb1r/p1pp1ppp/2p2n2/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq": [
    "C45",
    "Scotch Game: Schmidt Variation"
  ],
  "r1bqkb1r/p1pp1ppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R b KQkq": [
    "C45",
    "Scotch Game: Schmidt Variation"
  ],
  "r1b1kb1r/p1ppqppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R w KQkq": [
    "C45",
    "Scotch Game: Schmidt Variation"
  ],
  "r1b1kb1r/p1ppqppp/2p2n2/4P3/8/8/PPP1QPPP/RNB1KB1R b KQkq": [
    "C45",
    "Scotch Game: Mieses Variation"
  ],
  "r1b1kb1r/p1ppqppp/2p5/3nP3/8/8/PPP1QPPP/RNB1KB1R w KQkq": [
    "C45",
    "Scotch Game: Mieses Variation"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq": [
    "C46",
    "Three Knights Opening"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq": [
    "C47",
    "Four Knights Game"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq": [
    "C47",
    "Four Knights Game: Scotch Variation"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/8/3pP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq": [
    "C47",
    "Four Knights Game: Scotch Variation"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq": [
    "C47",
    "Four Knights Game: Scotch Variation"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4N3/4P3/2N5/PPPP1PPP/R1BQKB1R b KQkq": [
    "C47",
    "Halloween Gambit"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq": [
    "C48",
    "Four Knights Game: Spanish Variation"
  ],
  "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq": [
    "C50",
    "Italian Game"
  ],
  "r1bqk1nr/ppppbppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C50",
    "Italian Game: Hungarian Defense"
  ],
  "r1bqkbnr/pppp1ppp/8/4p3/2BnP3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C50",
    "Blackburne Shilling Gambit"
  ],
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C50",
    "Giuoco Pianissimo"
  ],
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq": [
    "C50",
    "Giuoco Pianissimo"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq": [
    "C50",
    "Giuoco Pianissimo"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq": [
    "C50",
    "Giuoco Pianissimo"
  ],
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq": [
    "C51",
    "Evans Gambit"
  ],
  "r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq": [
    "C51",
    "Evans Gambit Accepted"
  ],
  "r1bqk1nr/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/P2P1PPP/RNBQK2R b KQkq": [
    "C51",
    "Evans Gambit Accepted"
  ],
  "r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQK2R w KQkq": [
    "C51",
    "Evans Gambit Accepted"
  ],
  "r1bqk1nr/pppp1ppp/2n5/b3p3/2BPP3/2P2N2/P4PPP/RNBQK2R b KQkq": [
    "C51",
    "Evans Gambit Accepted"
  ],
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq": [
    "C53",
    "Italian Game: Giuoco Piano"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq": [
    "C54",
    "Giuoco Piano: Center Attack"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq": [
    "C54",
    "Giuoco Piano: Center Attack"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq": [
    "C54",
    "Giuoco Piano: Center Attack"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq": [
    "C54",
    "Giuoco Piano: Center Attack"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq": [
    "C54",
    "Giuoco Piano: Center Attack"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R b KQkq": [
    "C54",
    "Giuoco Piano: Modern Slow (d3)"
  ],
  "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq": [
    "C54",
    "Giuoco Piano: Modern Slow (d3)"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C55",
    "Two Knights Defense"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq": [
    "C55",
    "Two Knights Defense: Modern Bishop Opening"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq": [
    "C57",
    "Two Knights Defense: Knight Attack"
  ],
  "r1bqkb1r/ppp2ppp/2n2n2/3pp1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq": [
    "C57",
    "Fried Liver Attack"
  ],
  "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq": [
    "C57",
    "Fried Liver Attack"
  ],
  "r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq": [
    "C57",
    "Fried Liver Attack"
  ],
  "r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R b KQkq": [
    "C57",
    "Fried Liver Attack"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq": [
    "C57",
    "Traxler Counterattack"
  ],
  "r1bqkb1r/ppp2ppp/5n2/n2Pp1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq": [
    "C58",
    "Two Knights Defense: Polerio Defense"
  ],
  "r1bqkb1r/ppp2ppp/5n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R b KQkq": [
    "C58",
    "Two Knights Defense: Polerio Defense"
  ],
  "r1bqkb1r/pp3ppp/2p2n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R w KQkq": [
    "C58",
    "Two Knights Defense: Polerio Defense"
  ],
  "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq": [
    "C60",
    "Ruy Lopez (Spanish Game)"
  ],
  "r1bqkb1r/ppppnppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C60",
    "Ruy Lopez: Cozio Defense"
  ],
  "r1bqkbnr/pppp1ppp/8/1B2p3/3nP3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C61",
    "Ruy Lopez: Bird's Defense"
  ],
  "r1bqkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C62",
    "Ruy Lopez: Old Steinitz Defense"
  ],
  "r1bqkbnr/pppp2pp/2n5/1B2pp2/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C63",
    "Ruy Lopez: Schliemann (Jaenisch) Gambit"
  ],
  "r1bqk1nr/pppp1ppp/2n5/1Bb1p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C64",
    "Ruy Lopez: Classical (Cordel) Defense"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C65",
    "Ruy Lopez: Berlin Defense"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq": [
    "C65",
    "Ruy Lopez: Anti-Berlin (4.d3)"
  ],
  "r1bqk2r/pppp1ppp/2n2n2/1Bb1p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq": [
    "C65",
    "Ruy Lopez: Anti-Berlin (4.d3)"
  ],
  "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkb1r/pppp1ppp/2n5/1B2p3/4n3/5N2/PPPP1PPP/RNBQ1RK1 w kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkb1r/pppp1ppp/2n5/1B2p3/3Pn3/5N2/PPP2PPP/RNBQ1RK1 b kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkb1r/pppp1ppp/2nn4/1B2p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkb1r/pppp1ppp/2Bn4/4p3/3P4/5N2/PPP2PPP/RNBQ1RK1 b kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkb1r/ppp2ppp/2pn4/4p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkb1r/ppp2ppp/2pn4/4P3/8/5N2/PPP2PPP/RNBQ1RK1 b kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkb1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNBQ1RK1 w kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bQkb1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 b kq": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w -": [
    "C67",
    "Ruy Lopez: Berlin Endgame"
  ],
  "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C68",
    "Ruy Lopez: Morphy Defense"
  ],
  "r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq": [
    "C68",
    "Ruy Lopez: Exchange Variation"
  ],
  "r1bqkbnr/1pp2ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C68",
    "Ruy Lopez: Exchange Variation"
  ],
  "r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq": [
    "C70",
    "Ruy Lopez: Main Line (4.Ba4)"
  ],
  "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq": [
    "C77",
    "Ruy Lopez: Morphy Main (4...Nf6)"
  ],
  "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 b kq": [
    "C78",
    "Ruy Lopez: Arkhangelsk Variation"
  ],
  "r1bqkb1r/2pp1ppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq": [
    "C78",
    "Ruy Lopez: Arkhangelsk Variation"
  ],
  "r1bqkb1r/2pp1ppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQ1RK1 b kq": [
    "C78",
    "Ruy Lopez: Arkhangelsk Variation"
  ],
  "r2qkb1r/1bpp1ppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQ1RK1 w kq": [
    "C78",
    "Ruy Lopez: Arkhangelsk Variation"
  ],
  "r1bqkb1r/1ppp1ppp/p1n5/4p3/B3n3/5N2/PPPP1PPP/RNBQ1RK1 w kq": [
    "C80",
    "Ruy Lopez: Open Variation"
  ],
  "r1bqkb1r/1ppp1ppp/p1n5/4p3/B2Pn3/5N2/PPP2PPP/RNBQ1RK1 b kq": [
    "C80",
    "Ruy Lopez: Open Variation"
  ],
  "r1bqkb1r/2pp1ppp/p1n5/1p2p3/B2Pn3/5N2/PPP2PPP/RNBQ1RK1 w kq": [
    "C80",
    "Ruy Lopez: Open Variation"
  ],
  "r1bqkb1r/2pp1ppp/p1n5/1p2p3/3Pn3/1B3N2/PPP2PPP/RNBQ1RK1 b kq": [
    "C80",
    "Ruy Lopez: Open Variation"
  ],
  "r1bqkb1r/2p2ppp/p1n5/1p1pp3/3Pn3/1B3N2/PPP2PPP/RNBQ1RK1 w kq": [
    "C80",
    "Ruy Lopez: Open Variation"
  ],
  "r1bqkb1r/2p2ppp/p1n5/1p1pP3/4n3/1B3N2/PPP2PPP/RNBQ1RK1 b kq": [
    "C80",
    "Ruy Lopez: Open Variation"
  ],
  "r2qkb1r/2p2ppp/p1n1b3/1p1pP3/4n3/1B3N2/PPP2PPP/RNBQ1RK1 w kq": [
    "C80",
    "Ruy Lopez: Open Variation"
  ],
  "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq": [
    "C84",
    "Ruy Lopez: Closed Defense"
  ],
  "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 b kq": [
    "C88",
    "Ruy Lopez: Anti-Marshall"
  ],
  "r1bqk2r/2ppbppp/p1n2n2/1p2p3/B3P3/5N2/PPPP1PPP/RNBQR1K1 w kq": [
    "C88",
    "Ruy Lopez: Anti-Marshall"
  ],
  "r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 b kq": [
    "C88",
    "Ruy Lopez: Anti-Marshall"
  ],
  "r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w -": [
    "C88",
    "Ruy Lopez: Anti-Marshall"
  ],
  "r1bq1rk1/2ppbppp/p1n2n2/1p2p3/P3P3/1B3N2/1PPP1PPP/RNBQR1K1 b -": [
    "C88",
    "Ruy Lopez: Anti-Marshall"
  ],
  "r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b -": [
    "C89",
    "Ruy Lopez: Marshall Attack"
  ],
  "r1bq1rk1/2p1bppp/p1n2n2/1p1pp3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w -": [
    "C89",
    "Ruy Lopez: Marshall Attack"
  ],
  "r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQR1K1 w kq": [
    "C92",
    "Ruy Lopez: Closed Zaitsev"
  ],
  "r1bqk2r/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b kq": [
    "C92",
    "Ruy Lopez: Closed Zaitsev"
  ],
  "r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 w -": [
    "C92",
    "Ruy Lopez: Closed Zaitsev"
  ],
  "r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 b -": [
    "C92",
    "Ruy Lopez: Closed Zaitsev"
  ],
  "r2q1rk1/1bp1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w -": [
    "C92",
    "Ruy Lopez: Closed Zaitsev"
  ],
  "rnbq1rk1/2p1bppp/p2p1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w -": [
    "C95",
    "Ruy Lopez: Closed Breyer"
  ],
  "r1bq1rk1/2p1bppp/p2p1n2/np2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 w -": [
    "C97",
    "Ruy Lopez: Closed Chigorin"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq": [
    "D00",
    "Queen's Pawn Game"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/3PP3/8/PPP2PPP/RNBQKBNR b KQkq": [
    "D00",
    "Blackmar-Diemer Gambit"
  ],
  "rnbqkbnr/ppp1pppp/8/8/3Pp3/8/PPP2PPP/RNBQKBNR w KQkq": [
    "D00",
    "Blackmar-Diemer Gambit"
  ],
  "rnbqkbnr/ppp1pppp/8/8/3Pp3/2N5/PPP2PPP/R1BQKBNR b KQkq": [
    "D00",
    "Blackmar-Diemer Gambit"
  ],
  "rnbqkb1r/ppp1pppp/5n2/8/3Pp3/2N5/PPP2PPP/R1BQKBNR w KQkq": [
    "D00",
    "Blackmar-Diemer Gambit"
  ],
  "rnbqkb1r/ppp1pppp/5n2/8/3Pp3/2N2P2/PPP3PP/R1BQKBNR b KQkq": [
    "D00",
    "Blackmar-Diemer Gambit"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq": [
    "D00",
    "London System: Accelerated"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq": [
    "D00",
    "London System: Classical Setup"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR b KQkq": [
    "D00",
    "London System: Classical Setup"
  ],
  "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq": [
    "D00",
    "London System: Classical Setup"
  ],
  "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR b KQkq": [
    "D00",
    "London System: Classical Setup"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR b KQkq": [
    "D00",
    "Jobava London System"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq": [
    "D00",
    "Jobava London System"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR b KQkq": [
    "D00",
    "Jobava London System"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq": [
    "D00",
    "Mason Attack"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R b KQkq": [
    "D00",
    "Mason Attack"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p2B1/3P4/2N5/PPP1PPPP/R2QKBNR b KQkq": [
    "D01",
    "Richter-Veresov Attack"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq": [
    "D02",
    "Queen Pawn: Zukertort / London"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq": [
    "D02",
    "London System"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq": [
    "D02",
    "London System"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R w KQkq": [
    "D02",
    "London System: Main Line"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2pp4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq": [
    "D02",
    "London System: Main Line"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2pp4/3P1B2/2P1PN2/PP3PPP/RN1QKB1R b KQkq": [
    "D02",
    "London System: Main Line"
  ],
  "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP3PPP/RN1QKB1R w KQkq": [
    "D02",
    "London System: Main Line"
  ],
  "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq": [
    "D02",
    "London System: Main Line"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p2B1/3P4/5N2/PPP1PPPP/RN1QKB1R b KQkq": [
    "D03",
    "Torre Attack"
  ],
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R b KQkq": [
    "D04",
    "Colle System"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R w KQkq": [
    "D05",
    "Colle-Zukertort System"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/3BPN2/PPP2PPP/RNBQK2R b KQkq": [
    "D05",
    "Colle-Zukertort System"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2pp4/3P4/3BPN2/PPP2PPP/RNBQK2R w KQkq": [
    "D05",
    "Colle-Zukertort System"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2pp4/3P4/1P1BPN2/P1P2PPP/RNBQK2R b KQkq": [
    "D05",
    "Colle-Zukertort System"
  ],
  "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq": [
    "D06",
    "Queen's Gambit"
  ],
  "r1bqkbnr/ppp1pppp/2n5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "D07",
    "Chigorin Defense"
  ],
  "rnbqkbnr/ppp2ppp/8/3pp3/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "D08",
    "Albin Countergambit"
  ],
  "rnbqkbnr/ppp2ppp/8/3pP3/2P5/8/PP2PPPP/RNBQKBNR b KQkq": [
    "D08",
    "Albin Countergambit"
  ],
  "rnbqkbnr/ppp2ppp/8/4P3/2Pp4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "D08",
    "Albin Countergambit"
  ],
  "rnbqkbnr/ppp2ppp/8/4P3/2Pp4/5N2/PP2PPPP/RNBQKB1R b KQkq": [
    "D09",
    "Albin Countergambit: Fianchetto"
  ],
  "r1bqkbnr/ppp2ppp/2n5/4P3/2Pp4/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "D09",
    "Albin Countergambit: Fianchetto"
  ],
  "r1bqkbnr/ppp2ppp/2n5/4P3/2Pp4/5NP1/PP2PP1P/RNBQKB1R b KQkq": [
    "D09",
    "Albin Countergambit: Fianchetto"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "D10",
    "Slav Defense"
  ],
  "rnbqkbnr/pp2pppp/2p5/3P4/3P4/8/PP2PPPP/RNBQKBNR b KQkq": [
    "D10",
    "Slav Defense: Exchange Variation"
  ],
  "rnbqkbnr/pp2pppp/8/3p4/3P4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "D10",
    "Slav Defense: Exchange Variation"
  ],
  "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq": [
    "D11",
    "Slav Defense: Modern Line"
  ],
  "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "D11",
    "Slav Defense: Modern Line"
  ],
  "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/4PN2/PP3PPP/RNBQKB1R b KQkq": [
    "D12",
    "Slav Defense: Quiet (4.e3 Bf5)"
  ],
  "rn1qkb1r/pp2pppp/2p2n2/3p1b2/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq": [
    "D12",
    "Slav Defense: Quiet (4.e3 Bf5)"
  ],
  "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "D15",
    "Slav Defense: Three Knights"
  ],
  "rnbqkb1r/pp2pppp/2p2n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D17",
    "Slav Defense: Czech Variation"
  ],
  "rnbqkb1r/pp2pppp/2p2n2/8/P1pP4/2N2N2/1P2PPPP/R1BQKB1R b KQkq": [
    "D17",
    "Slav Defense: Czech Variation"
  ],
  "rn1qkb1r/pp2pppp/2p2n2/5b2/P1pP4/2N2N2/1P2PPPP/R1BQKB1R w KQkq": [
    "D17",
    "Slav Defense: Czech Variation"
  ],
  "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "D20",
    "Queen's Gambit Accepted"
  ],
  "rnbqkbnr/ppp1pppp/8/8/2pPP3/8/PP3PPP/RNBQKBNR b KQkq": [
    "D20",
    "Queen's Gambit Accepted: Central (3.e4)"
  ],
  "rnbqkbnr/ppp1pppp/8/8/2pP4/5N2/PP2PPPP/RNBQKB1R b KQkq": [
    "D21",
    "Queen's Gambit Accepted: Normal (3.Nf3)"
  ],
  "rnbqkb1r/ppp1pppp/5n2/8/2pP4/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "D26",
    "Queen's Gambit Accepted: Classical"
  ],
  "rnbqkb1r/ppp1pppp/5n2/8/2pP4/4PN2/PP3PPP/RNBQKB1R b KQkq": [
    "D26",
    "Queen's Gambit Accepted: Classical"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/4PN2/PP3PPP/RNBQKB1R w KQkq": [
    "D26",
    "Queen's Gambit Accepted: Classical"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/8/2BP4/4PN2/PP3PPP/RNBQK2R b KQkq": [
    "D26",
    "Queen's Gambit Accepted: Classical"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP3PPP/RNBQK2R w KQkq": [
    "D26",
    "Queen's Gambit Accepted: Classical"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2p5/2BP4/4PN2/PP3PPP/RNBQ1RK1 b kq": [
    "D26",
    "Queen's Gambit Accepted: Classical"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "D30",
    "Queen's Gambit Declined"
  ],
  "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "D31",
    "Queen's Gambit Declined: Queen Knight (3.Nc3)"
  ],
  "rnbqkbnr/pp3ppp/4p3/2pp4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "D32",
    "Tarrasch Defense"
  ],
  "rnbqkbnr/pp3ppp/4p3/2pP4/3P4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "D34",
    "Tarrasch Defense: Rubinstein System"
  ],
  "rnbqkbnr/pp3ppp/8/2pp4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "D34",
    "Tarrasch Defense: Rubinstein System"
  ],
  "rnbqkbnr/pp3ppp/8/2pp4/3P4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "D34",
    "Tarrasch Defense: Rubinstein System"
  ],
  "r1bqkbnr/pp3ppp/2n5/2pp4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D34",
    "Tarrasch Defense: Rubinstein System"
  ],
  "r1bqkbnr/pp3ppp/2n5/2pp4/3P4/2N2NP1/PP2PP1P/R1BQKB1R b KQkq": [
    "D34",
    "Tarrasch Defense: Rubinstein System"
  ],
  "r1bqkb1r/pp3ppp/2n2n2/2pp4/3P4/2N2NP1/PP2PP1P/R1BQKB1R w KQkq": [
    "D34",
    "Tarrasch Defense: Rubinstein System"
  ],
  "r1bqkb1r/pp3ppp/2n2n2/2pp4/3P4/2N2NP1/PP2PPBP/R1BQK2R b KQkq": [
    "D34",
    "Tarrasch Defense: Rubinstein System"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "D35",
    "Queen's Gambit Declined: Exchange Variation"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3P4/3P4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "D35",
    "Queen's Gambit Declined: Exchange Variation"
  ],
  "rnbqkb1r/ppp2ppp/5n2/3p4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "D35",
    "Queen's Gambit Declined: Exchange Variation"
  ],
  "rnbqkb1r/ppp2ppp/5n2/3p2B1/3P4/2N5/PP2PPPP/R2QKBNR b KQkq": [
    "D35",
    "Queen's Gambit Declined: Exchange Variation"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "D37",
    "Queen's Gambit Declined: Three Knights"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D37",
    "Queen's Gambit Declined: Harrwitz Attack"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3p4/2PP1B2/2N2N2/PP2PPPP/R2QKB1R b KQkq": [
    "D37",
    "Queen's Gambit Declined: Harrwitz Attack"
  ],
  "rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D38",
    "Queen's Gambit Declined: Ragozin Defense"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D39",
    "Vienna Variation (QGD)"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2pp4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D41",
    "Semi-Tarrasch Defense"
  ],
  "rnbqkb1r/pp3ppp/4pn2/2pP4/3P4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "D41",
    "Semi-Tarrasch Defense"
  ],
  "rnbqkb1r/pp3ppp/4p3/2pn4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D41",
    "Semi-Tarrasch Defense"
  ],
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D43",
    "Semi-Slav Defense"
  ],
  "rnbqkb1r/pp3ppp/2p1pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R b KQkq": [
    "D44",
    "Semi-Slav Defense: Botvinnik Variation"
  ],
  "rnbqkb1r/pp3ppp/2p1pn2/6B1/2pP4/2N2N2/PP2PPPP/R2QKB1R w KQkq": [
    "D44",
    "Semi-Slav Defense: Botvinnik Variation"
  ],
  "rnbqkb1r/pp3ppp/2p1pn2/6B1/2pPP3/2N2N2/PP3PPP/R2QKB1R b KQkq": [
    "D44",
    "Semi-Slav Defense: Botvinnik Variation"
  ],
  "rnbqkb1r/p4ppp/2p1pn2/1p4B1/2pPP3/2N2N2/PP3PPP/R2QKB1R w KQkq": [
    "D44",
    "Semi-Slav Defense: Botvinnik Variation"
  ],
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R b KQkq": [
    "D45",
    "Semi-Slav Defense: Stoltz (5.e3)"
  ],
  "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq": [
    "D45",
    "Semi-Slav Defense: Stoltz (5.e3)"
  ],
  "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2N1PN2/PPQ2PPP/R1B1KB1R b KQkq": [
    "D45",
    "Semi-Slav Defense: Stoltz (5.e3)"
  ],
  "r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R b KQkq": [
    "D47",
    "Semi-Slav Defense: Meran Variation"
  ],
  "r1bqkb1r/pp1n1ppp/2p1pn2/8/2pP4/2NBPN2/PP3PPP/R1BQK2R w KQkq": [
    "D47",
    "Semi-Slav Defense: Meran Variation"
  ],
  "r1bqkb1r/pp1n1ppp/2p1pn2/8/2BP4/2N1PN2/PP3PPP/R1BQK2R b KQkq": [
    "D47",
    "Semi-Slav Defense: Meran Variation"
  ],
  "r1bqkb1r/p2n1ppp/2p1pn2/1p6/2BP4/2N1PN2/PP3PPP/R1BQK2R w KQkq": [
    "D47",
    "Semi-Slav Defense: Meran Variation"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq": [
    "D52",
    "QGD: Cambridge Springs Defense"
  ],
  "r1bqkb1r/pppn1ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq": [
    "D52",
    "QGD: Cambridge Springs Defense"
  ],
  "r1bqkb1r/pppn1ppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR b KQkq": [
    "D52",
    "QGD: Cambridge Springs Defense"
  ],
  "r1bqkb1r/pp1n1ppp/2p1pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR w KQkq": [
    "D52",
    "QGD: Cambridge Springs Defense"
  ],
  "r1bqkb1r/pp1n1ppp/2p1pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R b KQkq": [
    "D52",
    "QGD: Cambridge Springs Defense"
  ],
  "r1b1kb1r/pp1n1ppp/2p1pn2/q2p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQkq": [
    "D52",
    "QGD: Cambridge Springs Defense"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq": [
    "D53",
    "Queen's Gambit Declined: Main Line (4.Bg5 Be7)"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR b KQkq": [
    "D56",
    "QGD: Lasker Defense"
  ],
  "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR w KQ": [
    "D56",
    "QGD: Lasker Defense"
  ],
  "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R b KQ": [
    "D56",
    "QGD: Lasker Defense"
  ],
  "rnbq1rk1/ppp1bpp1/4pn1p/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ": [
    "D56",
    "QGD: Lasker Defense"
  ],
  "rnbq1rk1/ppp1bpp1/4pn1p/3p4/2PP3B/2N1PN2/PP3PPP/R2QKB1R b KQ": [
    "D56",
    "QGD: Lasker Defense"
  ],
  "rnbq1rk1/ppp1bpp1/4p2p/3p4/2PPn2B/2N1PN2/PP3PPP/R2QKB1R w KQ": [
    "D56",
    "QGD: Lasker Defense"
  ],
  "rnbq1rk1/p1p1bpp1/1p2pn1p/3p4/2PP3B/2N1PN2/PP3PPP/R2QKB1R w KQ": [
    "D58",
    "QGD: Tartakower Variation"
  ],
  "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ": [
    "D63",
    "QGD: Orthodox Defense"
  ],
  "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/2RQKB1R b K": [
    "D63",
    "QGD: Orthodox Defense"
  ],
  "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "E60",
    "King's Indian Defense"
  ],
  "rnbqkb1r/pppppp1p/5np1/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq": [
    "D70",
    "Neo-Grunfeld Defense"
  ],
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq": [
    "D70",
    "Neo-Grunfeld Defense"
  ],
  "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "D80",
    "Grunfeld Defense"
  ],
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "D80",
    "Grunfeld Defense"
  ],
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP1B2/2N5/PP2PPPP/R2QKBNR b KQkq": [
    "D82",
    "Grunfeld Defense: Brinckmann (4.Bf4)"
  ],
  "rnbqk2r/ppp1ppbp/5np1/3p4/2PP1B2/2N5/PP2PPPP/R2QKBNR w KQkq": [
    "D82",
    "Grunfeld Defense: Brinckmann (4.Bf4)"
  ],
  "rnbqkb1r/ppp1pp1p/5np1/3P4/3P4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "D85",
    "Grunfeld Defense: Exchange Variation"
  ],
  "rnbqkb1r/ppp1pp1p/6p1/3n4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "D85",
    "Grunfeld Defense: Exchange Variation"
  ],
  "rnbqkb1r/ppp1pp1p/6p1/3n4/3PP3/2N5/PP3PPP/R1BQKBNR b KQkq": [
    "D85",
    "Grunfeld Defense: Exchange Variation"
  ],
  "rnbqkb1r/ppp1pp1p/6p1/8/3PP3/2n5/PP3PPP/R1BQKBNR w KQkq": [
    "D85",
    "Grunfeld Defense: Exchange Variation"
  ],
  "rnbqkb1r/ppp1pp1p/6p1/8/3PP3/2P5/P4PPP/R1BQKBNR b KQkq": [
    "D85",
    "Grunfeld Defense: Exchange Variation"
  ],
  "rnbqk2r/ppp1ppbp/6p1/8/3PP3/2P5/P4PPP/R1BQKBNR w KQkq": [
    "D85",
    "Grunfeld Defense: Exchange Variation"
  ],
  "rnbqk2r/ppp1ppbp/6p1/8/2BPP3/2P5/P4PPP/R1BQK1NR b KQkq": [
    "D87",
    "Grunfeld Defense: Classical Exchange"
  ],
  "rnbqk2r/pp2ppbp/6p1/2p5/2BPP3/2P5/P4PPP/R1BQK1NR w KQkq": [
    "D87",
    "Grunfeld Defense: Classical Exchange"
  ],
  "rnbqk2r/pp2ppbp/6p1/2p5/2BPP3/2P5/P3NPPP/R1BQK2R b KQkq": [
    "D87",
    "Grunfeld Defense: Classical Exchange"
  ],
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "D90",
    "Grunfeld Defense: Three Knights"
  ],
  "rnbqk2r/ppp1ppbp/5np1/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq": [
    "D90",
    "Grunfeld Defense: Three Knights"
  ],
  "rnbqk2r/ppp1ppbp/5np1/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R b KQkq": [
    "D94",
    "Grunfeld Defense: Closed System"
  ],
  "rnbq1rk1/ppp1ppbp/5np1/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQ": [
    "D94",
    "Grunfeld Defense: Closed System"
  ],
  "rnbqk2r/ppp1ppbp/5np1/3p4/2PP4/1QN2N2/PP2PPPP/R1B1KB1R b KQkq": [
    "D97",
    "Grunfeld Defense: Russian System"
  ],
  "rnbqk2r/ppp1ppbp/5np1/8/2pP4/1QN2N2/PP2PPPP/R1B1KB1R w KQkq": [
    "D97",
    "Grunfeld Defense: Russian System"
  ],
  "rnbqk2r/ppp1ppbp/5np1/8/2QP4/2N2N2/PP2PPPP/R1B1KB1R b KQkq": [
    "D97",
    "Grunfeld Defense: Russian System"
  ],
  "rnbq1rk1/ppp1ppbp/5np1/8/2QP4/2N2N2/PP2PPPP/R1B1KB1R w KQ": [
    "D97",
    "Grunfeld Defense: Russian System"
  ],
  "rnbq1rk1/ppp1ppbp/5np1/8/2QPP3/2N2N2/PP3PPP/R1B1KB1R b KQ": [
    "D97",
    "Grunfeld Defense: Russian System"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq": [
    "E00",
    "Catalan Opening"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq": [
    "E00",
    "Catalan Opening"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq": [
    "E01",
    "Catalan Opening: Closed Invite"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq": [
    "E01",
    "Catalan Opening: Closed Invite"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/6P1/PP2PPBP/RNBQK1NR w KQkq": [
    "E04",
    "Catalan Opening: Open Defense"
  ],
  "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/5NP1/PP2PPBP/RNBQK2R b KQkq": [
    "E04",
    "Catalan Opening: Open Defense"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/6P1/PP2PPBP/RNBQK1NR w KQkq": [
    "E06",
    "Catalan Opening: Closed Main Line"
  ],
  "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq": [
    "E06",
    "Catalan Opening: Closed Main Line"
  ],
  "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQK2R w KQ": [
    "E06",
    "Catalan Opening: Closed Main Line"
  ],
  "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/5NP1/PP2PPBP/RNBQ1RK1 b -": [
    "E06",
    "Catalan Opening: Closed Main Line"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq": [
    "E10",
    "Blumenfeld Countergambit"
  ],
  "rnbqkb1r/pp1p1ppp/4pn2/2p5/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "E10",
    "Blumenfeld Countergambit"
  ],
  "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/5N2/PP2PPPP/RNBQKB1R b KQkq": [
    "E10",
    "Blumenfeld Countergambit"
  ],
  "rnbqkb1r/p2p1ppp/4pn2/1ppP4/2P5/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "E10",
    "Blumenfeld Countergambit"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "E11",
    "Bogo-Indian Defense"
  ],
  "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq": [
    "E12",
    "Queen's Indian Defense"
  ],
  "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/P4N2/1P2PPPP/RNBQKB1R b KQkq": [
    "E12",
    "Queen's Indian Defense: Petrosian System"
  ],
  "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1R b KQkq": [
    "E15",
    "Queen's Indian Defense: Fianchetto Variation"
  ],
  "rn1qkb1r/p1pp1ppp/bp2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1R w KQkq": [
    "E15",
    "Queen's Indian Defense: Fianchetto Variation"
  ],
  "rn1qkb1r/p1pp1ppp/bp2pn2/8/2PP4/1P3NP1/P3PP1P/RNBQKB1R b KQkq": [
    "E15",
    "Queen's Indian Defense: Fianchetto Variation"
  ],
  "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/5NP1/PP2PP1P/RNBQKB1R w KQkq": [
    "E17",
    "Queen's Indian Defense: Classical"
  ],
  "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq": [
    "E17",
    "Queen's Indian Defense: Classical"
  ],
  "rn1qk2r/pbppbppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQK2R w KQkq": [
    "E17",
    "Queen's Indian Defense: Classical"
  ],
  "rn1qk2r/pbppbppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQ1RK1 b kq": [
    "E17",
    "Queen's Indian Defense: Classical"
  ],
  "rn1q1rk1/pbppbppp/1p2pn2/8/2PP4/5NP1/PP2PPBP/RNBQ1RK1 w -": [
    "E17",
    "Queen's Indian Defense: Classical"
  ],
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq": [
    "E20",
    "Nimzo-Indian Defense"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "E20",
    "Nimzo-Indian Defense"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "E21",
    "Nimzo-Indian Defense: Three Knights (Kasparov)"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/P1N5/1P2PPPP/R1BQKBNR b KQkq": [
    "E24",
    "Nimzo-Indian Defense: Saemisch Variation"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/2PP4/P1b5/1P2PPPP/R1BQKBNR w KQkq": [
    "E24",
    "Nimzo-Indian Defense: Saemisch Variation"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/2PP4/P1P5/4PPPP/R1BQKBNR b KQkq": [
    "E24",
    "Nimzo-Indian Defense: Saemisch Variation"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR b KQkq": [
    "E32",
    "Nimzo-Indian Defense: Classical (4.Qc2)"
  ],
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR b KQkq": [
    "E41",
    "Nimzo-Indian Defense: Rubinstein (4.e3)"
  ],
  "rnbqk2r/pp1p1ppp/4pn2/2p5/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq": [
    "E41",
    "Nimzo-Indian Defense: Rubinstein (4.e3)"
  ],
  "rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQ": [
    "E46",
    "Nimzo-Indian Defense: Reshevsky"
  ],
  "rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2NBP3/PP3PPP/R1BQK1NR b KQ": [
    "E53",
    "Nimzo-Indian Defense: Main Line"
  ],
  "rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2NBP3/PP3PPP/R1BQK1NR w KQ": [
    "E53",
    "Nimzo-Indian Defense: Main Line"
  ],
  "rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2NBPN2/PP3PPP/R1BQK2R b KQ": [
    "E53",
    "Nimzo-Indian Defense: Main Line"
  ],
  "rnbq1rk1/pp3ppp/4pn2/2pp4/1bPP4/2NBPN2/PP3PPP/R1BQK2R w KQ": [
    "E53",
    "Nimzo-Indian Defense: Main Line"
  ],
  "rnbq1rk1/pp3ppp/4pn2/2pp4/1bPP4/2NBPN2/PP3PPP/R1BQ1RK1 b -": [
    "E53",
    "Nimzo-Indian Defense: Main Line"
  ],
  "rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq": [
    "E61",
    "King's Indian Defense: Normal"
  ],
  "rnbqk2r/ppppppbp/5np1/8/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq": [
    "E62",
    "King's Indian Defense: Fianchetto Variation"
  ],
  "rnbq1rk1/ppppppbp/5np1/8/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQ": [
    "E62",
    "King's Indian Defense: Fianchetto Variation"
  ],
  "rnbq1rk1/ppppppbp/5np1/8/2PP4/2N2NP1/PP2PP1P/R1BQKB1R b KQ": [
    "E62",
    "King's Indian Defense: Fianchetto Variation"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PP4/2N2NP1/PP2PP1P/R1BQKB1R w KQ": [
    "E62",
    "King's Indian Defense: Fianchetto Variation"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PP4/2N2NP1/PP2PPBP/R1BQK2R b KQ": [
    "E62",
    "King's Indian Defense: Fianchetto Variation"
  ],
  "rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq": [
    "E70",
    "King's Indian Defense: Main Setup (4.e4)"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq": [
    "E70",
    "King's Indian Defense: Main Setup (4.e4)"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP2BPPP/R1BQK1NR b KQkq": [
    "E73",
    "King's Indian Defense: Averbakh System"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP2BPPP/R1BQK1NR w KQ": [
    "E73",
    "King's Indian Defense: Averbakh System"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/6B1/2PPP3/2N5/PP2BPPP/R2QK1NR b KQ": [
    "E73",
    "King's Indian Defense: Averbakh System"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/2PPPP2/2N5/PP4PP/R1BQKBNR b KQkq": [
    "E76",
    "King's Indian Defense: Four Pawns Attack"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPPP2/2N5/PP4PP/R1BQKBNR w KQ": [
    "E76",
    "King's Indian Defense: Four Pawns Attack"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPPP2/2N2N2/PP4PP/R1BQKB1R b KQ": [
    "E76",
    "King's Indian Defense: Four Pawns Attack"
  ],
  "rnbq1rk1/pp2ppbp/3p1np1/2p5/2PPPP2/2N2N2/PP4PP/R1BQKB1R w KQ": [
    "E76",
    "King's Indian Defense: Four Pawns Attack"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2P2/PP4PP/R1BQKBNR b KQkq": [
    "E80",
    "King's Indian Defense: Saemisch Variation"
  ],
  "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq": [
    "E90",
    "King's Indian Defense: Classical"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ": [
    "E92",
    "King's Indian Defense: Gligoric / Petrosian"
  ],
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ": [
    "E92",
    "King's Indian Defense: Gligoric / Petrosian"
  ],
  "rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ": [
    "E92",
    "King's Indian Defense: Gligoric / Petrosian"
  ],
  "rnbq1rk1/ppp2pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 b -": [
    "E97",
    "King's Indian Defense: Mar del Plata"
  ],
  "r1bq1rk1/ppp2pbp/2np1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w -": [
    "E97",
    "King's Indian Defense: Mar del Plata"
  ],
  "r1bq1rk1/ppp2pbp/2np1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 b -": [
    "E97",
    "King's Indian Defense: Mar del Plata"
  ],
  "r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w -": [
    "E97",
    "King's Indian Defense: Mar del Plata"
  ],
  "r1bq1rk1/ppp1npbp/3p1np1/3Pp3/1PP1P3/2N2N2/P3BPPP/R1BQ1RK1 b -": [
    "E99",
    "King's Indian Defense: Bayonet Attack"
  ]
};

export function lookupOpeningByFen(fen: string): OpeningEntry | undefined {
  const entry = ECO_BOOK_DATA[normalizeFenKey(fen)];
  if (!entry) return undefined;
  return { eco: entry[0], name: entry[1] };
}

export const ECO_BOOK_SIZE = 871;
