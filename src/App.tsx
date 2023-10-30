import { useState, useEffect } from "react";
import Child from "./components/Child";
import styles from "./App.module.scss";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { easing } from "maath";
import Bullets from "./components/Bullets";

export interface childPosType {
  x: number;
  z: number;
}

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 4, 0], 0, delta);
  });
}

function App() {
  const [start, setStart] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [childPos, setChildPos] = useState<childPosType>({ x: 0, z: 0 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (ready) {
      const scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 10);

      if (gameOver) {
        clearInterval(scoreInterval);
      }

      return () => {
        clearInterval(scoreInterval);
      };
    }
  }, [ready, gameOver]);

  const handleClickRestart = () => {
    setChildPos({ x: 0, z: 0 });
    setScore(0);
    setReady(false);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className={styles.container}>
        <div className={styles["result-div"]}>
          <p>Your Score</p>
          <p>{(score / 100).toFixed(2)}</p>
          <button onClick={handleClickRestart}>Restart</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!start && (
        <div className={styles["start-div"]}>
          <p>
            1. <span style={{ color: "red" }}>불닭 사탕</span>을 먹으면 매워
            죽습니다.
          </p>
          <p>
            2. <span style={{ color: "green" }}>청포도 사탕</span>을 먹으면
            점수가 10 증가합니다.
          </p>
          <button onClick={() => setStart(true)}>Start!</button>
        </div>
      )}
      {start && (
        <>
          <div className={styles["canvas-div"]}>
            <Canvas>
              <OrbitControls />
              <Environment preset={"sunset"} background={false} />
              <ambientLight intensity={1} />
              <pointLight
                position={[0, 5, 0]}
                intensity={20}
                distance={20}
                decay={2}
              />
              <Rig />
              <Child
                ready={ready}
                setReady={setReady}
                childPos={childPos}
                setChildPos={setChildPos}
              />
              <Bullets
                childPos={childPos}
                setGameOver={setGameOver}
                setScore={setScore}
              />
            </Canvas>
          </div>
          <div className={styles["score-div"]}>
            <p>Your Score</p>
            <p>{(score / 100).toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
