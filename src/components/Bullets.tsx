import { useState, useEffect } from "react";
import Bullet from "./Bullet";
import { childPosType } from "../App";

export interface BulletType {
  startPosition: { x: number; y: number; z: number };
  direction: { x: number; y: number; z: number };
  size: number;
  color: string;
}

const start = 0,
  end = 2.9;
const step = 0.1;

const point: number[] = [];

for (let i = start; i <= end; i += step) {
  point.push(i);
}

function createBullet() {
  let x, z;

  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 2.9 : -2.9;
    z = point[Math.floor(Math.random() * point.length)];
  } else {
    z = Math.random() < 0.5 ? 2.9 : -2.9;
    x = point[Math.floor(Math.random() * point.length)];
  }

  const newStartPosition = {
    x: x,
    y: 0,
    z: z,
  };

  const newDirection = {
    x: Math.random() * 0.1 - 0.05,
    y: 0,
    z: Math.random() * 0.1 - 0.05,
  };

  const newBulletSize = 0.1 + Math.random() * 0.03;

  const color = Math.random() < 0.2 ? "green" : "red";

  const newBullet = {
    startPosition: newStartPosition,
    direction: newDirection,
    size: newBulletSize,
    color,
  };

  return newBullet;
}

function Bullets({
  childPos,
  setGameOver,
  setScore,
}: {
  childPos: childPosType;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [bullets, setBullets] = useState<BulletType[]>([]);

  useEffect(() => {
    const bulletCreateInterval = setInterval(() => {
      const newBullet = createBullet();

      setBullets((prev) => [...prev, newBullet]);
    }, 100);

    return () => {
      clearInterval(bulletCreateInterval);
    };
  }, []);

  return (
    <>
      {bullets.map((bullet) => (
        <Bullet
          key={
            bullet.startPosition.x +
            bullet.startPosition.y +
            bullet.startPosition.z +
            bullet.direction.x +
            bullet.direction.y +
            bullet.direction.z
          }
          bullet={bullet}
          childPos={childPos}
          setGameOver={setGameOver}
          setScore={setScore}
        />
      ))}
    </>
  );
}

export default Bullets;
