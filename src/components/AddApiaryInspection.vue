<template>
    <button class="apiary-inspection-btn" @click="open = true" :disabled="!hives || hives.length === 0">
        <svg class="plus-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        Inspect all hives
    </button>

    <teleport to="body">
        <div v-if="open" class="overlay" @click.self="open = false">
            <div class="modal-card" @click.stop>
                <div class="modal-header">
                    <div>
                        <h2>Apiary Inspection</h2>
                        <p class="subtitle">Record one inspection across multiple hives. Uncheck any you want to skip.
                        </p>
                    </div>
                    <button class="close-btn" @click="open = false">×</button>
                </div>
                <InspectionForm :hives="hives" @saved="open = false" @cancel="open = false" />
            </div>
        </div>
    </teleport>
</template>

<script>
import InspectionForm from './InspectionForm.vue';

export default {
    name: 'AddApiaryInspection',
    components: { InspectionForm },
    props: {
        hives: { type: Array, default: () => [] },
    },
    data() {
        return { open: false };
    },
};
</script>

<style scoped>
.apiary-inspection-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #575EAE;
    border: none;
    border-radius: 100px;
    color: white;
    padding: 9px 20px;
    font-family: TwCen, sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    box-shadow: 0 2px 6px #575eae40;
}

.apiary-inspection-btn:hover:not(:disabled) {
    background: #3e4379;
    transform: translateY(-1px);
}

.apiary-inspection-btn:disabled {
    background: #b5b8d4;
    cursor: not-allowed;
}

.plus-icon {
    width: 16px;
    height: 16px;
    fill: white;
    flex-shrink: 0;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.18s ease-out;
}

.modal-card {
    background: white;
    color: #333;
    border-radius: 20px;
    padding: 28px 36px 24px;
    width: 620px;
    max-width: 94vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    font-family: TwCen, sans-serif;
    animation: slideUp 0.22s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 16px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.4rem;
    color: #333;
}

.subtitle {
    margin: 4px 0 0;
    font-size: 0.85rem;
    color: #888;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    line-height: 1;
    cursor: pointer;
    color: #999;
    padding: 0 8px;
    flex-shrink: 0;
}

.close-btn:hover {
    color: #333;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>