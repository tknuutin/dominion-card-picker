
import * as Cards from './cards';
import * as R from 'ramda';


const { TYPES, TAGS } = Cards;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function popRandom(lst) {
    const index = rand(0, lst.length - 1);
    const item = lst[index];
    const tail = (index >= lst.length - 1) ? [] : lst.slice(index + 1, lst.length);
    const init = index < 1 ? [] : lst.slice(0, Math.max(0, index));
    return [item, init.concat(tail)];
}

const popRandomPredicate = ([selection, lst, n]) => (typeof n !== 'number') || n < 1;
const popRandomTransform = ([selection, lst, n]) => {
    const [newItem, rest] = popRandom(lst);
    return [
        selection.concat([newItem]),
        rest,
        n - 1,
    ];
};
const popRandomN = (lst, amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error('N is not a number');
    }
    const initialValue = [[], lst, amount];
    return R.until(
        popRandomPredicate,
        popRandomTransform,
        initialValue
    );
}

const isType = (card, type) => card.types.indexOf(type) > -1;

const removeCards = (toRemove, cards) =>
    R.filter(
        (card) => {
            const found = !R.find(
                ({ name }) => {
                    return name === card.name;
                },
                toRemove
            );
            return found;
        },
        cards
    );

const getAttacks = (opts) => {
    const [min, max] = opts.attacks;
    if (max === 0) {
        return [];
    }
    const amount = min === max ? max : rand(min, max);
    const allAttacks = R.filter((card) => isType(card, TYPES.ATTACK), Cards.CARDS);
    const [selection, rest] = popRandomN(allAttacks, amount);
    console.log('selected', amount, R.map(R.prop('name'), selection).join(', '))
    return selection;
};

export const pickCards = (opts) => {
    const attacks = getAttacks(opts);
    const currentlySelected = attacks;
    const remainingChoices = removeCards(currentlySelected, Cards.CARDS);
    const remainingAmount = opts.cardAmount - attacks.length;

    

    const [randomlySelected, notSelected] = popRandomN(remainingChoices, remainingAmount);

    const allSelectedCards = attacks
        .concat(randomlySelected);

    return R.sortBy(
        R.prop('price'),
        allSelectedCards
    );
}