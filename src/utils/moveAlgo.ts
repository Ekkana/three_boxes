import { EMPTY_SYMBOL, WALL_SYMBOL } from '../constants';
import { TBoxPosition, TMap, TPosition } from '../types';

export const makeMove = (
  map: TMap,
  move: TPosition,
  startPosition: TPosition,
): [TMap, TPosition, Record<string, TBoxPosition>] => {
  const localMap = map.map((row) => [...row]);

  const isBoxMoving = (
    position: { x: number; y: number },
    move: { x: number; y: number },
  ) => {
    let newPosition = { x: position.x + move.x, y: position.y + move.y };

    while (true) {
      if (localMap[newPosition.x][newPosition.y] === WALL_SYMBOL) {
        return false;
      }
      if (localMap[newPosition.x][newPosition.y] === EMPTY_SYMBOL) {
        return true;
      }
      newPosition = {
        x: newPosition.x + move.x,
        y: newPosition.y + move.y,
      };
    }
  };

  const movedBoxes: Record<string, TBoxPosition> = {};

  const moveBox = (position: TPosition, move: TPosition) => {
    let boxIdx = localMap[position.x][position.y];
    localMap[position.x][position.y] = EMPTY_SYMBOL;

    let newPosition = { x: position.x + move.x, y: position.y + move.y };

    while (boxIdx !== EMPTY_SYMBOL) {
      const oldPosition = {
        x: newPosition.x - move.x,
        y: newPosition.y - move.y,
      };
      let temp = localMap[newPosition.x][newPosition.y];
      localMap[newPosition.x][newPosition.y] = boxIdx;
      movedBoxes[boxIdx] = {
        x: newPosition.x,
        y: newPosition.y,
        oldX: oldPosition.x,
        oldY: oldPosition.y,
      };

      boxIdx = temp;

      newPosition = {
        x: newPosition.x + move.x,
        y: newPosition.y + move.y,
      };
    }
  };

  const canMove = (position: TPosition) => {
    if (localMap[position.x][position.y] === WALL_SYMBOL) {
      return false;
    }
    return true;
  };

  let newRobotPosition = {
    x: startPosition.x + move.x,
    y: startPosition.y + move.y,
  };

  if (typeof localMap[newRobotPosition.x][newRobotPosition.y] === 'number') {
    if (isBoxMoving(newRobotPosition, move)) {
      moveBox(newRobotPosition, move);
      return [localMap, newRobotPosition, movedBoxes];
    }
  } else if (canMove(newRobotPosition)) {
    return [localMap, newRobotPosition, movedBoxes];
  }
  return [localMap, startPosition, movedBoxes];
};
