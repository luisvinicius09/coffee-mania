import {
	CameraControls,
	Circle,
	Environment,
	GizmoHelper,
	GizmoViewport,
	Plane,
	Torus,
} from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { MyObject } from './my-object';
import { clsx } from 'clsx';

export function App() {
	const [highlightPosition, setHighlightPosition] = useState<THREE.Vector3>(
		new THREE.Vector3(0.5, 0, 0.5)
	);

	const [inBuildMode, setInBuildMode] = useState<boolean>(false);
	const [objectSelected, setObjectedSelected] = useState<'plane' | 'torus' | 'ball'>(
		'plane'
	);

	const [objectsOnGrid, setObjectsOnGrid] = useState<JSX.Element[]>([]);

	const [objectsPositions, setObjectsPositions] = useState<THREE.Vector3[]>([]);

	const getPositionOnGrid = (position: THREE.Vector3) => {
		return new THREE.Vector3().copy(position).floor().addScalar(0.5);
	};

	const handleAddOnBuildMode = (e: ThreeEvent<MouseEvent>) => {
		if (!inBuildMode) {
			return;
		}

		const positionOnGrid = getPositionOnGrid(e.point);

		const object = objectsPositions.find(
			(position) => position.x === positionOnGrid.x && position.z === positionOnGrid.z
		);

		if (!object) {
			setObjectsPositions((prev) => {
				return [...prev, positionOnGrid];
			});

			switch (objectSelected) {
				case 'plane':
					setObjectsOnGrid((prev) => {
						return [
							...prev,
							<Plane
								position={positionOnGrid}
								key={`${positionOnGrid.x}-${positionOnGrid.y}-${positionOnGrid.z}`}
							/>,
						];
					});
					break;

				case 'ball':
					setObjectsOnGrid((prev) => {
						return [
							...prev,
							<Circle
								position={positionOnGrid}
								key={`${positionOnGrid.x}-${positionOnGrid.y}-${positionOnGrid.z}`}
							/>,
						];
					});
					break;

				case 'torus':
					setObjectsOnGrid((prev) => {
						return [
							...prev,
							<Torus
								position={positionOnGrid}
								key={`${positionOnGrid.x}-${positionOnGrid.y}-${positionOnGrid.z}`}
							/>,
						];
					});
					break;
			}

			return;
		}

		const objectIdx = objectsPositions.findIndex(
			(position) => position.x === positionOnGrid.x && position.z === positionOnGrid.z
		);

		setObjectsPositions(() => {
			return objectsPositions.splice(objectIdx, 1);
		});

		setObjectsOnGrid(() => {
			return objectsOnGrid.splice(objectIdx, 1);
		});
	};

	return (
		<>
			<div id='build-menu' className='bg-slate-200 p-4'>
				<div className='flex gap-2'>
					<button
						className={clsx(
							'bg-slate-400 p-4 text-white rounded font-bold',
							inBuildMode && 'border-2 border-slate-900'
						)}
						onClick={() => {
							setInBuildMode((prev) => {
								return !prev;
							});
						}}
					>
						Build Mode
					</button>
					<div>
						<p>Objects</p>

						<div className='flex gap-4'>
							<div>
								<button
									onClick={() => {
										setObjectedSelected('plane');
									}}
								>
									Square
								</button>
							</div>

							<div>
								<button
									onClick={() => {
										setObjectedSelected('ball');
									}}
								>
									Ball
								</button>
							</div>

							<div>
								<button
									onClick={() => {
										setObjectedSelected('torus');
									}}
								>
									Torus
								</button>
							</div>
						</div>
					</div>
				</div>
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
						onClick={handleAddOnBuildMode}
					>
						<meshBasicMaterial side={2} />
					</Plane>

					{objectsOnGrid.map((item) => item)}
				</Canvas>
			</div>
		</>
	);
}
