import React from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { ChildSelect } from '../Form/Select.jsx';
import { Grid, Button } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const allVisaStatus = [
    { value: "Citizen", text: "Citizen"},
    { value: "Permanent Resident", text: "Permanent Resident"},
    { value: "Work Visa", text: "Work Visa" },
    { value: "Student Visa", text: "Student Visa" }
]
const needExpiryDateStatus =
{
    "Citizen":false,
    "Permanent Resident":false,
    "Work Visa":true,
    "Student Visa":true
}

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visaExpiryDate: props.visaExpiryDate ? moment(props.visaExpiryDate) : null
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    componentWillReceiveProps(nextProps)
    {
        if (nextProps.visaExpiryDate !== this.props.visaExpiryDate) {
            this.setState({
                visaExpiryDate: nextProps.visaExpiryDate ? moment(nextProps.visaExpiryDate) : null
            });
        }
    };

    handleDateChange(date) {
        this.setState({ visaExpiryDate: date });
    };

    handleChange(e, { value }) {
        if (value != this.props.visaStatus) {
            this.props.saveProfileData({ visaStatus: value });
        }
    };

    render() {
        let editExpiryDate = null;
        if (needExpiryDateStatus[this.props.visaStatus]) {
            editExpiryDate = <Grid.Column width={11}>
                <div className="field">
                    <label>Visa Expiry Date</label>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <DatePicker
                                    dateFormat="DD/MM/YYYY"
                                    selected={this.state.visaExpiryDate}
                                    minDate={moment()}
                                    onChange={this.handleDateChange}
                                    placeholderText="Select expiry date"
                                />
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Button
                                    disabled={
                                        !this.state.visaExpiryDate ||
                                        this.state.visaExpiryDate.isSame(this.props.visaExpiryDate)
                                    }
                                    type='reset'
                                    color='teal'
                                    onClick={() => {
                                        this.props.saveProfileData({ visaExpiryDate: this.state.visaExpiryDate });
                                    }}
                                >
                                    Save
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Grid.Column>
        }

        return (
            <Grid.Row>
                <Grid.Column width={5}>
                    <ChildSelect
                        name="Visa type"
                        options={allVisaStatus}
                        handleChange={this.handleChange}
                        value={this.props.visaStatus}
                        placeholder="Select your visa status"
                    />
                </Grid.Column>
                {editExpiryDate}
            </Grid.Row>
        )
    }
}

VisaStatus.propTypes = {
    visaExpiryDate: PropTypes.string,
    visaStatus: PropTypes.string,
    saveProfileData: PropTypes.func.isRequired
};