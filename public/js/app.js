import * as THREE from 'three';

class EEGVisualizer {
    constructor() {
        this.container = document.getElementById('canvas-container');
        
        // Setup Three.js Scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // State Variables
        this.clock = new THREE.Clock();
        this.particles = null;
        
        // Initial Brainwave State
        this.brainState = {
            delta: 20,
            theta: 30,
            alpha: 60,
            beta: 10
        };

        this.targetColor = new THREE.Color(0x00ffcc); // Default to Alpha (Teal/Yellow-ish)
        this.targetSpeed = 1.0;
        
        this.initParticles();
        this.setupUIBindings();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Start Loop
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    initParticles() {
        // Create an organic, flowing particle system
        const particleCount = 15000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Spread particles in a sphere
            const r = 20 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            sizes[i] = Math.random() * 2.0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom Shader Material for organic pulsing
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                baseColor: { value: this.targetColor },
                speed: { value: 1.0 }
            },
            vertexShader: `
                uniform float time;
                uniform float speed;
                attribute float size;
                varying vec3 vColor;
                
                void main() {
                    vec3 pos = position;
                    
                    // Add organic, flowing noise based on time and speed
                    pos.x += sin(time * speed + pos.y * 0.5) * 2.0;
                    pos.y += cos(time * speed * 0.8 + pos.x * 0.5) * 2.0;
                    pos.z += sin(time * speed * 1.2 + pos.z * 0.5) * 2.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (30.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 baseColor;
                
                void main() {
                    // Make particles circular and glowing
                    vec2 xy = gl_PointCoord.xy - vec2(0.5);
                    float ll = length(xy);
                    if (ll > 0.5) discard;
                    
                    // Soft edge
                    float alpha = (0.5 - ll) * 2.0;
                    gl_FragColor = vec4(baseColor, alpha * 0.8);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, this.material);
        this.scene.add(this.particles);
    }

    setupUIBindings() {
        const waves = ['delta', 'theta', 'alpha', 'beta'];
        
        waves.forEach(wave => {
            const slider = document.getElementById(`slider-${wave}`);
            const label = document.getElementById(`val-${wave}`);
            
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                label.innerText = val;
                this.brainState[wave] = val;
                this.updateNeuralState();
            });
        });
        
        this.updateNeuralState(); // Init text
    }

    updateNeuralState() {
        // Find the dominant brainwave
        let dominant = 'alpha';
        let maxVal = -1;
        
        for (const [key, value] of Object.entries(this.brainState)) {
            if (value > maxVal) {
                maxVal = value;
                dominant = key;
            }
        }

        const stateLabel = document.getElementById('dominant-state');
        
        // Map brainwaves to visual states (Color and Speed)
        switch(dominant) {
            case 'delta':
                stateLabel.innerText = "Deep Sleep (Delta)";
                stateLabel.style.color = "#3b82f6"; // Blue
                this.targetColor.setHex(0x3b82f6);
                this.targetSpeed = 0.2; // Very slow, pulsing
                break;
            case 'theta':
                stateLabel.innerText = "REM/Meditation (Theta)";
                stateLabel.style.color = "#10b981"; // Green
                this.targetColor.setHex(0x10b981);
                this.targetSpeed = 0.6; // Flowing, dreamlike
                break;
            case 'alpha':
                stateLabel.innerText = "Relaxed Focus (Alpha)";
                stateLabel.style.color = "#eab308"; // Yellow
                this.targetColor.setHex(0xeab308);
                this.targetSpeed = 1.2; // Calm, steady
                break;
            case 'beta':
                stateLabel.innerText = "Active/Alert (Beta)";
                stateLabel.style.color = "#ef4444"; // Red
                this.targetColor.setHex(0xef4444);
                this.targetSpeed = 3.5; // Fast, chaotic, sharp
                break;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        const delta = this.clock.getDelta();
        
        if (this.material) {
            // Smoothly interpolate current color toward target color
            this.material.uniforms.baseColor.value.lerp(this.targetColor, 0.05);
            
            // Smoothly interpolate speed
            this.material.uniforms.speed.value += (this.targetSpeed - this.material.uniforms.speed.value) * 0.05;
            
            // Advance time for the shader
            this.material.uniforms.time.value += delta;
        }
        
        // Slowly rotate the entire system
        if (this.particles) {
            this.particles.rotation.y += delta * 0.1 * this.material.uniforms.speed.value;
            this.particles.rotation.x += delta * 0.05 * this.material.uniforms.speed.value;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when ready
window.addEventListener('DOMContentLoaded', () => {
    new EEGVisualizer();
});
