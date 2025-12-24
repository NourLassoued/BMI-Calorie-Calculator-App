// AvatarWithFat.jsx
import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Body({ bodyFat }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/avatar.glb");

  useEffect(() => {
    if (ref.current) {
      // Tronc
      const trunk = ref.current.getObjectByName("Trunk");
      if (trunk) trunk.scale.set(1 + bodyFat / 2, 1 + bodyFat / 2, 1 + bodyFat / 2);

      // Bras
      const leftArm = ref.current.getObjectByName("LeftArm");
      const rightArm = ref.current.getObjectByName("RightArm");
      if (leftArm) leftArm.scale.set(1 + bodyFat / 3, 1 + bodyFat / 3, 1 + bodyFat / 3);
      if (rightArm) rightArm.scale.set(1 + bodyFat / 3, 1 + bodyFat / 3, 1 + bodyFat / 3);

      // Jambes
      const leftLeg = ref.current.getObjectByName("LeftLeg");
      const rightLeg = ref.current.getObjectByName("RightLeg");
      if (leftLeg) leftLeg.scale.set(1 + bodyFat / 4, 1 + bodyFat / 4, 1 + bodyFat / 4);
      if (rightLeg) rightLeg.scale.set(1 + bodyFat / 4, 1 + bodyFat / 4, 1 + bodyFat / 4);
    }
  }, [bodyFat]);

  return <primitive ref={ref} object={scene} />;
}

export default function AvatarWithFat({ bodyFat = 0.2 }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Body bodyFat={bodyFat} />
      <OrbitControls />
    </Canvas>
  );
}
