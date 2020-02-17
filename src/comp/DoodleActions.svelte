<script>
  import {createEventDispatcher} from 'svelte';
  import DoodleIcon from './DoodleIcon.svelte';

  const dispatch = createEventDispatcher();

  export let currentDoodle;

  // {# if navigator.share}{:else if navigator.clipboard} didn't work
  // in iframe in firefox (if_block is not defined)
  $: showShare = navigator.share;
  $: showClip =
    !showShare &&
    navigator.clipboard &&
    !window.location.search.includes('embed');
</script>

<div class="flex items-start h-full bg-black">
  <button
    class="flex flex-col items-center flex-grow"
    on:click="{dispatch('keep', currentDoodle)}">
    <DoodleIcon class="w-12 h-12" shape="keep" />
    KEEP
  </button>
  {#if showShare}
    <button
      class="flex flex-col items-center flex-grow"
      on:click="{() => dispatch('share', currentDoodle)}">
      <DoodleIcon class="w-12 h-12" shape="share" />
      SHARE
    </button>
  {:else if showClip}
    <button
      class="flex flex-col items-center flex-grow"
      on:click="{() => dispatch('copy')}">
      <DoodleIcon class="w-12 h-12" shape="copy" />
      COPY
    </button>
  {/if}
  <button
    class="flex flex-col items-center flex-grow"
    on:click="{dispatch('discard', currentDoodle.id)}">
    <DoodleIcon class="w-12 h-12" shape="discard" />
    DELETE
  </button>
</div>
