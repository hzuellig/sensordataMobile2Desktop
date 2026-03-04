# Mobile → Desktop Sensor Render Boilerplate

Small teaching/demo boilerplate to stream orientation sensor data from a mobile device to a desktop browser via WebSockets and render it in p5.js.

## What it does

- Captures `deviceorientation` data (`alpha`, `beta`, `gamma`) on mobile
- Sends data from mobile client to the Node.js server using Socket.IO
- Broadcasts data to other connected clients (desktop)
- Renders the orientation on desktop in a simple 3D p5.js scene

## Tech stack

- Node.js + Express
- Socket.IO
- p5.js

## Project structure

```
.
├── server.js
├── package.json
├── public/
│   ├── mobile.html
│   ├── desktop.html
│   ├── sketchMobile.js
│   ├── sketchDesktop.js
│   └── libraries/
```

## Quick start

1. Install dependencies:

	 ```bash
	 npm install
	 ```

2. Start the server:

	 ```bash
	 npm start
	 ```

3. Open clients:

- Desktop receiver: `http://localhost:3000/desktop`
- Mobile sender: `http://localhost:3000/mobile`

If you want to use a real phone, open the server from your phone on the same network (use your computer's local IP instead of `localhost`).

## Sensor support behavior

- **iOS Safari:** requires explicit permission (`DeviceOrientationEvent.requestPermission()`).
- **Android / other mobile browsers:** if `deviceorientation` is available, data starts directly.
- **Unsupported browsers/devices:** UI shows that sensor streaming is not supported.
- **No live events:** UI times out and shows that no live sensor events were detected.

## Important notes

- Mobile sensor APIs usually require a secure context (`https`) or `localhost`.
- On desktop browsers, orientation sensors are often unavailable (this is expected).
- This boilerplate currently sends to all *other* clients (`socket.broadcast.emit`), not back to the sender itself.

## Troubleshooting

- If desktop receives nothing:
	- Check server log for `Client connected`
	- Ensure both devices are connected to the same server URL
	- Verify mobile browser permissions for motion/orientation sensors
	- Try iOS Safari or Android Chrome on a physical phone

- If mobile says "Waiting for sensor events...":
	- Move/rotate the phone physically
	- Check browser/site sensor permission settings
	- Confirm you are in a supported browser

## Teaching tip

This repo is intentionally small so students can easily modify:

- the sensor mapping in `public/sketchDesktop.js`
- the outgoing payload in `public/sketchMobile.js`
- the relay logic in `server.js`
