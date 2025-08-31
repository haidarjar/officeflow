'use client';
import { useEffect } from 'react';

// INGFO: hook sekali jalan (pengganti useEffect([])). 🔁
export function use_effect_once(fn: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}
