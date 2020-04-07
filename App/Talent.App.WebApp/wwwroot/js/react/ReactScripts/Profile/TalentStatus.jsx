import React from 'react'
import PropTypes from 'prop-types';
import { Form, Grid, Radio } from 'semantic-ui-react';

const allTalentStatus = [
    "Actively looking for a job",
    "Not looking for a job at the moment",
    "Currently employed but open to offers",
    "Will be availiable on later date"
]

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e, { value }) {
        if (!this.props.jobSeekingStatus || this.props.jobSeekingStatus.status != value) {
            this.props.saveProfileData({ jobSeekingStatus: { status: value } });
        }
    };
    
    render() {
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Form.Field>
                        <b>Current Status</b>
                    </Form.Field>
                    {
                        allTalentStatus.map((item, index) => {
                            return <Form.Field key={index}>
                                <Radio
                                    label={item}
                                    key={index}
                                    value={item}
                                    checked={this.props.jobSeekingStatus ? this.props.jobSeekingStatus.status == item : false}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        })
                    }
                </Grid.Column>
            </Grid.Row>
        )
    }
}

TalentStatus.propTypes = {
    jobSeekingStatus: PropTypes.object,
    saveProfileData: PropTypes.func.isRequired
};