import { GameMetadata } from '../types/chess';

export const SAMPLE_GAMES: GameMetadata[] = [
  {
    id: 'sample-icechoker-review',
    url: 'https://www.chess.com/game/live/187960315194',
    white: {
      username: 'IceChoker',
      rating: 805,
      country: 'US',
    },
    black: {
      username: 'ViktorK_99',
      rating: 838,
      country: 'DE',
    },
    result: '0-1',
    termination: 'ViktorK_99 won by checkmate',
    timeControl: '180',
    date: '2026.11.25',
    eco: 'D00',
    openingName: "Queen's Pawn Opening",
    perspective: 'w',
    pgn: `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.11.25"]
[Round "-"]
[White "IceChoker"]
[Black "ViktorK_99"]
[Result "0-1"]
[ECO "D00"]
[WhiteElo "805"]
[BlackElo "838"]
[TimeControl "180"]
[Termination "ViktorK_99 won by checkmate"]

1. d4 {[%clk 0:03:00]} 1... d5 {[%clk 0:03:00]} 2. Bf4 {[%clk 0:02:57]} 2... Nf6 {[%clk 0:02:56]} 3. e3 {[%clk 0:02:54]} 3... c5 {[%clk 0:02:52]} 4. c3 {[%clk 0:02:50]} 4... Nc6 {[%clk 0:02:48]} 5. Nd2 {[%clk 0:02:45]} 5... Qb6 {[%clk 0:02:42]} 6. Qb3 {[%clk 0:02:38]} 6... c4 {[%clk 0:02:35]} 7. Qc2 {[%clk 0:02:31]} 7... g6 {[%clk 0:02:28]} 8. Ngf3 {[%clk 0:02:24]} 8... Bf5 {[%clk 0:02:21]} 9. Qc1 {[%clk 0:02:14]} 9... Bg7 {[%clk 0:02:12]} 10. Be2 {[%clk 0:02:08]} 10... O-O {[%clk 0:02:05]} 11. O-O {[%clk 0:02:01]} 11... Nh5 {[%clk 0:01:56]} 12. Bg5 {[%clk 0:01:49]} 12... h6 {[%clk 0:01:46]} 13. Bh4 {[%clk 0:01:42]} 13... g5 {[%clk 0:01:39]} 14. Nxg5 {[%clk 0:01:25]} 14... hxg5 {[%clk 0:01:22]} 15. Bxg5 {[%clk 0:01:20]} 15... Nf6 {[%clk 0:01:14]} 16. Bxf6 {[%clk 0:01:05]} 16... Bxf6 {[%clk 0:01:03]} 17. e4 {[%clk 0:00:56]} 17... dxe4 {[%clk 0:00:51]} 18. Nxc4 {[%clk 0:00:47]} 18... Qc7 {[%clk 0:00:43]} 19. Qh6 {[%clk 0:00:36]} 19... Bg7 {[%clk 0:00:32]} 20. Qg5 {[%clk 0:00:27]} 20... Bg6 {[%clk 0:00:24]} 21. f4 {[%clk 0:00:18]} 21... Bf6 {[%clk 0:00:15]} 22. Qg4 {[%clk 0:00:11]} 22... Nxd4 {[%clk 0:00:09]} 23. cxd4 {[%clk 0:00:07]} 23... Bxd4+ {[%clk 0:00:06]} 24. Kh1 {[%clk 0:00:05]} 24... Kg7 {[%clk 0:00:04]} 25. f5 {[%clk 0:00:03]} 25... Rh8 {[%clk 0:00:03]} 26. fxg6 {[%clk 0:00:02]} 26... Qxh2# {[%clk 0:00:02]} 0-1`,
  },
  {
    id: 'sample-opera-brilliancy',
    white: {
      username: 'IceChoker',
      rating: 1420,
      country: 'US',
    },
    black: {
      username: 'DukeKarl_Paris',
      rating: 1395,
      country: 'FR',
    },
    result: '1-0',
    termination: 'IceChoker won by checkmate',
    timeControl: '300',
    date: '2026.11.20',
    eco: 'C41',
    openingName: 'Philidor Defense',
    perspective: 'w',
    pgn: `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.11.20"]
[White "IceChoker"]
[Black "DukeKarl_Paris"]
[Result "1-0"]
[ECO "C41"]
[WhiteElo "1420"]
[BlackElo "1395"]
[TimeControl "300"]
[Termination "IceChoker won by checkmate"]

1. e4 {[%clk 0:05:00]} 1... e5 {[%clk 0:04:58]} 2. Nf3 {[%clk 0:04:56]} 2... d6 {[%clk 0:04:54]} 3. d4 {[%clk 0:04:51]} 3... Bg4 {[%clk 0:04:46]} 4. dxe5 {[%clk 0:04:42]} 4... Bxf3 {[%clk 0:04:39]} 5. Qxf3 {[%clk 0:04:37]} 5... dxe5 {[%clk 0:04:35]} 6. Bc4 {[%clk 0:04:30]} 6... Nf6 {[%clk 0:04:25]} 7. Qb3 {[%clk 0:04:18]} 7... Qe7 {[%clk 0:04:08]} 8. Nc3 {[%clk 0:04:01]} 8... c6 {[%clk 0:03:54]} 9. Bg5 {[%clk 0:03:45]} 9... b5 {[%clk 0:03:36]} 10. Nxb5 {[%clk 0:03:18]} 10... cxb5 {[%clk 0:03:12]} 11. Bxb5+ {[%clk 0:03:09]} 11... Nbd7 {[%clk 0:02:58]} 12. O-O-O {[%clk 0:02:49]} 12... Rd8 {[%clk 0:02:35]} 13. Rxd7 {[%clk 0:02:18]} 13... Rxd7 {[%clk 0:02:14]} 14. Rd1 {[%clk 0:02:09]} 14... Qe6 {[%clk 0:01:51]} 15. Bxd7+ {[%clk 0:01:40]} 15... Nxd7 {[%clk 0:01:36]} 16. Qb8+ {[%clk 0:01:28]} 16... Nxb8 {[%clk 0:01:25]} 17. Rd8# {[%clk 0:01:24]} 1-0`,
  },
  {
    id: 'sample-fried-liver-win',
    white: {
      username: 'IceChoker',
      rating: 1050,
      country: 'US',
    },
    black: {
      username: 'TacticalRook42',
      rating: 1065,
      country: 'CA',
    },
    result: '1-0',
    termination: 'IceChoker won by checkmate',
    timeControl: '600',
    date: '2026.11.18',
    eco: 'C57',
    openingName: 'Fried Liver Attack',
    perspective: 'w',
    pgn: `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.11.18"]
[White "IceChoker"]
[Black "TacticalRook42"]
[Result "1-0"]
[ECO "C57"]
[WhiteElo "1050"]
[BlackElo "1065"]
[TimeControl "600"]
[Termination "IceChoker won by checkmate"]

1. e4 {[%clk 0:10:00]} 1... e5 {[%clk 0:09:58]} 2. Nf3 {[%clk 0:09:55]} 2... Nc6 {[%clk 0:09:52]} 3. Bc4 {[%clk 0:09:49]} 3... Nf6 {[%clk 0:09:45]} 4. Ng5 {[%clk 0:09:38]} 4... d5 {[%clk 0:09:31]} 5. exd5 {[%clk 0:09:27]} 5... Nxd5 {[%clk 0:09:20]} 6. Nxf7 {[%clk 0:09:05]} 6... Kxf7 {[%clk 0:08:52]} 7. Qf3+ {[%clk 0:08:48]} 7... Kg8 {[%clk 0:08:31]} 8. Bxd5+ {[%clk 0:08:22]} 8... Qxd5 {[%clk 0:08:04]} 9. Qxd5+ {[%clk 0:07:58]} 9... Be6 {[%clk 0:07:52]} 10. Qxe6# {[%clk 0:07:49]} 1-0`,
  },
];

export const DEFAULT_SAMPLE_GAME: GameMetadata = SAMPLE_GAMES[0];
