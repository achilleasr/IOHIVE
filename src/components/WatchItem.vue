<template>
    <div class="container">
        <div class="top-item">
            {{ title }}
        </div>

        <div class="bottom-item">
            {{ val }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'WatchItem',
    props: {
        title: String,
        val: Number,
    }
}
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    background-color: aqua;
    /* justify-content: space-around;
    align-items: space-around; */
    text-align: center;
    height: 100%;
}

.top-item {
    flex: 1;
    margin: auto;
    padding: 10px;

    font-size: 1.5vw;
}

.bottom-item {
    flex: 1;
    margin: auto;
    padding: 10px;
    font-size: 3vw;
    background-color: rgb(72, 255, 0);
}
</style>