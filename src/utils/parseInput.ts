import { BOX_SYMBOL, ROBOT_SYMBOL } from '../constants';
import { TMap, TPosition } from '../types';

const movesLookup: Record<string, number[]> = {
  '<': [0, -1],
  '>': [0, 1],
  '^': [-1, 0],
  v: [1, 0],
};

export const parseInputFromFile = async (
  fileUrl: string,
): Promise<[TMap, TPosition[], TPosition]> => {
  const response = await fetch(fileUrl);
  const text = await response.text();
  const [mapIn, movesIn] = text.trim().split('\n\n');
  const map: (string | number)[][] = mapIn
    .trim()
    .split('\n')
    .map((row) => row.split(''));

  const moves = movesIn
    .split('\n')
    .join('')
    .split('')
    .map((move) => {
      return { x: movesLookup[move][0], y: movesLookup[move][1] };
    });

  let curIdx = 1;
  const startPosition: TPosition = { x: 0, y: 0 };
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (map[x][y] === BOX_SYMBOL) {
        map[x][y] = curIdx;
        curIdx++;
      } else if (map[x][y] === ROBOT_SYMBOL) {
        startPosition.y = y;
        startPosition.x = x;
        map[x][y] = '.';
      }
    }
  }

  return [map, moves, startPosition];
};
