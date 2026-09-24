<template>
    <div v-if="control !== 'hidden'" class="field" :class="{ 'field-inline': inlineControl }">
        <label class="field-label">
            {{ label(item) }}
            <button v-if="item.description || item.source" type="button" class="info-btn" @click="showInfo = !showInfo"
                aria-label="More info">i</button>
        </label>

        <p v-if="showInfo && (item.description || item.source)" class="field-info">
            <span v-if="item.description">{{ item.description }}</span>
            <a v-if="item.source" :href="item.source" target="_blank" rel="noopener">{{ item.source }}</a>
        </p>

        <!-- Yes / No -->
        <div v-if="control === 'boolean'" class="choice-row">
            <button type="button"
                :class="['choice-btn', modelValue === 1 ? (item.input === 'boolean_yes_red' ? 'selected-danger' : 'selected') : '']"
                @click="emitVal(modelValue === 1 ? null : 1)" :disabled="disabled">Yes</button>
            <button type="button" :class="['choice-btn', modelValue === 0 ? 'selected' : '']"
                @click="emitVal(modelValue === 0 ? null : 0)" :disabled="disabled">No</button>
        </div>

        <!-- Smileys (1 bad / 2 ok / 3 good) -->
        <div v-else-if="control === 'smileys'" class="choice-row">
            <button v-for="opt in smileyOptions" :key="opt.value" type="button"
                :class="['choice-btn', modelValue === opt.value ? 'selected' : '']"
                @click="emitVal(modelValue === opt.value ? null : opt.value)" :disabled="disabled">{{ opt.label
                }}</button>
        </div>

        <!-- Star score 0..5 -->
        <div v-else-if="control === 'stars'" class="stars">
            <span v-for="n in 5" :key="n" :class="['star', (modelValue || 0) >= n ? 'on' : '']"
                @click="emitVal(modelValue === n ? null : n)">★</span>
        </div>

        <!-- Slider (grade / %, degrees) -->
        <div v-else-if="control === 'slider'" class="slider-wrap">
            <input type="range" :min="range.min" :max="range.max" :step="1"
                :value="modelValue == null ? range.min : modelValue" :disabled="disabled"
                @input="emitVal(Number($event.target.value))" />
            <span class="slider-val">{{ modelValue == null ? '—' : modelValue }}</span>
        </div>

        <!-- Numbers -->
        <input v-else-if="isNumber" type="number" :step="step" :value="modelValue" :disabled="disabled"
            :min="item.input === 'number_positive' ? 0 : undefined"
            :max="item.input === 'number_negative' ? 0 : undefined" placeholder="0"
            @input="emitVal($event.target.value === '' ? null : Number($event.target.value))" />

        <!-- Radio (options) — stores the selected child id; click again to clear -->
        <div v-else-if="control === 'radio'" class="radio-list">
            <label v-for="child in item.children" :key="child.id" class="radio-row">
                <input type="radio" :checked="modelValue === child.id" :disabled="disabled"
                    @click="emitVal(modelValue === child.id ? null : child.id)" />
                <span>{{ label(child) }}</span>
            </label>
        </div>

        <!-- Select (single-select dropdown) — stores the selected child id -->
        <select v-else-if="control === 'select'" class="select-input" :disabled="disabled"
            :value="modelValue == null ? '' : modelValue"
            @change="emitVal($event.target.value === '' ? null : Number($event.target.value))">
            <option value="">— Select —</option>
            <option v-for="child in item.children" :key="child.id" :value="child.id">{{ label(child) }}</option>
        </select>

        <!-- List (multi-select of list_item children, supports one level of nesting) -->
        <div v-else-if="control === 'checklist'" class="checkbox-list">
            <template v-for="child in item.children" :key="child.id">
                <label class="checkbox-row">
                    <input type="checkbox" :value="String(child.id)" :checked="isChecked(child.id)" :disabled="disabled"
                        @change="toggle(child.id)" />
                    <span>{{ label(child) }}</span>
                </label>
                <label v-for="nested in (child.children || [])" :key="nested.id" class="checkbox-row nested">
                    <input type="checkbox" :value="String(nested.id)" :checked="isChecked(nested.id)"
                        :disabled="disabled" @change="toggle(nested.id)" />
                    <span>{{ label(nested) }}</span>
                </label>
            </template>
        </div>

        <!-- Text -->
        <textarea v-else-if="control === 'text'" :value="modelValue || ''" rows="2" :disabled="disabled"
            :placeholder="label(item)" @input="emitVal($event.target.value)"></textarea>

        <!-- Date -->
        <input v-else-if="control === 'date'" type="date" :value="modelValue || ''" :disabled="disabled"
            @input="emitVal($event.target.value)" />

        <!-- Fallback -->
        <input v-else type="text" :value="modelValue || ''" :disabled="disabled"
            @input="emitVal($event.target.value)" />

        <!-- Nested follow-up inputs revealed when a boolean is Yes.
             These can themselves be booleans with their own children, so we pass
             the nested-values map and bubble every change up through update:nested. -->
        <div v-if="hasReveal && modelValue === 1" class="nested-reveal">
            <ChecklistField v-for="child in revealChildren" :key="child.id" :item="child"
                :model-value="nestedValues[child.id]" :nested-values="nestedValues" :disabled="disabled"
                @update:modelValue="$emit('update:nested', { id: child.id, value: $event })"
                @update:nested="$emit('update:nested', $event)" />
        </div>
    </div>
</template>

<script>
import { label, controlFor, stepFor, sliderRange } from './checklistUtils';

export default {
    name: 'ChecklistField',
    props: {
        item: { type: Object, required: true },
        modelValue: { default: null },
        disabled: { type: Boolean, default: false },
        // values for nested children revealed under a "Yes" boolean
        nestedValues: { type: Object, default: () => ({}) },
    },
    emits: ['update:modelValue', 'update:nested'],
    data() {
        return {
            showInfo: false,
            smileyOptions: [
                { value: 1, label: '😞 Bad' },
                { value: 2, label: '😐 Ok' },
                { value: 3, label: '😊 Good' },
            ],
        };
    },
    computed: {
        control() {
            return controlFor(this.item.input);
        },

        step() {
            return stepFor(this.control);
        },
        range() {
            return sliderRange(this.item.input);
        },
        isNumber() {
            return ['number', 'number1', 'number2', 'number3'].includes(this.control);
        },
        inlineControl() {
            return ['boolean', 'smileys', 'stars', 'slider'].includes(this.control);
        },
        hasReveal() {
            // A boolean/list_item with children shows follow-up questions when "Yes".
            return (
                (this.item.input === 'boolean' ||
                    this.item.input === 'boolean_yes_red' ||
                    this.item.input === 'list_item') &&
                this.revealChildren.length > 0
            );
        },
        revealChildren() {
            // Only real inputs are revealed; nested `label` headers carry their own
            // children, which we flatten up one level so they render as fields.
            const out = [];
            for (const c of this.item.children || []) {
                if (!c) continue;
                if (c.input === 'label' && Array.isArray(c.children)) {
                    out.push(...c.children.filter((g) => g && g.input && g.input !== 'label'));
                } else if (c.input) {
                    out.push(c);
                }
            }
            return out;
        },
        selectedIds() {
            if (!this.modelValue) return [];
            return String(this.modelValue).split(',').filter(Boolean);
        },
    },
    methods: {
        label,
        emitVal(v) {
            this.$emit('update:modelValue', v);
        },
        isChecked(id) {
            return this.selectedIds.includes(String(id));
        },
        toggle(id) {
            const set = new Set(this.selectedIds);
            const key = String(id);
            if (set.has(key)) set.delete(key);
            else set.add(key);
            const arr = [...set];
            this.emitVal(arr.length ? arr.join(',') : null);
        },
    },
};
</script>

<style scoped>
.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-inline {
    gap: 8px;
}

.field-label {
    font-size: 0.85rem;
    color: #666;
    font-family: TwCen, sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
}

.info-btn {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    background: #e3e4f3;
    color: #575EAE;
    font-size: 0.7rem;
    font-style: italic;
    line-height: 1;
    cursor: pointer;
    font-family: Georgia, serif;
}

.field-info {
    font-size: 0.78rem;
    color: #888;
    margin: 0;
    background: #f8f8fe;
    padding: 8px 10px;
    border-radius: 8px;
}

.field-info a {
    color: #575EAE;
    word-break: break-all;
}

.choice-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.choice-btn {
    padding: 5px 14px;
    border-radius: 100px;
    border: 2px solid #ddd;
    background: white;
    color: #555;
    font-family: TwCen, sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
}

.choice-btn.selected {
    border-color: #575EAE;
    background: #575EAE;
    color: white;
}

.choice-btn.selected-danger {
    border-color: #e46268;
    background: #e46268;
    color: white;
}

.choice-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.stars {
    display: flex;
    gap: 2px;
    font-size: 1.5rem;
    cursor: pointer;
}

.star {
    color: #ddd;
    transition: color 0.1s;
}

.star.on {
    color: #FABB13;
}

.slider-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.slider-wrap input[type="range"] {
    flex: 1;
    accent-color: #575EAE;
}

.slider-val {
    min-width: 2ch;
    text-align: right;
    font-size: 0.9rem;
    color: #575EAE;
    font-weight: bold;
}

input[type="number"],
input[type="date"],
input[type="text"],
textarea {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 7px 10px;
    font-family: TwCen, sans-serif;
    font-size: 0.95rem;
    background: #F9FAFE;
    color: #333;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #575EAE;
    box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
}

.radio-list,
.checkbox-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.select-input {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px 10px;
    font-family: TwCen, sans-serif;
    font-size: 0.95rem;
    background: #F9FAFE;
    color: #333;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
}

.select-input:focus {
    outline: none;
    border-color: #575EAE;
    box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
}

.radio-row,
.checkbox-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #444;
    cursor: pointer;
}

.checkbox-row.nested {
    margin-left: 22px;
    font-size: 0.85rem;
    color: #777;
}

.radio-row input,
.checkbox-row input {
    accent-color: #575EAE;
}

.nested-reveal {
    margin-top: 10px;
    margin-left: 12px;
    padding-left: 12px;
    border-left: 2px solid #ece;
    border-left-color: #e3e4f3;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>