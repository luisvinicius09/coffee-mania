import {
	CameraControls,
	Environment,
	GizmoHelper,
	GizmoViewport,
	Plane,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { MyObject } from './my-object';

export function App() {
	const [highlightPosition, setHighlightPosition] = useState<THREE.Vector3>(
		new THREE.Vector3(0.5, 0, 0.5)
	);

	const [inBuildMode, setInBuildMode] = useState<boolean>(false);

	const [objectsPositions, setObjectsPositions] = useState<THREE.Vector3[]>([]);

	const getPositionOnGrid = (position: THREE.Vector3) => {
		return new THREE.Vector3().copy(position).floor().addScalar(0.5);
	};

	return (
		<>
			<div id='build-menu'>
				<button
					onClick={() => {
						setInBuildMode((prev) => {
							return !prev;
						});
					}}
				>
					Build Mode
				</button>
			</div>

			<div id='canvas-container'>
				<Canvas camera={{ position: [10, 3, 6] }}>
					<CameraControls makeDefault />

					<Environment background={true} blur={0.7} preset={'warehouse'} />

					<ambientLight intensity={0.1} />
					<directionalLight color='red' position={[0, 0, 5]} />

					<GizmoHelper>
						<GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
					</GizmoHelper>

					<Plane
						args={[20, 20]}
						rotation={[-Math.PI / 2, 0, 0]}
						onPointerMove={(e) => {
							setHighlightPosition(getPositionOnGrid(e.point));
						}}
					>
						<meshBasicMaterial side={2} visible={false} />
					</Plane>

					<gridHelper args={[20, 20]} />

					<Plane
						name='build-hightlight'
						visible={inBuildMode}
						position={[highlightPosition.x, 0, highlightPosition.z]}
						rotation={[-Math.PI / 2, 0, 0]}
						onClick={(e) => {
							if (!inBuildMode) {
								return;
							}

							const positionOnGrid = getPositionOnGrid(e.point);

							const object = objectsPositions.find(
								(position) =>
									position.x === positionOnGrid.x && position.z === positionOnGrid.z
							);

							if (!object) {
								setObjectsPositions((prev) => {
									return [...prev, positionOnGrid];
								});

								return;
							}

							// TODO: Fix remove object from grid

							// const objectIdx = objectsPositions.findIndex(
							// 	(position) =>
							// 		position.x === positionOnGrid.x && position.z === positionOnGrid.z
							// );

							// setObjectsPositions(objectsPositions.splice(objectIdx, 1));

							return;
						}}
					>
						<meshBasicMaterial side={2} />
					</Plane>

					{objectsPositions.map((position, idx) => {
						return <MyObject position={position} key={idx} />;
					})}
				</Canvas>
			</div>
		</>
	);
}
