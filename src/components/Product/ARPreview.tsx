import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, Maximize2 } from 'lucide-react';

interface ARPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
}

const ProductModel = () => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <MeshDistortMaterial
                    color="#D4AF37"
                    speed={3}
                    distort={0.4}
                    radius={1}
                />
            </mesh>
        </Float>
    );
};

const ARPreview: React.FC<ARPreviewProps> = ({ isOpen, onClose, productName }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[4000] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 flex justify-between items-center z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Box className="text-[#D4AF37]" size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Next-Gen Visualization</span>
                                </div>
                                <h2 className="text-3xl font-bold font-heading">{productName} <span className="text-gray-500 font-normal">3D View</span></h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 glass rounded-full flex items-center justify-center hover:rotate-90 transition-transform"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* 3D Canvas */}
                        <div className="flex-grow relative">
                            <Canvas shadows dpr={[1, 2]}>
                                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
                                <Suspense fallback={null}>
                                    <Stage intensity={0.5} environment="city" adjustCamera={false}>
                                        <ProductModel />
                                    </Stage>
                                </Suspense>
                                <OrbitControls enableZoom={true} makeDefault />
                                <Environment preset="city" />
                            </Canvas>

                            {/* AR Prompt */}
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                                <button className="premium-btn flex items-center gap-3 px-10 py-5">
                                    <Maximize2 size={20} /> View in Your Space (AR)
                                </button>
                            </div>
                        </div>

                        {/* Controls Info */}
                        <div className="p-8 text-center text-gray-500 text-[10px] uppercase tracking-widest">
                            Drag to rotate • Pinch to zoom • Tap AR button for Mobile Preview
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ARPreview;
