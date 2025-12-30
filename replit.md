# G3ZKP Messenger

A quantum-safe encrypted P2P communication platform with geodesic navigation capabilities.

## Overview

G3ZKP Messenger is a React + TypeScript + Vite application featuring:
- Zero-Knowledge Proof encrypted messaging
- P2P communication via libp2p
- Geodesic navigation with OpenStreetMap integration
- 3D visualization with Three.js
- PWA (Progressive Web App) support
- Cross-platform support (Web, Electron, Android, iOS via Capacitor)

## Project Structure

```
G3TZKP-MESSENGER-BETA-main/
└── G3TZKP-MESSENGER-BETA-main/
    └── G3ZKPBETAFINAL-main/
        ├── g3tzkp-messenger UI/     # Main React frontend (Vite)
        │   ├── src/
        │   │   ├── components/      # React components
        │   │   ├── services/        # Service layer (P2P, crypto, storage)
        │   │   ├── stores/          # Zustand state management
        │   │   └── contexts/        # React contexts
        │   ├── public/              # Static assets
        │   └── package.json
        ├── Packages/                # Internal packages
        ├── zkp-circuits/            # ZKP circuit definitions
        └── package.json             # Workspace root
```

## Development

The project runs on Vite development server on port 5000.

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Dependencies
- React 18 + TypeScript
- Vite 4.x
- Three.js + React Three Fiber
- libp2p for P2P networking
- Leaflet for maps
- Zustand for state management
- TailwindCSS for styling

## Architecture Notes

- The app uses Vite with React plugin
- Server configured for 0.0.0.0:5000 to support Replit's proxy
- libp2p provides decentralized P2P messaging (requires network infrastructure for full functionality)
- Storage uses IndexedDB for local persistence

## Recent Changes

- 2024-12-29: **G3TZKP PROTOCOL v1.0 + MESSAGING** - Custom P2P protocol replacing LibP2P
  - G3TZKPService.ts: Core protocol with direct WebRTC connections
  - G3TZKPSignaling.ts: Serverless signaling via QR code exchange
  - G3TZKPCrypto.ts: ECDH P-384 key exchange + AES-256-GCM encryption
  - G3TZKPConnectPopup.tsx: UI for peer connection via QR code offer/answer
  - MeshPage.tsx: Full messaging integration with edit/delete/react support
  - Peer ID format: G3-{40-char-base58-hash-of-public-key}
  - No external dependencies: No bootstrap nodes, no public relays
  - Direct browser-to-browser WebRTC DataChannels
  - Full specification: G3TZKP-PROTOCOL-SPEC.md
- 2024-12-29: **PURE P2P MODE FOR STATIC DEPLOYMENT** - Configured for IPFS hosting
  - MessagingService now defaults to p2p-only mode (no Socket.IO dependency)
  - Added isStaticDeployment() detection for IPFS/Filebase/g3tzkp.com domains
  - LibP2PService updated with 9 public bootstrap nodes for global peer discovery
  - WebRTC browser-to-browser connections enabled for direct messaging
  - Fixed initializeP2P() to properly return and store peer IDs
  - Build: `npm run build && cp public/vendor/libp2p-bundle.js dist/vendor/`
- 2024-12-29: **PRODUCTION BUILD SYSTEM** - Pre-bundled libp2p for IPFS deployment
  - Created esbuild script (scripts/build-libp2p-bundle.mjs) to pre-bundle libp2p
  - libp2p-bundle.js (1.1MB) contains all libp2p 3.x dependencies
  - Upgraded libp2p to 3.1.2 for consistent package versions
  - Vite config externalizes @libp2p/* packages and maps them to vendor bundle
  - Production dist/ folder (34MB) ready for IPFS deployment via Filebase
  - Build artifacts include PWA icons, manifest, service worker, and ZKP circuits
  - Build process: `node scripts/build-libp2p-bundle.mjs && npm run build && cp public/vendor/libp2p-bundle.js dist/vendor/`
- 2024-12-29: **CIRCUIT RELAY SERVER DEPLOYED** - Working libp2p relay server
  - Uses libp2p 1.8.0 stable with yamux stream muxer
  - Listens on TCP port 3001 for peer connections
  - HTTP status endpoint on port 4001 for monitoring
  - Supports circuit relay v2 and gossipsub
- 2024-12-29: **BIJECTIVE TENSOR MOBILE OPTIMIZATION** - Enhanced mobile responsiveness
  - 44px minimum touch targets for all control buttons (min-w-[44px] min-h-[44px])
  - Manifold type buttons: 44px on mobile, 32px on desktop (mouse users)
  - Safe area insets for notched devices (pt-safe, pb-safe, pr-safe)
  - Touch-manipulation CSS for better gesture handling
  - Taller slider controls (h-3 mobile, h-2 desktop) for easier touch interaction
  - Responsive grid layout for manifold type buttons (5 cols mobile, 10 cols desktop)
  - Icon sizes increased to 20px for better visibility
- 2024-12-29: **PEER DISCOVERY POPUP** - Full peer discovery implementation on Chats page
  - QR code generation with peer ID encoding (via qrcode library)
  - QR code scanning via camera (via jsqr library)
  - Manual peer ID search and add functionality
  - Share peer ID functionality with native sharing API
  - Mobile-optimized popup with 4 tabs: My QR, Scan, Add, Share
  - Integrated into MeshPage with QR button in header
- 2024-12-29: **MOBILE OPTIMIZATION** - Comprehensive mobile responsiveness
  - Touch-friendly button styles (min 44px tap targets)
  - Safe area insets for notched devices
  - Responsive text sizing with clamp()
  - Mobile-first flex layouts
  - Keyboard handling and viewport fixes
  - Enhanced CSS utilities for mobile popups
- 2024-12-29: **BIJECTIVE TENSOR MAPPING** - Complete overhaul of 3D geometry displacement system
  - Shader now uses TRUE bijective isomorphism: input media DEFINES manifold shape
  - Luma extraction + skin-tone detection (YCrCb) for biometric-reactive geometry
  - Audio metrics (RMS, Bass, Onset) modulate excision level and displacement in real-time
  - Edge detection for detail displacement creates organic texture deformation
  - Bijective strength slider (0-200%) for user control over mapping intensity
  - Live camera feed support via navigator.mediaDevices.getUserMedia
  - Manifold recording to .webm via canvas.captureStream() + MediaRecorder
- 2024-12-29: Moved search bar down within the map area (from top-4 to top-20)
- 2024-12-29: Fixed chat display names to use operator's profile name instead of "NODE_" prefix
- 2024-12-29: Initial import and setup for Replit environment
- Fixed libp2p package version conflicts (upgraded to libp2p@3.1.2 ecosystem with compatible versions)
- Configured Vite for Replit proxy compatibility (port 5000, allowedHosts: true)
- Set up deployment configuration (autoscale target)
- Added Ed25519 private key generation for LibP2P peer identity (LibP2PService.ts, MobileMessagingService.ts)
- Removed simulation mode from ZKPService - now runs in production mode only (no fake proofs)
- Removed electron dependencies to simplify build for web deployment

## Bijective Tensor Pipeline

The application implements a TRUE bijective {1:1} mapping between input media and 3D manifold geometry.

### Key Components

| File | Purpose |
|------|---------|
| `PhiPiRaymarchingMaterial.ts` | GLSL raymarching shader with bijective displacement |
| `BijectiveTensorRenderer.tsx` | React component for 3D preview with camera/recording |
| `BijectiveTensorService.ts` | Tensor data extraction and processing |
| `usePhiPiStore.ts` | Zustand state for manifold/audio/uplink |

### Shader Displacement Functions

- `getBijectiveDisplacement(p)` - Main luma-to-geometry mapping with skin-tone and audio modulation
- `getDetailDisplacement(p)` - Edge-based detail extraction for organic texture
- `detectSkinTone(rgb)` - YCrCb skin detection for biometric reactivity

### Uniforms

- `uBijectiveStrength` (0.0-2.0) - Overall mapping intensity
- `uUplinkExtrusion` - Base extrusion multiplier
- `uDepthScale` - Depth multiplier for Z-displacement
- `uOnset` - Audio onset trigger for pulse effects

### 10 Manifold Types

1. Flower of Life 19 - Sacred geometry base
2. Clifford Torus - 4D projection
3. Mobius Fold - Non-orientable surface
4. Singularity - Gravitational collapse
5. Hyperdrive Uplink - Tube-based extrusion
6. Klein Slice - Non-orientable manifold
7. Calabi-Yau - String theory compactification
8. Neural Fractal - Recursive neural pattern
9. Phi Geodesic - Golden ratio shell
10. Torus - Basic toroidal surface

## LibP2P Configuration

The application uses libp2p 3.x with the following key packages:
- libp2p@3.1.2 - Core P2P library
- @chainsafe/libp2p-gossipsub@14.1.2 - PubSub messaging
- @libp2p/peer-id@6.0.4 - Peer identity management
- @libp2p/kad-dht@16.1.2 - Distributed hash table
- @libp2p/bootstrap@12.0.10 - Bootstrap node discovery
- @libp2p/circuit-relay-v2@4.1.2 - NAT traversal
- @libp2p/webrtc@5.x - Native WebRTC transport

LibP2P is initialized with Ed25519 key generation for cryptographic peer identity. This enables:
- Secure message signing
- Peer-to-peer encrypted communication
- DHT-based peer discovery

## Peer Discovery

The app supports multiple peer discovery methods:

| Method | Description |
|--------|-------------|
| QR Code | Generate/scan QR codes containing peer IDs |
| Manual Entry | Enter peer ID directly to connect |
| Share | Share peer ID via native share API or clipboard |
| Bootstrap | Connect to public libp2p bootstrap nodes |

### PeerDiscoveryPopup Component

Located at `src/components/chat/PeerDiscoveryPopup.tsx`:
- Generates QR codes with styled cyan/black theme
- Scans QR codes using device camera
- Supports both `12D3KooW...` and `Qm...` peer ID formats
- Integrates with LibP2PService for peer connections

## Circuit Relay Server

A dedicated libp2p circuit relay server is deployed alongside the frontend for P2P connectivity:

### Running Configuration

- **Location**: `g3tzkp-messenger UI/server/relay-server.js`
- **TCP Port**: 3001 (libp2p protocol)
- **Status API**: http://localhost:4001/status

### Server Features

- libp2p 1.8.0 with yamux stream muxer
- Circuit relay v2 for NAT traversal
- GossipSub for PubSub messaging
- Identify protocol for peer discovery
- HTTP status endpoint for monitoring

### Dependencies (libp2p 1.x stable)

```json
{
  "@chainsafe/libp2p-gossipsub": "^13.0.0",
  "@chainsafe/libp2p-noise": "^15.0.0",
  "@chainsafe/libp2p-yamux": "^6.0.2",
  "@libp2p/circuit-relay-v2": "^2.0.0",
  "@libp2p/identify": "^2.0.0",
  "@libp2p/tcp": "^9.0.0",
  "@libp2p/websockets": "^8.0.0",
  "libp2p": "^1.8.0"
}
```

### Workflow

The relay server runs as a separate workflow (`RelayServer`) alongside the frontend.

### Current Connectivity

The app uses these resources:
- **Local Relay Server** - Circuit relay on TCP port 3001
- Public STUN servers for WebRTC NAT traversal
- Public bootstrap nodes for initial peer discovery
- Gossipsub for message distribution

## ZKP Service

The ZKP service runs entirely client-side using snarkjs for Groth16 proof generation and verification.

### Compiled Circuits (7 production circuits)

All circuits use Poseidon hash from circomlib for cryptographic security:

| Circuit | Constraints | Purpose |
|---------|-------------|---------|
| authentication | 497 | Proves identity without revealing secrets |
| forward_secrecy | 996 | Proves proper key rotation for PFS |
| group_message | 1126 | Proves group membership for messaging |
| key_rotation | 1057 | Proves Double Ratchet key derivation |
| message_delivery | 336 | Proves message delivery receipt |
| message_security | 1058 | Proves message encryption integrity |
| message_send | 589 | Proves authorized message sending |

### Build Artifacts

Located in `g3tzkp-messenger UI/public/circuits/`:
- `.wasm` files - WebAssembly witness calculators
- `.zkey` files - Groth16 proving keys (Powers of Tau ceremony)
- `_verification_key.json` files - Groth16 verification keys

### Usage

The ZKPService loads all circuits on initialization and provides typed methods:
- `generateAuthenticationProof()`
- `generateMessageSendProof()`
- `generateMessageDeliveryProof()`
- `generateForwardSecrecyProof()`
- `generateGroupMessageProof()`
- `generateKeyRotationProof()`
- `generateMessageSecurityProof()`

All methods require properly computed Poseidon commitments as inputs.

### Technical Details

- Proving system: Groth16 on BN128 curve
- Compiler: Circom 2.2.2
- Runtime: snarkjs in browser
- No backend required for ZKP operations
