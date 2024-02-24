<script>
  import BigBoard from "./lib/BigBoard.svelte";
  import { turn } from "./store/store";
  import { bigBoardStatus } from "./store/store";
</script>

<main>
  <div>Now turn: {$turn}</div>
  <BigBoard />
</main>

<style>
</style>
