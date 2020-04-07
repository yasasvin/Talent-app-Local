import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

export const Select = (props) => (
    <select
        name={props.name}
        value={props.selectedOption}
        onChange={props.controlFunc}>
        <option value="">{props.placeholder}</option>
        {props.options.map(opt => {
            return (
                <option
                    key={opt.value}
                    value={opt.value}>{opt.title}</option>
            );
        })}
    </select>
);

Select.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    selectedOption: PropTypes.string,
    controlFunc: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

export class ChildSelect extends React.Component {
    render() {
        return (
            <div className="field">
                <label>{this.props.name}</label>
                <Dropdown
                    fluid
                    selection
                    search={true}
                    options={this.props.options}
                    onChange={this.props.handleChange}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onFocus={e => { e.target.setAttribute("autocomplete", "nope"); }}
                />
            </div>
        )
    }
}

ChildSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string
};