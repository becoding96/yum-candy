import { useState, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFrame } from "@react-three/fiber";

function Child({
  setChildPos,
}: {
  setChildPos: React.Dispatch<
    React.SetStateAction<{
      x: number;
      z: number;
    }>
  >;
}) {
  const gltf = useLoader(GLTFLoader, "/child.gltf");
  const [isReady, setIsReady] = useState(false); // 애니메이션 준비되면 렌더링
  const { ref, actions, names } = useAnimations(gltf.animations);
  const dirKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
  const [keyPressed, setKeyPressed] = useState({
    ArrowUp: 0,
    ArrowRight: 0,
    ArrowDown: 0,
    ArrowLeft: 0,
  });
  const [isMoving, setIsMoving] = useState(false);
  const moveSpeed = 0.07;
  const keySpeedWeight = {
    ArrowUp: { x: 0, z: -1 * moveSpeed },
    ArrowRight: { x: 1 * moveSpeed, z: 0 },
    ArrowDown: { x: 0, z: 1 * moveSpeed },
    ArrowLeft: { x: -1 * moveSpeed, z: 0 },
  };
  const [position, setPosition] = useState({ x: 0, z: 0 });

  useEffect(() => {
    if (actions && names.length > 0) {
      setIsReady(true);
    }
  }, [actions, names]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== "ArrowUp" &&
        e.key !== "ArrowRight" &&
        e.key !== "ArrowDown" &&
        e.key !== "ArrowLeft"
      ) {
        return;
      }

      setIsMoving(true);
      setKeyPressed((prev) => ({ ...prev, [e.key]: 1 }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft"
      ) {
        setKeyPressed((prev) => ({ ...prev, [e.key]: 0 }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!ref || !ref.current) {
      return;
    }

    const stand = actions[names[1]];
    const run = actions[names[2]];

    if (isMoving) {
      // 움직일 때
      if (stand && run) {
        stand.stop();
        run.play();
      }

      let xMove: number = 0,
        zMove: number = 0;

      for (const dirKey of dirKeys) {
        if (
          dirKey !== "ArrowUp" &&
          dirKey !== "ArrowRight" &&
          dirKey !== "ArrowDown" &&
          dirKey !== "ArrowLeft"
        ) {
          return;
        }

        xMove += keyPressed[dirKey] * keySpeedWeight[dirKey].x;
        zMove += keyPressed[dirKey] * keySpeedWeight[dirKey].z;
      }

      if (xMove === 0 && zMove === 0) {
        setIsMoving(false);

        if (run && stand) {
          run.stop();
          stand.play();
        }
      }

      setPosition((prev) => ({ x: prev.x + xMove, z: prev.z + zMove }));

      setChildPos({ x: position.x, z: position.z }); // 부모 컴포넌트 전달
      ref.current.position.set(position.x, 0, position.z);
    } else {
      // 움직이지 않을 때
      if (stand) {
        stand.play();
      }
    }

    let AngleWeight = 0;

    if (keyPressed["ArrowUp"] && keyPressed["ArrowRight"]) AngleWeight = 0.75;
    else if (keyPressed["ArrowUp"] && keyPressed["ArrowLeft"])
      AngleWeight = 1.25;
    else if (keyPressed["ArrowDown"] && keyPressed["ArrowRight"])
      AngleWeight = 0.25;
    else if (keyPressed["ArrowDown"] && keyPressed["ArrowLeft"])
      AngleWeight = 1.75;
    else if (keyPressed["ArrowUp"]) AngleWeight = 1;
    else if (keyPressed["ArrowRight"]) AngleWeight = 0.5;
    else if (keyPressed["ArrowDown"]) AngleWeight = 2;
    else if (keyPressed["ArrowLeft"]) AngleWeight = 1.5;

    if (AngleWeight) {
      ref.current.rotation.y = AngleWeight * Math.PI;
    }
  });

  return isReady ? (
    <primitive object={gltf.scene} scale={0.005} ref={ref} />
  ) : null;
}

export default Child;
