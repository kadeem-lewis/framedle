<template>
  <div class="loader">
    <span />
    <span />
    <span />
  </div>
</template>
<style scoped>
.dark .loader {
  --border-color: white;
}

.loader {
  --loader-size: 20px;
  --border-size: 4px;
  --border-color: black;
  --animation-style: ease;
  --animation-time: 1.5s;

  position: relative;
  top: 40px;
  left: calc(50% - var(--loader-size) / 2);
  width: var(--loader-size);
  height: var(--loader-size);

  span:nth-child(2) {
    top: calc(50% - var(--loader-size) / 2);
    left: calc(50% - var(--loader-size) / 2);
    border: var(--border-size) solid var(--border-color);
    transform: rotate(45deg);
    animation: centerSpin var(--animation-time) infinite var(--animation-style);

    background-image: radial-gradient(
      circle,
      var(--border-color) 40%,
      transparent 45%
    );
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  span {
    display: inline-block;
    position: absolute;
    height: var(--loader-size);
    width: var(--loader-size);
  }

  span:first-child,
  span:last-child {
    top: 5px;
    height: 15px;
    width: 15px;
  }

  span:first-child {
    border-left: var(--border-size) solid var(--border-color);
    border-top: var(--border-size) solid var(--border-color);
    transform: rotate(-45deg);
    left: -15px;
    animation: leftMove calc(var(--animation-time) / 4) infinite
      var(--animation-style);
  }

  span:last-child {
    border-right: var(--border-size) solid var(--border-color);
    border-bottom: var(--border-size) solid var(--border-color);
    transform: rotate(-45deg);
    right: -23px;
    animation: rightMove calc(var(--animation-time) / 4) infinite
      var(--animation-style);
  }
}

@keyframes centerSpin {
  0% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(225deg);
  }
  50% {
    transform: rotate(315deg);
  }
  75% {
    transform: rotate(405deg);
  }
  100% {
    transform: rotate(495deg);
  }
}

@keyframes leftMove {
  0% {
    left: -15px;
  }
  50% {
    left: -25px;
  }
  100% {
    left: -15px;
  }
}

@keyframes rightMove {
  0% {
    right: -15px;
  }
  50% {
    right: -25px;
  }
  100% {
    right: -15px;
  }
}
</style>
