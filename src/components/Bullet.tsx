import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { childPosType } from "../App";
import { BulletType } from "./Bullets";

interface BulletPropsType {
  bullet: BulletType;
  childPos: childPosType;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

function Bullet({ bullet, childPos, setGameOver, setScore }: BulletPropsType) {
  const [deleted, setDeleted] = useState(false);
  const bulletRef = useRef<Mesh>(null);
  const startPositionVector = new Vector3(
    bullet.startPosition.x,
    bullet.startPosition.y,
    bullet.startPosition.z
  );
  const directionVector = new Vector3(
    bullet.direction.x,
    bullet.direction.y,
    bullet.direction.z
  );
  const position = useRef(startPositionVector); // 현재 위치 기억

  useFrame(() => {
    if (!bulletRef || !bulletRef.current) {
      return;
    }

    // 현재 위치에 이동 방향 더해서 새 위치 계산
    position.current.add(directionVector);
    bulletRef.current.position.copy(position.current);

    if (
      Math.abs(position.current.x) > 3.1 ||
      Math.abs(position.current.z) > 3.1
    ) {
      setDeleted(true);
    }

    const advantage = bullet.color === "green" ? 0.05 : 0;

    if (
      Math.sqrt(
        (position.current.x - childPos.x) ** 2 +
          (position.current.z - childPos.z) ** 2
      ) <=
      bullet.size + advantage
    ) {
      if (bullet.color === "red") {
        setGameOver(true);
      } else if (bullet.color === "green") {
        setScore((prevScore) => prevScore + 1000);
        setDeleted(true);
      }
    }
  });

  if (deleted) {
    return null;
  }

  return (
    <mesh ref={bulletRef} position={startPositionVector}>
      <sphereGeometry args={[bullet.size, 32, 32]} />
      <meshPhongMaterial color={bullet.color} />
    </mesh>
  );
}

export default Bullet;
