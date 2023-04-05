<template>
    <div class="clickable title" @click="expandContentButton">
        <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="clickable imgicon"
                :class="{ rotated180: expanded }" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
            Measurements
        </h2>

    </div>

    <div v-if="expanded" class="measurements-content">
        Measurements measurements measurementsmeasurements measurements Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Ea corporis
        voluptatem explicabo aliquid rerum, eligendi placeat voluptate reprehenderit magni eos recusandae, facilis rem
        ipsam fugiat animi nihil dolor unde corrupti?
    </div>
</template>


<script>
export default {
    name: 'Measurements',
    data() {
        return {
            expanded: false,
        }
    },
    methods: {
        expandContentButton() {
            this.expanded = !this.expanded;
        }
    }
}
</script>

<style scoped>
.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: all 0.15s ease 0s;
}
</style>