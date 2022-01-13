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
        return { variableValue, setValue, datalistId: `autocomplete-list-${wwLib.wwUtils.getUid()}` };
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
        options() {
            if (!this.content.options) return;
            let data = this.content.options;
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
                        name: wwLib.wwLang.getText(item[this.content.displayField || 'name'] || ''),
                        value: item[this.content.valueField || 'value'],
                    };
                });
        },
        label() {
            const match = this.options.find(item => {
                return item.value === this.value;
            });
            return match && match.name;
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
        'content.value'(newValue) {
            if (!this.options) return;
            const flatValue = `${newValue}`.toLowerCase();
            if (flatValue === '' && this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: 'initValueChange', event: { value: '' } });
                return;
            }

            const match = this.options.find(item => {
                const value = `${item.name}`.toLowerCase();
                return value === flatValue;
            });

            if (match && match.value && match.value !== this.value) {
                this.setValue(match.value);
                this.$emit('trigger-event', { name: 'initValueChange', event: { value: match.value } });
            } else if (this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: 'initValueChange', event: { value: '' } });
            }
        },
        /* wwEditor:end */
    },
    methods: {
        handleManualInput(value) {
            if (!this.options) return;
            const flatValue = `${value}`.toLowerCase();
            if (flatValue === '' && this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: 'change', event: { value: '' } });
                return;
            }

            const match = this.options.find(item => {
                const value = `${item.name}`.toLowerCase();
                return value === flatValue;
            });

            if (match && match.value && match.value !== this.value) {
                this.setValue(match.value);
                this.$emit('trigger-event', { name: 'change', event: { value: match.value } });
            } else if (this.value !== '') {
                this.setValue('');
                this.$emit('trigger-event', { name: 'change', event: { value: '' } });
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
