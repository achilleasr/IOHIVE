<template>
    <button class="add-inspection-btn" @click="open = true">+ Add Inspection</button>

    <teleport to="body">
        <div v-if="open" class="overlay" @click.self="open = false">
            <div class="modal-card" @click.stop>
                <div class="modal-header">
                    <h2>New Inspection — {{ hive.name }}</h2>
                    <button class="close-btn" @click="open = false">×</button>
                </div>
                <InspectionForm :hive="hive" @saved="open = false" @cancel="open = false" />
            </div>
        </div>
    </teleport>
</template>

<script>
import InspectionForm from './InspectionForm.vue';

export default {
    name: 'AddInspection',
    components: { InspectionForm },
    props: {
        hive: { type: Object, required: true },
    },
    data() {
        return { open: false };
    },
};
</script>

<style scoped>
.add-inspection-btn {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 100px;
    color: white;
    padding: 5px 14px;
    font-family: TwCen, sans-serif;
    font-size: 0.9vw;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}

.add-inspection-btn:hover {
    background: rgba(255, 255, 255, 0.15);
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
    width: 560px;
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
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    line-height: 1;
    cursor: pointer;
    color: #999;
    padding: 0 8px;
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