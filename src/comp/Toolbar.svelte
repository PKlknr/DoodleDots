<script>
  import {createEventDispatcher} from 'svelte';
  import screenfull from 'screenfull';
  import DoodleIcon from './DoodleIcon.svelte';
  import {settingsService} from '../dac';

  const settings = settingsService.store;
  const dispatch = createEventDispatcher();

  const toggleFullscreen = () =>
    screenfull[isFullscreen ? 'exit' : 'request']();
  screenfull.on('change', () => (isFullscreen = screenfull.isFullscreen));

  export let currentDoodle;
  export let hasUpdate;
  export let deferredPrompt;
  let isFullscreen = false;
</script>

<style>
  button,
  a {
    @apply h-12 w-12;
  }
</style>

<div class="flex">
  {#if !window.location.search.includes('embed')}
    <button class="" on:click="{toggleFullscreen}">
      {#if isFullscreen}
        <DoodleIcon shape="fullscreenOn" />
      {:else}
        <DoodleIcon shape="fullscreenOff" />
      {/if}
    </button>
  {:else}
    <a class="" target="_blank" href="https://dots.humos.org">
      <DoodleIcon shape="fullscreenOff" />
    </a>
  {/if}
</div>

<div class="flex">
  {#if !currentDoodle}
    <button
      class=""
      on:click="{() => {
        settingsService.setSize($settings.size[0] === 5 ? [6, 6] : [5, 5]);
      }}">
      {#if $settings.size[0] === 5}
        <DoodleIcon shape="five" />
      {:else}
        <DoodleIcon shape="six" />
      {/if}
    </button>
  {/if}
</div>

<div class="flex">
  {#if hasUpdate}
    <button class="" on:click="{() => dispatch('doUpdate')}">
      <DoodleIcon shape="update" class="text-yellow-300" />
    </button>
  {/if}
  {#if deferredPrompt}
    <button
      class=""
      on:click="{() => {
        deferredPrompt.prompt();
      }}">
      <DoodleIcon shape="home" />
    </button>
  {/if}
  {#if !window.location.search.includes('embed')}
    <a href="https://humos.org/dots.html" class="">
      <DoodleIcon shape="info" />
    </a>
  {/if}
</div>
