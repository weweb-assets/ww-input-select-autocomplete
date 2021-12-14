export default {
    editor: {
        label: {
            en: 'Autocomplete select',
            fr: 'Autocomplete select',
        },
        icon: 'fontawesome/solid/search',
    },
    triggerEvents: [{ name: 'change', label: { en: 'On change' }, event: { value: '' } }],
    properties: {
        placeholder: {
            label: { en: 'Placeholder', fr: 'Placeholder' },
            type: 'Text',
            options: { placeholder: 'Type text' },
            multiLang: true,
            section: 'settings',
        },
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
        collection: {
            label: {
                en: 'Select from (unpaginated collection)',
            },
            type: 'Collection',
            options: {
                paginated: false,
            },
            section: 'settings',
            bindable: true,
            defaultValue: null,
        },
        isObjectsCollection: {
            type: 'OnOff',
            editorOnly: true,
            hidden: true,
            defaultValue: true,
        },
        displayBy: {
            hidden: (content, sidepanelContent) => !content.collection || !sidepanelContent.isObjectsCollection,
            label: {
                en: 'Display by',
                fr: 'Display by',
            },
            type: 'TextSelect',
            options: content => {
                let data = [];

                if (typeof content.collection === 'string') {
                    const collection = wwLib.wwCollection.getCollection(content.collection);
                    if (collection && collection.data && collection.data.results) {
                        data = collection.data.results.filter(item => !!item);
                    }
                } else {
                    data = content.collection;
                }

                const options = content.itemsProperties
                    .map(item => {
                        return data &&
                            data[0] &&
                            (typeof data[0][item] === 'string' || typeof data[0][item] === 'number')
                            ? { value: item, label: { en: item } }
                            : null;
                    })
                    .filter(item => !!item);

                return {
                    options: [{ value: 'none', label: { en: 'Select a property' } }, ...options],
                };
            },
            defaultValue: 'none',
            section: 'settings',
        },
        variableId: {
            label: {
                en: 'Associated variable',
            },
            type: 'Variable',
            options: {
                type: ['String', 'Query', 'Number'],
            },
            section: 'settings',
            defaultValue: null,
        },
        initialValue: {
            label: {
                en: 'Initial value',
            },
            type: 'Text',
            section: 'settings',
            hidden: content => content.variableId,
            bindable: true,
            defaultValue: '',
        },
        itemsProperties: {
            hidden: true,
            defaultValue: [],
        },
    },
};
