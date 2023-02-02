export enum LabelsType {
    subscribes,
    subscribers,
}

export enum LabelsLanguage {
    ru,
}

type LabelsDictionary = {
    [type in LabelsType]: {
        [language in LabelsLanguage]: {
            [key: string]: string
        }
    }
}

const labels: LabelsDictionary = {
    [LabelsType.subscribes]: {
        [LabelsLanguage.ru]: {
            default: 'подписок',
            '1$': 'подписка',
            '[234]$': 'подписки',
            '1[0123]$': 'подписок',
        },
    },
    [LabelsType.subscribers]: {
        [LabelsLanguage.ru]: {
            default: 'подписчиков',
            '1$': 'подписчик',
            '[234]$': 'подписчика',
            '1[0123]$': 'подписчиков',
        },
    },
}

export function getLabel(count: number, type: LabelsType, lang = LabelsLanguage.ru): string {
    let label: string = labels[type][lang].default
    for (let rule in labels[type][lang]) {
        let regex = new RegExp(rule)
        let res = String(count).match(regex)
        if (res) {
            label = labels[type][lang][rule]
        }
    }
    return count + ' ' + label
}
