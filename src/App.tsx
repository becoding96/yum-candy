import { useState, useEffect } from "react";
import Child from "./components/Child";
import styles from "./App.module.scss";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { easing } from "maath";

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 4, 0], 0, delta);
  });
}

function App() {
  const [childPos, setChildPos] = useState({ x: 0, z: 0 });

  useEffect(() => {
    console.log(childPos);
  }, [childPos]);

  return (
    <div className={styles.container}>
      <div className={styles["canvas-div"]}>
        <Canvas>
          <Child setChildPos={setChildPos} />
          <OrbitControls />
          <Environment preset={"sunset"} background={false} />
          <Rig />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
