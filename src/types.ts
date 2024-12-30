export type TMap = (string | number)[][];
export type TPosition = { x: number; y: number };
export type TBoxPosition = { x: number; y: number; oldX: number; oldY: number };
export type TRobotRotation = 'up' | 'down' | 'left' | 'right';
export type TRobotRotationChange = { from: TRobotRotation; to: TRobotRotation };
