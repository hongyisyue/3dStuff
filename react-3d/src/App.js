import { Suspense } from 'react';
import styled from 'styled-components';
import './App.css';
import { Earth } from './components/earth';
import { Canvas } from '@react-three/fiber';
import { OrbitControls} from "@react-three/drei";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%
`;

function App() {
  return (
    <CanvasContainer>
      <Canvas>
        <Suspense fallback={null}>
          <Earth/>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </CanvasContainer>
  );
}

export default App;
