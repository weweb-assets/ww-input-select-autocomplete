<template>
    <div class="ww-webapp-autocomplete" :styles="cssVariables">
        <input
            id="autocomplete-choice"
            ref="input"
            list="autocomplete-list"
            name="autocomplete-choice"
            :placeholder="wwLang.getText(content.placeholder)"
            @input="handleChange"
        />

        <datalist id="autocomplete-list">
            <option v-for="(item, index) in options" :key="index" :value="getLabel(item)"></option>
        </datalist>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
        content: { type: Object, required: true },
    },
    emits: ['update:content:effect', 'trigger-event'],
    setup(props) {
        const internalVariableId = computed(() => props.content.variable);
        const variableId = wwLib.wwVariable.useComponentVariable(props.uid, 'value', '', internalVariableId);

        return { variableId };
    },
    data() {
        return {
            internalValue: '',
        };
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        value: {
            get() {
                if (this.variableId) return wwLib.wwVariable.getValue(this.variableId);
                return this.internalValue || '';
            },
            set(value) {
                this.$emit('trigger-event', { name: 'change', event: { value } });
                this.internalValue = value;
                if (this.variableId) wwLib.wwVariable.updateValue(this.variableId, value);
            },
        },
        cssVariables() {
            return {
                '--input-color': this.content.color,
                '--input-fontFamily': this.content.fontFamily,
                '--input-fontSize': this.content.fontSize,
            };
        },
        options() {
            let data;
            if (this.content.collection) {
                const collection = wwLib.wwCollection.getCollection(this.content.collection);
                if (collection && collection.data && collection.data.results) {
                    data = collection.data.results.filter(item => !!item);
                }
            } else data = [];

            return data;
        },
    },
    watch: {
        options(data) {
            if (data && data[0]) this.$emit('update:content:effect', { itemsProperties: Object.keys(data[0]) });
        },
        value(value) {
            this.$refs.input.value = value;
        },
        /* wwEditor:start */
        'content.initialValue'(value) {
            this.value = value;
        },
        /* wwEditor:end */
    },
    mounted() {
        if (this.content.initialValue) this.value = this.content.initialValue;
        this.$refs.input.value = this.value;
    },
    methods: {
        getLabel(item) {
            if (this.content.displayBy === 'none') return '';
            if (item[this.content.displayBy]) return item[this.content.displayBy];
            return '';
        },
        handleChange(event) {
            if (!this.options) return;
            const value = event.target.value.toLowerCase();
            const match = this.options.filter(item => item[this.content.displayBy].toLowerCase() === value)[0];
            if (match) this.value = match[this.content.displayBy];
            else if (value === '') this.value = '';
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-webapp-autocomplete {
    #autocomplete-choice {
        outline: none;
        width: inherit;
        height: inherit;
        border: none;
        background-color: inherit;
        font-family: var(--input-fontFamily);
        color: var(--input-color);
        font-size: var(--input-fontSize);

        /* wwEditor:start */
        &.editing {
            pointer-events: none;
        }
        /* wwEditor:end */
    }
}
</style>
