<template>
    <div class="ww-webapp-autocomplete" :style="cssVariables" :class="{ editing: isEditing }">
        <input
            id="autocomplete-choice"
            ref="input"
            :list="datalistId"
            :value="label"
            :name="wwElementState.name"
            :placeholder="wwLang.getText(content.placeholder)"
            :required="content.required"
            @input="handleManualInput($event)"
            @blur="setMatchingLabel"
        />
        <datalist :id="datalistId">
            <option v-for="(option, index) in options" :key="index" :value="option.name"></option>
        </datalist>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
export default {
    props: {
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['update:content:effect', 'trigger-event'],
    setup(props) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            defaultValue: computed(() => (props.content.value === undefined ? '' : props.content.value)),
        });
        const options = computed(() => {
            if (!props.content.options) return [];
            let data = props.content.options;
            if (data && !Array.isArray(data) && typeof data === 'object') {
                data = new Array(data);
            } else if ((data && !Array.isArray(data)) || typeof data !== 'object') {
                return [];
            }

            return data
                .filter(item => !!item)
                .map(item => {
                    if (typeof item !== 'object') return { name: item, value: item };
                    const labelField = props.content.displayField || 'name';
                    const valueField = props.content.valueField || 'value';
                    return {
                        name: wwLib.wwLang.getText(wwLib.resolveObjectPropertyPath(item, labelField) || ''),
                        value: wwLib.resolveObjectPropertyPath(item, valueField),
                    };
                });
        });

        let label = '';
        return {
            variableValue,
            setValue,
            datalistId: `autocomplete-list-${wwLib.wwUtils.getUid()}`,
            label: ref(label),
            options,
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
        value() {
            return this.variableValue;
        },
        cssVariables() {
            return {
                '--input-color': this.content.color,
                '--input-fontFamily': this.content.fontFamily,
                '--input-fontSize': this.content.fontSize,
            };
        },
    },
    watch: {
        value: {
            immediate: true,
            handler: function () {
                this.setMatchingLabel();
            },
        },
        /* wwEditor:start */
        'wwEditorState.boundProps.options'(isBind) {
            if (!isBind) this.$emit('update:content:effect', { displayField: null, valueField: null });
        },
        /* wwEditor:end */
        'content.value'(newValue) {
            this.changeValue(newValue, 'initValueChange', 'value');
        },
    },
    methods: {
        handleManualInput(event) {
            const value = event.target.value;
            this.label = value;
            this.changeValue(value, 'change', 'name', event);
            if (this.delayedSearch) {
                clearTimeout(this.delayedSearch);
            }
            this.delayedSearch = setTimeout(() => {
                this.$emit('trigger-event', { name: 'search', event: { domEvent: event || {}, value } });
            }, 300);
        },
        changeValue(value, trigger, checkingProperty, event) {
            if (!this.options) return;

            if (value === '' && this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: trigger, event: { domEvent: event || {}, value: '' } });
                return;
            }

            const match = this.options.find(item => {
                if (checkingProperty === 'name') {
                    return `${item.name}`.toLowerCase() === `${value}`.toLowerCase();
                } else {
                    return item.value === value;
                }
            });

            if (match && match.value && match.value !== this.value) {
                this.setValue(match.value);
                this.label = match.name;
                this.$emit('trigger-event', { name: trigger, event: { domEvent: event || {}, value: match.value } });
            } else if (this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: trigger, event: { domEvent: event || {}, value: '' } });
            }
        },
        setMatchingLabel() {
            const match = this.options.find(item => item.value === this.variableValue);
            this.label = match ? match.name : '';
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-webapp-autocomplete {
    position: relative;
    /* wwEditor:start */
    &.editing::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
    }
    /* wwEditor:end */
    #autocomplete-choice {
        outline: none;
        border: none;
        background-color: inherit;
        font-family: var(--input-fontFamily);
        color: var(--input-color);
        font-size: var(--input-fontSize);
    }
}
</style>
