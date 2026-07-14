# EEG State Visualizer 🧠🌊

A frontend web application designed to take raw brainwave frequency data (mocked or via WebSocket from a consumer EEG headset like Muse or OpenBCI) and translate complex neuro-states (Alpha, Beta, Theta, Delta) into intuitive, flowing visual color patterns.

**Creator:** Shubham Sunil Kumar

## 🎯 The Vision
To achieve the "Dreams to Reality" smart glasses, you must first understand the state of the mind. Is the user focused? Are they falling asleep? Are they in REM (Dreaming) sleep? This visualizer acts as the bridge between raw, incomprehensible voltage data and human-readable states. 

It uses **Three.js** and **WebGL shaders** to create a fluid, organic particle system that changes color, speed, and turbulence based on the dominant brainwave frequency.

## 🧠 Brainwave States Visualized:
* **Delta (0.5 - 4 Hz):** Deep Sleep. Visual: Slow, pulsing, deep blues and purples.
* **Theta (4 - 8 Hz):** Light Sleep / Meditation / REM. Visual: Flowing, smooth, teal and green.
* **Alpha (8 - 13 Hz):** Relaxed Focus. Visual: Calm, steady, warm yellows.
* **Beta (13 - 30 Hz):** Active Thinking / Alert. Visual: Fast, chaotic, sharp reds and oranges.

## 🚀 Setup & Installation
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone or extract this repository.
3. Open your terminal in the project folder and install the dependencies (Express for serving the frontend):
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Visualizer
```bash
npm start
```
Open your web browser to `http://localhost:3000`.

*Note: Since consumer EEG headsets require proprietary Bluetooth APIs or native desktop applications to connect initially, this repository includes an advanced **Simulator Dashboard**. You can use sliders to manually inject Alpha/Beta/Theta/Delta values to watch how the 3D visualization reacts in real-time.*

## 🔌 Next Steps for Real Hardware
To connect a real Muse or OpenBCI headset:
1. Run a native application (like Mind-Monitor for Muse or the OpenBCI GUI) that can stream OSC (Open Sound Control) or WebSocket data.
2. Modify `public/js/eeg-controller.js` to connect to that local WebSocket stream instead of using the simulator sliders.

## 📄 License
MIT License
