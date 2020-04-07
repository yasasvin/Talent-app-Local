import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

export class ChildDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: this.props.date };
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(date) {
        this.setState({ date: date });
        this.props.handleChange(this.props.name, date);
    };

    render() {
        let label = this.props.label ? <label>{this.props.label}</label> : null;
        return (
            <div className={`field ${this.props.error != "" ? 'error' : ''} `}>
                {label}
                <DatePicker
                    dateFormat={this.props.dateFormat}
                    selected={this.state.date}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    onChange={this.handleChange}
                />
                {this.props.error != "" ? <div className="ui basic red pointing prompt label transition visible">{this.props.error}</div> : null}
            </div>
        )
    }
}

ChildDatePicker.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    dateFormat: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(moment).isRequired,
    minDate: PropTypes.instanceOf(moment),
    maxDate: PropTypes.instanceOf(moment),
    error: PropTypes.string.isRequired
}