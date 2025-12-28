import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate a random 4-letter room code
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar chars
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Get room code from URL
export function getRoomFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('room');
}

// Update URL with room code
export function updateURLWithRoom(roomCode) {
  const url = new URL(window.location);
  url.searchParams.set('room', roomCode);
  window.history.pushState({}, '', url);
}

