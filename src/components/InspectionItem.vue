<template>
    <div class="clickable container" @click="expandContentButton">
        <span class="flexbox">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="imgicon"
                :class="{ rotated180: expanded }" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
            <span>
                {{ formattedDate }}
            </span>
            <span>

            </span>

        </span>
        <div v-if="expanded" class="details">
            Note: {{ inspection.note }}
            <!-- Inspection expanded description details blah blah -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'InspectionItem',
    data() {
        return {
            expanded: false,
        }
    },
    methods: {
        expandContentButton() {
            this.expanded = !this.expanded;
        },
        customFormat(ms) {
            return (Date(ms))
        },
    },
    props: {
        inspection: Object,
    },
    computed: {
        formattedDate() {
            const date = new Date(this.inspection.date);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            };
            return date.toLocaleDateString('en-US', options);
        },
    },
}
</script>

<style scoped>
.container {
    background-color: rgb(248, 248, 254);
    padding: 10px;
    margin: 0;
    flex: 1;
    border-radius: 8px;
    color: black;

}


.imgicon {
    fill: black;
    height: 1vw;
    /* stroke: rgb(190, 190, 190); */
    transition: all 0.15s ease 0s;
}

.flexbox {
    display: flex;
    justify-content: flex-start;
    gap: 6px;
}

.details {
    padding: 12px;
    margin: 4px 0px;
    border-radius: 5px;

    justify-content: center;
    background-color: white;
}
</style>