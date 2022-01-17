<template>
    <div class="ww-webapp-autocomplete" :styles="cssVariables">
        <input
            id="autocomplete-choice"
            ref="input"
            :list="datalistId"
            :value="label"
            :class="{ editing: isEditing }"
            :name="wwElementState.name"
            :placeholder="wwLang.getText(content.placeholder)"
            @input="handleManualInput($event.target.value)"
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
    emits: ['update:content:effect', 'trigger-event', 'update:sidepanel-content'],
    setup(props) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable(
            props.uid,
            'value',
            props.content.value === undefined ? '' : props.content.value
        );
        const options = computed(() => {
            if (!props.content.options) return;
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
                    return {
                        name: wwLib.wwLang.getText(item[props.content.displayField || 'name'] || ''),
                        value: item[props.content.valueField || 'value'],
                    };
                });
        });

        let label = '';
        if (variableValue) {
            const match = options.value.find(item => {
                return item.value === variableValue.value;
            });
            if (match) label = match.name;
        }
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
            return `${this.variableValue}`;
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
        /* wwEditor:start */
        'content.options': {
            immediate: true,
            handler(options) {
                const objectOptions = (options || []).filter(option => option && typeof option === 'object');
                if (objectOptions[0]) {
                    this.$emit('update:sidepanel-content', {
                        path: 'itemsProperties',
                        value: Object.keys(objectOptions[0]),
                    });
                } else {
                    this.$emit('update:sidepanel-content', { path: 'itemsProperties', value: [] });
                }
            },
        },
        'wwEditorState.sidepanelContent.itemsProperties'(newProperties, oldProperties) {
            if (_.isEqual(newProperties, oldProperties)) return;
            if (this.wwEditorState.boundProps.options && newProperties && newProperties[0]) {
                this.$emit('update:content:effect', { displayField: newProperties[0], valueField: newProperties[0] });
            } else {
                this.$emit('update:content:effect', { displayField: null, valueField: null });
            }
        },
        'wwEditorState.boundProps.options'(isBind) {
            if (!isBind) this.$emit('update:content:effect', { displayField: null, valueField: null });
        },
        /* wwEditor:end */
        'content.value'(newValue) {
            this.changeValue(newValue, 'initValueChange', 'value');
        },
    },
    methods: {
        handleManualInput(value) {
            this.label = value;
            this.changeValue(value, 'change', 'name');
        },
        changeValue(value, trigger, checkingProperty) {
            if (!this.options) return;

            if (value === '' && this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: trigger, event: { value: '' } });
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
                this.$emit('trigger-event', { name: trigger, event: { value: match.value } });
            } else if (this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: trigger, event: { value: '' } });
            }
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
