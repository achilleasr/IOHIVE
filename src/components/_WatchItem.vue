<template>
    <div class="container">
        <div class="top-item" :class="{ small: small }">
            {{ title }}
        </div>

        <div class="bottom-item" :class="{ small: small }">
            <span v-html="renderedValue"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WatchItem',

    props: {
        title: String,
        val: Number,
        boolVal: Boolean,
        small: Boolean,
    },
    computed: {
        renderedValue() {
            if (this.title === "Needs Attention") {
                if (this.boolVal) {
                    return "Yes";
                }
                else {
                    return "No";
                }
            } else if (this.title === "Overall Impression") {
                switch (this.val) {
                    case 3:
                        return `<img src="${require('../assets/Hives/i_smiley.svg')}" style="width: 40%;"  />`;
                    case 2:
                        return 'medium'
                    case 0:
                        return 'sad'
                }

            } else if (this.title === "Queen") {
                return `<span><img src="${require('../assets/Hives/i_crown.svg')}" style="width: 40%; position: relative;"  /> <span style="background-color:white; color: green; padding: 3px; position: absolute; border-radius: 20px; aspect-ratio: 1;"> ` + this.val + ` </span></span> `
            } else {
                if (this.val) {
                    return this.val;
                }
                else { return 0; }
            }
        }
    }
}
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
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
}

.small {
    padding: 0px;
    font-size: 1.2vw;
}
</style>