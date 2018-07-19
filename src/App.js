import React, { Component } from 'react';
import './App.css';
import { pickCards } from './picker';
import * as R from 'ramda';
import * as Cards from './cards';

// const renderNumberInput = (props) => (
//     <input type="number" {...props}/>
// )

// const renderers = {
//     'input': renderNumberInput,
// };

// const defineOption = (optValues, changeHandlers) => (opt) => {
//     const name = opt.name;
//     changeHandlers[name] = (event) => {
//         optValues[name] = parseInt(event.target.value, 10);
//     }
//     const innerRenderer = renderers[opt.type];
//     const renderer = () => {
//         const inputEl = innerRenderer({
//             name: name,
//             defaultValue: optValues[name],
//             onChange: changeHandlers[name]
//         });

//         return (
//             <div className="option-row" key={name}>
//                 <label>{opt.label}</label>
//                 {inputEl}
//             </div>
//         );
//     };

//     return {
//         ...opt,
//         render: renderer
//     };
// }

// const numberChangeHandler = () => {

// }

const LabelledOption = ({ label, children }) => (
    <div className="option-row" key={label}>
        <label>{label}</label>
        {children}
    </div>
);

const NumberInput = (props) => (
    <input type="number" {...props}/>
);

const getValue = (func) => (e) => func(e.target.value);
const getNumericValue = (func) => getValue((val) => func(parseInt(val, 10)));
const limitToZero = (f) => {
    return getNumericValue((val) => {
        if (val !== undefined && val > -1) {
            f(val);
        }
    });
}

const setObj = (objName) => (prop, inst, transform) => (val) => {
    inst[objName][prop] = transform ? transform(val) : val;
}
const setToState = setObj('state');
const setToOptValues = setObj('optValues');

class NumberRangeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minVal: props.min,
            maxVal: props.max,
        };

        const makeOnChange = (prop) =>
            limitToZero(
                R.pipe(
                    setToState(prop, this),
                    () => {
                        console.log('now', this.state)
                        this.props.onChange([this.state.minVal, this.state.maxVal]);
                    }
                )
            );

        this.onMinChange = makeOnChange('minVal');
        this.onMaxChange = makeOnChange('maxVal');
    }

    render() {
        return (
            <LabelledOption label={this.props.label}>
                <NumberInput defaultValue={this.props.min} onChange={this.onMinChange}/>
                <NumberInput defaultValue={this.props.max} onChange={this.onMaxChange}/>
            </LabelledOption>
        )
    }
}

class Options extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.optValues = {
            cardAmount: 10,
            attacks: [2, 2]
        };

        const setCardAmount = (val) => parseInt(val, 10);

        const setAttacks = setToOptValues('attacks', this);

        this.options = [
            (
                <LabelledOption key="1" label="Kortteja">
                    <NumberInput
                        defaultValue={10}
                        onChange={setToOptValues('cardAmount', this, setCardAmount)}
                    />
                </LabelledOption>
            ),
            (
                <NumberRangeInput
                    key="2"
                    label="Hyökkäyskortteja"
                    min={2}
                    max={2}
                    onChange={setAttacks}
                />
            )
        ];

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.cb(this.optValues);
    }

    render() {
        return (
            <form id="options" onSubmit={this.handleSubmit}>
                {this.options}
                <input type="submit"/>
            </form>
        );
    }
}
    

const renderSelected = (card) => {
    const { name, price, types } = card;
    return (
        <p key={name}>{name} ({price}) {Cards.printTypes(types)}</p>
    )
}

function validate(opts) {
    const [attacksMin, attacksMax] = opts.attacks;
    if (attacksMax < attacksMin) {
        return 'Incorrect attacks range'
    }
}

class App extends Component {

    constructor() {
        super();
        this.state = {
            selected: []
        }

        this.onOptionsChange = this.onOptionsChange.bind(this);
    }

    onOptionsChange(options) {
        const errMsg = validate(options);
        if (errMsg) {
            this.setState({ errMsg });
        } else {
            const picked = pickCards(options);
            this.setState({
                selected: picked, errMsg: undefined
            });    
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Dominion card picker</h1>
                </header>
                <Options cb={this.onOptionsChange}/>
                <h3>Selected:</h3>
                {R.map(renderSelected, this.state.selected)}
                <p>{(this.state.errMsg ? 'Error: ' + this.state.errMsg : '')}</p>
            </div>
        );
    }
}

export default App;
