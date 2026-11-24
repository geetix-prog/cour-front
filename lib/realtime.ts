import type { PublicUser } from "@/lib/api/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- chaque type de message a sa propre forme
type Listener = (data: any) => void;

const NO_RECONNECT = [4001, 4008, 4009];
const CLOSE_DELAY_MS = 1000;

const listeners = new Map<string, Set<Listener>>();
const openListeners = new Set<() => void>();

let socket: WebSocket | null = null;
let connecting = false;
let consumers = 0;
let attempt = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let online: PublicUser[] = [];

function scheduleReconnect() {
    attempt += 1;
    reconnectTimer = setTimeout(connect, Math.min(1000 * 2 ** attempt, 15000));
}

async function connect() {
    reconnectTimer = undefined;
    if (socket || connecting || consumers === 0) return;
    connecting = true;
    try {
        const res = await fetch('/api/realtime/ticket', { method: 'POST' });
        if (!res.ok) return;
        const { url } = await res.json();
        if (consumers === 0 || socket) return;
        open(url);
    } catch {
        if (consumers > 0) scheduleReconnect();
    } finally {
        connecting = false;
    }
}

function open(url: string) {
    const ws = new WebSocket(url);
    socket = ws;
    ws.onopen = () => {
        attempt = 0;
        openListeners.forEach((listener) => listener());
    };
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "hello") online = message.data.online;
        if (message.type === "presence:online") online = message.data.users;
        listeners.get(message.type)?.forEach((listener) => listener(message.data));
    };
    ws.onclose = (event) => {
        if (socket === ws) socket = null;
        if (consumers === 0 || NO_RECONNECT.includes(event.code)) return;
        scheduleReconnect();
    };
}

function disconnect() {
    clearTimeout(reconnectTimer);
    reconnectTimer = undefined;
    socket?.close(1000);
    socket = null;
    online = [];
}

export function retain() {
    clearTimeout(closeTimer);
    consumers += 1;
    if (!socket && !connecting && !reconnectTimer) connect();
    return () => {
        consumers -= 1;
        if (consumers === 0) closeTimer = setTimeout(disconnect, CLOSE_DELAY_MS);
    };
}

export function subscribe(type: string, listener: Listener) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type)!.add(listener);
    return () => {
        listeners.get(type)?.delete(listener);
    };
}

export function onOpen(listener: () => void) {
    openListeners.add(listener);
    if (socket?.readyState === WebSocket.OPEN) listener();
    return () => {
        openListeners.delete(listener);
    };
}

export function send(type: string, data: object = {}) {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, data }));
}

/** Dernière liste connue des utilisateurs en ligne (reçue via `hello` ou `presence:online`). */
export function getOnline() {
    return online;
}
