<template>
  <div class="main-content">

    <Hives />
  </div>
</template>

<script>
import Hives from "./components/Hives.vue";

export default {
  name: 'App',
  components: {
    Hives
  },
  data() {
    return {
      strokeColor: "#919296"
    };
  }
}
</script>

<style>
:root {
  /* Main stroke color */
  --stroke-color: #919296;
}

@font-face {
  font-family: "TwCen";
  src: url(./assets/fonts/TwCenMTStd.otf);
}

@font-face {
  font-family: "TwCenLight";
  src: url(./assets/fonts/TwCenMTStd-Light.otf);
}

#app {
  font-family: TwCen, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--stroke-color);
  margin: 20px 0px;
}

body {
  margin: 0;
}

.main-content {
  width: 80%;
  margin-left: auto;
  margin-right: 50px;
}
</style>
