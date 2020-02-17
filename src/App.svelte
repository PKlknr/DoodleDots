<script>
  import Canvas from './comp/Canvas.svelte';
  import Toolbar from './comp/Toolbar.svelte';
  import DoodleList from './comp/DoodleList.svelte';
  import DoodleActions from './comp/DoodleActions.svelte';
  import {doodlesService, settingsService} from './dac';
  import {sharePng} from './lib/share';
  import serial from './lib/serial';

  const doodles = doodlesService.store;
  const settings = settingsService.store;

  export let deferredPrompt = null; // from beforeinstallprompt
  export let hasUpdate = false;

  let canvasRef;
  let currentDoodle;
  $: {
    if (currentDoodle) {
      canvasRef.showDoodle(currentDoodle);
      setHash(serial.stringify(currentDoodle));
    }
  }

  export const handleHash = hash => {
    if (hash.substr(1)) {
      const doodle = serial.doodleFromHash($doodles, hash.substr(1));
      if (doodle) {
        showDoodle(doodle);
      }
    }
  };

  const setHash = hash => {
    history.replaceState({}, null, '#' + hash);
  };

  const share = doodle => {
    sharePng(doodle, $settings);
  };

  const discardDoodle = id => {
    if (id) {
      doodlesService.remove(id);
    }
    currentDoodle = null;
    setHash('');
    canvasRef.clear();
  };

  const keepDoodle = () => {
    if (currentDoodle && !currentDoodle.id) {
      const line = currentDoodle.line;
      if (line.length) {
        doodlesService.create(line, $settings.size, currentDoodle.createdAt);
      }
    }
    currentDoodle = null;
    setHash('');
    canvasRef.clear();
  };


  const showDoodle = doodle => {
    currentDoodle = doodle;
    /* eslint-disable-next-line no-console */
    console.log(
      `{size: [${doodle.size.join(', ')}],` +
        ` polyline: '${doodle.line.map(p => p.join(',')).join(' ')}'}`,
    );
  };

  const copyDoodleUrl = () => {
    navigator.clipboard.writeText(window.location);
  };

</script>

<div class="flex flex-col w-screen h-screen">

  <div class="flex justify-between flex-none bg-gray-800">
    <Toolbar
      on:doUpdate
      {hasUpdate}
      {deferredPrompt}
      {currentDoodle} />
  </div>

  <div class="relative flex-shrink-0">
    <Canvas
      bind:this="{canvasRef}"
      on:done="{e => keepDoodle(e.detail)}"
      on:elevate="{e => (currentDoodle = {size: $settings.size, line: e.detail})}"
      doodle="{currentDoodle && currentDoodle.line}" />

    <div class="absolute right-0 -mt-4 text-xs text-yellow-500 buttom-0">
      {(currentDoodle && currentDoodle.createdAt && new Date(currentDoodle.createdAt).toLocaleDateString()) || ''}
    </div>
  </div>

  <div class="flex-grow" class:hidden="{!currentDoodle}">
    <DoodleActions
      on:share="{e => share(e.detail)}"
      on:discard="{e => discardDoodle(e.detail)}"
      on:keep="{keepDoodle}"
      on:copy="{copyDoodleUrl}"
      {currentDoodle} />
  </div>
  <div
    class="relative flex flex-wrap overflow-x-auto"
    class:hidden="{currentDoodle}">
    <DoodleList
      {doodles}
      currentDoodleId="{currentDoodle && currentDoodle.id}"
      on:click="{e => showDoodle(e.detail)}" />
  </div>
</div>
