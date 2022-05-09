import './App.css';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { Earth } from './components/earth';
import { Menu } from './components/menu';
import { Suspense } from 'react';
import { OrbitControls } from "@react-three/drei";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Bg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top:0;
  left:0;
`

const Bar = styled.aside`
  height: 100vh;
  max-width: 8vw;
  background-color: rgb(191, 248, 255, 0.6);
  z-index: 999;
  cursor: point;
`

function App() {
  return (
    <CanvasContainer>
      <Canvas>
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
      </Canvas>
    </CanvasContainer>
  );
}

export default App;
