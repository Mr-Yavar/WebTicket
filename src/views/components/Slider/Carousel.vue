<script>
export default {
  name: "Carousel",

  data: () => ({
    current: 0,
    direction: 1,
    transitionName: "fade",
    show: false,
    slides: [
      {className: "blue", timeOut: 10000},
      {className: "red", timeOut: 2000},
      {className: "yellow", timeOut: 10000}
    ],
    timer: null,
    defaultTimeOut: 10000,
    pause: false
  })
  ,
  methods: {
    slide(dir) {
      this.direction = dir;
      dir === 1
          ? (this.transitionName = "slide-next")
          : (this.transitionName = "slide-prev");
      var len = this.slides.length;
      if (this.timer != null)
        clearTimeout(this.timer);


      this.current = (this.current + dir % len + len) % len;

      if (!this.pause)
        this.timer = setTimeout(() => {
          this.slide(1)

        }, (this.slides[this.current].timeOut) ? this.slides[this.current].timeOut : this.defaultTimeOut);


    }
  },
  mounted() {
    this.show = true;
    if (!this.pause)
      this.timer = setTimeout(() => {
        this.slide(1)
        console.log(1);
      }, (this.slides[this.current].timeOut) ? this.slides[this.current].timeOut : this.defaultTimeOut);

  }
}

</script>

<template>
  <div class="AppGap">
    <div id="slider" class="AppContainer rounded-xl" style="height: 320px;">
      <transition-group tag="div" :name="transitionName" class="slides-group " style="height: 320px;">
        <div v-if="show" :key="current" class="slide h" style="height: 320px;" :class="slides[current].className">
          <p>I'm {{ slides[current].className }}!</p>
        </div>
      </transition-group>
      <div class="btn btn-prev" aria-label="Previous slide" @click="slide(-1)">
        &#10095;

      </div>
      <div class="btn btn-next" aria-label="Next slide" @click="slide(1)">
        &#10094;
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Crimson+Text");

/* FADE IN */
.fade-enter-active {
  transition: opacity 1s;
}

.fade-enter {
  opacity: 0;
}

/* GO TO NEXT SLIDE */
.slide-next-enter-active,
.slide-next-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-next-enter {
  transform: translate(100%);
}

.slide-next-leave-to {
  transform: translate(-100%);
}

/* GO TO PREVIOUS SLIDE */
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-prev-enter {
  transform: translate(-100%);
}

.slide-prev-leave-to {
  transform: translate(100%);
}

/* SLIDES CLASSES */

.blue {
  background: #4a69bd;
}

.red {
  background: #e55039;
}

.yellow {
  background: #f6b93b;
}

/* SLIDER STYLES */
body {
  overflow: hidden;
  margin: 0;
  font-size: 50px;
  font-family: "Crimson Text", sans-serif;
  color: #fff;
}

#slider {
  width: 100%;
  //height: 100vh;
  position: relative;
}

.slide {
  width: 100%;
  //height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  z-index: 10;
  cursor: pointer;
  border: 3px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  position: absolute;
  top: calc(50% - 35px);
  left: 1%;
  transition: transform 0.3s ease-in-out;
  user-select: none;
}

.btn-next {
  left: auto;
  right: 1%;
}

.btn:hover {
  transform: scale(1.1);
}

</style>