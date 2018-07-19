
import * as R from 'ramda';

export const TYPES = {
    ACTION: 0,
    ATTACK: 1,
    POINT: 2,
    MONEY: 3,
    CURSE: 4,
    SHELTER: 5,
    RUINS: 6,
    REACTION: 7,
};

export const printTypes = (types) => {
    const inverted = R.invertObj(TYPES);
    return R.map((typeNum) => inverted[typeNum], types).join(', ');
};

export const TAGS = {
    VILLAGE: 0,

};

const EXPANSIONS = {
    'Perus': {
        'Takomo': {
            types: [TYPES.ACTION],
            price: 4,
        },
        'Laboratorio': {
            types: [TYPES.ACTION],
            price: 5,
        },
        'Kappeli': {
            types: [TYPES.ACTION],
            price: 2,
        },
        'Kellari': {
            types: [TYPES.ACTION],
            price: 2,
        },
        'Kylä': {
            types: [TYPES.ACTION],
            price: 3,
            tags: [TAGS.VILLAGE]
        },
        'Noita': {
            types: [TYPES.ACTION, TYPES.ATTACK],
            price: 5
        },
        'Nostoväki': {
            types: [TYPES.ACTION, TYPES.ATTACK],
            price: 4
        },
        'Metsuri': {
            types: [TYPES.ACTION],
            price: 3
        },
        'Raatihuone': {
            types: [TYPES.ACTION],
            price: 5
        },
        'Vallihauta': {
            types: [TYPES.ACTION, TYPES.REACTION],
            price: 2
        },
    },
    'Hovin juonet': {
        'Apuri': {
            types: [TYPES.ACTION],
            price: 2
        },
        'Kiduttaja': {
            types: [TYPES.ACTION, TYPES.ATTACK],
            price: 5,
        },
        'Naamiaiset': {
            types: [TYPES.ACTION],
            price: 3,
        },
        'Suuri sali': {
            types: [TYPES.ACTION, TYPES.POINT],
            price: 3,
        },
        'Silta': {
            types: [TYPES.ACTION],
            price: 4,
        },
        'Toivomuskaivo': {
            types: [TYPES.ACTION],
            price: 3,
        },
        'Paroni': {
            types: [TYPES.ACTION],
            price: 4
        },
        'Huijari': {
            types: [TYPES.ACTION, TYPES.ATTACK],
            price: 3
        },
        'Rautapaja': {
            types: [TYPES.ACTION],
            price: 4
        },
    },
    'Nousukausi': {
        'Sinetti': {
            types: [TYPES.MONEY],
            price: 5,
        },
        'Kuninkaan hovi': {
            types: [TYPES.ACTION],
            price: 7,
        },
        'Kaupunki': {
            types: [TYPES.ACTION],
            price: 5,
            tags: [TAGS.VILLAGE]
        },
        'Monumentti': {
            types: [TYPES.ACTION],
            price: 4,
        },
        'Rahvas': {
            types: [TYPES.ACTION, TYPES.ATTACK],
            price: 5,
        },
        'Suurtori': {
            types: [TYPES.ACTION],
            price: 6
        },
        'Ahjo': {
            types: [TYPES.ACTION],
            price: 7,
        },
        'Työläiskylä': {
            types: [TYPES.ACTION],
            price: 4,
            tags: [TAGS.VILLAGE]
        },
        'Laina': {
            types: [TYPES.MONEY],
            price: 3,
        },
        'Kauppareitti': {
            types: [TYPES.ACTION],
            price: 3,
        }
    }
}

export const CARDS = R.chain(([exp, cards]) => {
    return R.map(([name, def]) => {
        return R.merge(def, { name, exp });
    }, R.toPairs(cards));
}, R.toPairs(EXPANSIONS));

export const CARDS_BY_NAME = R.zipObj(R.map(R.prop('name'), CARDS), CARDS);

export const getCard = (name) =>
    CARDS_BY_NAME[name];



