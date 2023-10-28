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
  const [isReady, setIsReady] = useState(false);
  const { ref, actions, names } = useAnimations(gltf.animations);
  const moveSpeed = 0.1;
  const [isMoving, setIsMoving] = useState(false);
  const [isLookingLeft, setIsLookingLeft] = useState(false);
  const [isLookingRight, setIsLookingRight] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isLookingDown, setIsLookingDown] = useState(false);
  const [position, setPosition] = useState({ x: 0, z: 0 });

  useEffect(() => {
    if (actions && names.length > 0) {
      setIsReady(true);
    }
  }, [actions, names]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.keyCode);
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft"
      ) {
        setIsMoving(true);
        if (e.key === "ArrowLeft") {
          setIsLookingLeft(true);
          setIsLookingRight(false);
          setIsLookingUp(false);
          setIsLookingDown(false);
        } else if (e.key === "ArrowRight") {
          setIsLookingLeft(false);
          setIsLookingRight(true);
          setIsLookingUp(false);
          setIsLookingDown(false);
        } else if (e.key === "ArrowUp") {
          setIsLookingLeft(false);
          setIsLookingRight(false);
          setIsLookingUp(true);
          setIsLookingDown(false);
        } else if (e.key === "ArrowDown") {
          setIsLookingLeft(false);
          setIsLookingRight(false);
          setIsLookingUp(false);
          setIsLookingDown(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft"
      ) {
        setIsMoving(false);
        setIsLookingLeft(false);
        setIsLookingRight(false);
        setIsLookingUp(false);
        setIsLookingDown(false);
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
      if (run) {
        run.play();
      }
      // 위치 조정
      if (isLookingLeft) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x - 0.02,
        }));
      } else if (isLookingRight) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x + 0.02,
        }));
      } else if (isLookingUp) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          z: prevPosition.z - 0.02,
        }));
      } else if (isLookingDown) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          z: prevPosition.z + 0.02,
        }));
      }

      setChildPos({ x: position.x, z: position.z });
      ref.current.position.set(position.x, 0, position.z);
    } else {
      // 움직이지 않을 때
      if (run && stand) {
        run.stop();
        stand.play();
      }
    }

    // 캐릭터 회전
    if (isLookingLeft) {
      ref.current.rotation.y = -Math.PI / 2;
    } else if (isLookingRight) {
      ref.current.rotation.y = Math.PI / 2;
    } else if (isLookingUp) {
      ref.current.rotation.y = Math.PI;
    } else if (isLookingDown) {
      ref.current.rotation.y = 0;
    }
  });

  return isReady ? (
    <primitive object={gltf.scene} scale={0.005} ref={ref} />
  ) : null;
}

export default Child;
