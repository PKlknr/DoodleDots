<script>
  import {createEventDispatcher} from 'svelte';
  import {settingsService} from '../dac';
  import {polyline} from '../lib/util.js';

  const dispatch = createEventDispatcher();
  const settings = settingsService.store;

  export let doodles;
  export let currentDoodleId;
</script>

{#each $doodles.items as doodle, i}
  <svg
    class="flex-shrink-0 w-12 h-12 doodle"
    class:bg-gray-700="{currentDoodleId === doodle.id}"
    viewbox="0 0 {(doodle.size || [5, 5]).join(' ')}"
    on:click="{() => dispatch('click', doodle)}">
    <g transform="translate({$settings.rHot * 2}, {$settings.rHot * 2})">
      <polyline points="{polyline(doodle.line)}"></polyline>
    </g>
  </svg>
{/each}
