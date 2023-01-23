const labels = {
    subscribes: {
        ru: {
            default: 'подписок',
            '1$': 'подписка',
            '[234]$': 'подписки',
            '1[0123]$': 'подписок',
        },
    },
    subscribers: {
        ru: {
            default: 'подписчиков',
            '1$': 'подписчик',
            '[234]$': 'подписчика',
            '1[0123]$': 'подписчиков',
        },
    },
}

export function getLabel(count, type, lang = 'ru') {
    let label = labels[type][lang].default
    for (let rule in labels[type][lang]) {
        let regex = new RegExp(rule)
        let res = String(count).match(regex)
        if (res) {
            label = labels[type][lang][rule]
        }
    }
    return count + ' ' + label
}
