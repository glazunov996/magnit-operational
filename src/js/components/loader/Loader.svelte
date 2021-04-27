<script>
  import Int from 'components/core/internationalization/Int.svelte';

  export let message = null;
  export let shift = 0;
</script>

<div
  class="txcm-loader">
    <svg
      class="txcm-loaderIcon"
      style="top: {shift}px;"
      width="24"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
        <clipPath id="txcm-loaderClipPath">
          <path
            id="txcm-loaderForm"
            d="M2.13 2.19A7.221 7.221 0 000 7.325v9.518l.652-.1C2.254 16.5 3.75 15 3.75 13.5v-6c0-.948.448-1.946 1.125-2.625C5.552 4.198 6.554 3.75 7.5 3.75H24V0H7.253C5.321 0 3.501.814 2.13 2.19zM21.87 21.81A7.221 7.221 0 0024 16.675V7.156l-.652.1C21.746 7.501 20.25 9 20.25 10.5v6c0 .948-.448 1.946-1.125 2.625-.677.677-1.679 1.125-2.625 1.125H0V24h16.747c1.932 0 3.752-.814 5.124-2.19z" />
        </clipPath>
        <use
          class="txcm-loaderForm"
          xlink:href="#txcm-loaderForm" />
        <path
          class="txcm-loaderPath"
          d="M1.85 7v15.15H17c3.5 0 5.15-3.15 5.15-5.15V1.85H7C4.5 1.85 1.85 4.5 1.85 7z"
          clip-path="url(#txcm-loaderClipPath)" />
      </svg>
      {#if message}
        <div
          class="txcm-loaderMessage"
          style="top: {shift}px;">
            <Int
              key={message} />
        </div>
      {/if}
</div>
