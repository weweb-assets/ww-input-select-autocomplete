export default {
    editor: {
        label: {
            en: 'Autocomplete select',
            fr: 'Autocomplete select',
        },
        icon: 'search',
    },
    triggerEvents: [
        { name: 'change', label: { en: 'On change' }, event: { value: '' }, default: true },
        { name: 'search', label: { en: 'On search' }, event: { value: '' } },
        { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
    ],
    properties: {
        color: {
            label: { en: 'Color', fr: 'Couleur' },
            type: 'Color',
            defaultValue: 'black',
        },
        fontFamily: {
            type: 'FontFamily',
            label: { en: 'Font family', fr: 'Font' },
            defaultValue: '',
        },
        fontSize: {
            type: 'Length',
            label: { en: 'Font size', fr: 'Taille du texte' },
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 10, max: 50 },
                    { value: 'em', label: 'em', min: 1, max: 50 },
                    { value: 'rem', label: 'rem', min: 1, max: 50 },
                ],
            },
            defaultValue: '15px',
        },
        options: {
            label: { en: 'Options', fr: 'Options' },
            type: 'Info',
            options: {
                text: 'Bind options list',
            },
            bindable: true,
            defaultValue: [],
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'array',
                tooltip:
                    'A collection of data in array format: \n\n `[{}, {}, ...] || ["string1", "string2", ...] || [1, 2, ...]`',
            },
            /* wwEditor:end */
        },
        displayField: {
            hidden: (content, sidepanelContent, boundProps) =>
                !boundProps.options || !content.options || (content.options && typeof content.options[0] !== 'object'),
            label: {
                en: 'Display field',
                fr: 'Display field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: null,
            section: 'settings',
        },
        valueField: {
            hidden: (content, sidepanelContent, boundProps) =>
                !boundProps.options || !content.options || (content.options && typeof content.options[0] !== 'object'),
            label: {
                en: 'Value field',
                fr: 'Value field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: null,
            section: 'settings',
        },
        value: {
            label: {
                en: 'Init value',
            },
            type: 'Text',
            section: 'settings',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A string that defines if the input initial value: `"value"`',
            },
            /* wwEditor:end */
        },
        placeholder: {
            label: { en: 'Placeholder', fr: 'Placeholder' },
            type: 'Text',
            options: { placeholder: 'Type text' },
            multiLang: true,
            section: 'settings',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A string that defines if the input placeholder: `"placeholder"`',
            },
            /* wwEditor:end */
        },
        required: {
            label: 'Required',
            type: 'OnOff',
            section: 'settings',
            defaultValue: true,
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the input is required: `true | false`',
            },
            /* wwEditor:end */
        },
        itemsProperties: {
            editorOnly: true,
            hidden: true,
            defaultValue: [],
        },
    },
};
