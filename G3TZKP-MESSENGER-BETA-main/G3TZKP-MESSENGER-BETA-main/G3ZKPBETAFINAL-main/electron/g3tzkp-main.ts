import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { createLibp2p, type Libp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { all as wsAllFilter } from '@libp2p/websockets/filters';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';

interface DesktopP2PNode {
  node: Libp2p | null;
  mainWindow: BrowserWindow | null;
  peerId: string;
}

const desktopNode: DesktopP2PNode = {
  node: null,
  mainWindow: null,
  peerId: ''
};

async function startP2PNode(): Promise<string> {
  console.log('🖥️ Starting Desktop P2P Node...');

  try {
    desktopNode.node = await createLibp2p({
      addresses: {
        listen: ['/ip4/0.0.0.0/tcp/9090', '/ip4/0.0.0.0/tcp/9091/ws']
      },
      transports: [tcp(), webSockets({ filter: wsAllFilter })],
      connectionEncryption: [noise()],
      streamMuxers: [mplex()],
      services: {
        identify: identify(),
        ping: ping()
      },
      connectionManager: {
        minConnections: 1,
        maxConnections: 25,
        pollInterval: 2000,
        autoDial: true,
        autoDialInterval: 10000
      }
    });

    await desktopNode.node.start();

    desktopNode.peerId = desktopNode.node.peerId.toString();

    desktopNode.node.handle('/g3zkp/1.0.0', async ({ stream, connection }) => {
      const peerId = connection.remotePeer.toString();
      const decoder = new TextDecoder();

      try {
        for await (const chunk of stream.source) {
          const message = decoder.decode(chunk);
          console.log(`📩 [Desktop] Received from ${peerId}:`, message);

          if (desktopNode.mainWindow) {
            desktopNode.mainWindow.webContents.send('p2p-message', {
              peerId,
              message,
              timestamp: new Date().toISOString()
            });
          }

          const encoder = new TextEncoder();
          await stream.sink([encoder.encode('ACK')]);
        }
      } catch (error) {
        console.error('Protocol handler error:', error);
      } finally {
        try {
          await stream.close();
        } catch (e) {
          // Stream already closed
        }
      }
    });

    console.log('✅ Desktop P2P Node started:', desktopNode.peerId);
    return desktopNode.peerId;
  } catch (error) {
    console.error('❌ Desktop P2P initialization failed:', error);
    throw error;
  }
}

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.ts')
    }
  });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('https://app.g3tzkp.com');
  }

  return mainWindow;
}

app.on('ready', async () => {
  try {
    const peerId = await startP2PNode();

    desktopNode.mainWindow = createWindow();

    ipcMain.handle('get-peer-id', () => peerId);

    ipcMain.handle('get-p2p-status', () => ({
      peerId,
      isOnline: !!desktopNode.node && !desktopNode.node.isStopped(),
      multiaddrs: desktopNode.node?.getMultiaddrs().map(ma => ma.toString()) || []
    }));

    ipcMain.handle('send-message', async (event, { peerId: targetPeerId, message }) => {
      if (!desktopNode.node) {
        throw new Error('P2P node not initialized');
      }

      try {
        const { peerIdFromString } = await import('@libp2p/peer-id');
        const targetPeerId_obj = peerIdFromString(targetPeerId);

        const stream = await desktopNode.node.dialProtocol(
          targetPeerId_obj,
          '/g3zkp/1.0.0',
          { signal: AbortSignal.timeout(10000) }
        );

        const encoder = new TextEncoder();
        const { pipe } = await import('it-pipe');

        await pipe([encoder.encode(message)], stream.sink);

        const decoder = new TextDecoder();
        for await (const chunk of stream.source) {
          if (decoder.decode(chunk) === 'ACK') {
            console.log(`✅ [Desktop] Message delivered to ${targetPeerId}`);
            return { success: true, message: 'Message sent' };
          }
        }

        return { success: false, message: 'No acknowledgment' };
      } catch (error) {
        console.error(`❌ [Desktop] Failed to send to ${targetPeerId}:`, error);
        return { success: false, message: error instanceof Error ? error.message : String(error) };
      }
    });
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  if (desktopNode.node) {
    await desktopNode.node.stop();
  }
});
