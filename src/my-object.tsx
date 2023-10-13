import { Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function MyObject({ position }: { position: THREE.Vector3 }) {
	const ref = useRef<THREE.Mesh>(null!);

	useFrame((state) => {
		const t = state.clock.getElapsedTime();

		ref.current.rotation.set(
			Math.cos(t / 4) / 8,
			Math.sin(t / 3) / 4,
			0.15 + Math.sin(t / 2) / 8
		);
		ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7;
	});

	return (
		<Torus
			position={[position.x, 1, position.z]}
			scale={1}
			args={[0.3, 0.1, 8, 15]}
			ref={ref}
		>
			<meshBasicMaterial color='yellow' wireframe />
		</Torus>
	);
}
