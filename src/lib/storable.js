import {writable} from 'svelte/store';

function safeGet(key, initial) {
  try {
    const str = localStorage.getItem(key);
    if (str === null) {
      return initial;
    }
    return JSON.parse(str);
  } catch (e) {
    console.log('Cannot get from localStorage', e);
    return initial;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log('Cannot set localStorage', e);
  }
}


export default function storable(key, initial = null) {
  const w = writable(safeGet(key, initial));

  w.subscribe(v => {
    safeSet(key, v);
  });

  return w;
}
