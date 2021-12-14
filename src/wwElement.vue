<template>
    <div class="ww-webapp-autocomplete" :styles="cssVariables">
        dev : {{ isObjectsCollection }}
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
        uid: { type: String, required: true },
    },
    emits: ['update:content:effect', 'trigger-event', 'update:sidepanel-content'],
    setup(props) {
        const internalVariableId = computed(() => props.content.variableId);
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
        isCollectionId() {
            return typeof this.content.collection === 'string';
        },
        isObjectsCollection() {
            if (this.options && this.options[0]) {
                const itemType = typeof this.options[0];
                if (itemType === 'object') return true;
            }

            return false;
        },
        options() {
            if (this.content.collection) {
                if (this.isCollectionId) {
                    const collection = wwLib.wwCollection.getCollection(this.content.collection);
                    if (collection && collection.data && collection.data.results) {
                        return collection.data.results.filter(item => !!item);
                    }
                } else {
                    return this.content.collection;
                }
            }

            return [];
        },
    },
    watch: {
        options(data) {
            if (data && data[0]) {
                if (this.content.collection) {
                    this.$emit('update:content:effect', { itemsProperties: Object.keys(data[0]) });
                }
            }
        },
        value(value) {
            this.$refs.input.value = value;
        },
        /* wwEditor:start */
        'content.initialValue'(value) {
            if (value !== undefined && !this.content.variableId) {
                this.value = value;
            }
        },
        isObjectsCollection: {
            handler(value) {
                this.$emit('update:sidepanel-content', { path: 'isObjectsCollection', value });
            },
            imediate: true,
        },
        /* wwEditor:end */
    },
    mounted() {
        if (this.content.initialValue !== undefined && !this.content.variableId) {
            this.value = this.content.initialValue;
        }
        this.$refs.input.value = this.value;
    },
    methods: {
        getLabel(item) {
            if (!this.isObjectsCollection && !this.isCollectionId) return item;
            if (this.content.displayBy === 'none') return '';
            if (item[this.content.displayBy]) return item[this.content.displayBy];
            return '';
        },
        handleChange(event) {
            if (!this.options) return;
            const value = event.target.value.toLowerCase();

            let match;
            if (this.isObjectsCollection) {
                match = this.options.filter(item => item[this.content.displayBy].toLowerCase() === value)[0];
            } else {
                match = this.options.filter(item => item.toLowerCase() === value)[0];
            }

            if (match) this.value = this.isObjectsCollection ? match[this.content.displayBy] : match;
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
