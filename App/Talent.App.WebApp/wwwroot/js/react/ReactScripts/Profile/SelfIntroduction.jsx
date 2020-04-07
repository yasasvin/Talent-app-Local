/* Self introduction section */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, TextArea, Button } from 'semantic-ui-react';
import { CharactersRemaining } from '../Form/SingleInput.jsx';

export default class SelfIntroduction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: props.summary ? props.summary:"",
            description: props.description ? props.description:"",
            formValid: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.setNewValue = this.setNewValue.bind(this);
        this.handleSave = this.handleSave.bind(this);
    };

    handleChange(e, { name, value }) {
        this.setNewValue({ [name]: value });
    }

    componentWillReceiveProps(nextProps) {
        this.setNewValue({
            summary: nextProps.summary,
            description: nextProps.description
        });
    };

    setNewValue(data) {
        let newState = Object.assign({}, this.state, data);
        let formValid = true;
        Object.keys(newState).forEach(name => {
            switch (name) {
                case "summary":
                    if (!newState[name]
                        || !newState[name].length
                        || newState[name].length > 150) {
                        formValid = false;
                    }
                    break;
                case "description":
                    if (!newState[name]
                        || newState[name].length < 150
                        || newState[name].length > 600) {
                        formValid = false;
                    }
                    break;
                default:
                    break;
            }
        });
        newState.formValid = formValid;
        this.setState(newState);
    }

    handleSave() {
        this.props.updateProfileData({
            summary: this.state.summary,
            description: this.state.description
        });
    };

    render() {
        let contactChanged = false;
        Object.keys(this.state).forEach(name => {
            switch (name) {
                case "summary":
                case "description":
                    if (this.state[name] != this.props[name]) contactChanged = true;
                    break;
                default:
                    break;
            }
        });
        let submittable = this.state.formValid && contactChanged;
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <div className="field">
                        <Input
                            fluid
                            name="summary"
                            value={this.state.summary}
                            placeholder='Please provide a short summary about yourself'
                            onChange={this.handleChange}
                        />
                        <CharactersRemaining
                            characters={this.state.summary}
                            description='Summary must be no more than 150 characters.'
                            minLength={0}
                            maxLength={150}
                        />
                    </div>
                    <div className="field">
                        <TextArea
                            name="description"
                            value={this.state.description}
                            placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add."
                            onChange={this.handleChange}
                            rows={8} 
                        />
                        <CharactersRemaining
                            characters={this.state.description}
                            description='Description must be between 150-600 characters.'
                            minLength={150}
                            maxLength={600}
                        />
                    </div>
                    <Button
                        type='reset'
                        color='teal'
                        disabled={!submittable}
                        floated='right'
                        onClick={this.handleSave}>
                        Save
                    </Button>
                </Grid.Column>
            </Grid.Row>
        )
    }
}

SelfIntroduction.propTypes = {
    summary: PropTypes.string,
    description: PropTypes.string,
    updateProfileData: PropTypes.func.isRequired
};


