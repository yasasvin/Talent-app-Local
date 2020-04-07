/* Experience section */
import React from 'react';
import PropTypes from 'prop-types';
import { EditableTable } from '../Table/EditableTable.jsx';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { ChildDatePicker } from '../Form/DatePicker.jsx';
import { Grid, Button } from 'semantic-ui-react';
import moment from 'moment';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.getAddComponent = this.getAddComponent.bind(this);
        this.getEditComponent = this.getEditComponent.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    };

    getAddComponent(handleAdd, handleCancel) {
        return <EditExperience
            handleConfirm={handleAdd}
            handleCancel={handleCancel}
        />
    };

    getEditComponent(data, handleUpdate, handleCancel) {
        return <EditExperience
            contact={data}
            handleConfirm={handleUpdate}
            handleCancel={handleCancel}
        />;
    };

    handleAdd(data) {
        var newExperience = [...this.props.experience, data];
        this.props.updateProfileData({ experience: newExperience });
    };

    handleDelete(index, data) {
        var newExperience = this.props.experience.filter(value => value.id != data.id);
        this.props.updateProfileData({ experience: newExperience });
    };

    handleUpdate(index, data) {
        var newExperience = [...this.props.experience];
        newExperience[index] = data;
        this.props.updateProfileData({ experience: newExperience });
    };
    
    render() {
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <EditableTable
                        fieldNames={[
                            { name: "Company", key: "company", width: 2 },
                            { name: "Position", key: "position", width: 3 },
                            { name: "Responsibilities", key: "responsibilities", width: 3 },
                            { name: "Start", key: "start", width: 3, type: "date", dateFormat:"Do MMM, YYYY" },
                            { name: "End", key: "end", width: 3, type: "date", dateFormat: "Do MMM, YYYY" }
                        ]}
                        rowData={this.props.experience}
                        getAddComponent={this.getAddComponent}
                        getEditComponent={this.getEditComponent}
                        handleAdd={this.handleAdd}
                        handleDelete={this.handleDelete}
                        handleUpdate={this.handleUpdate}
                    />
                </Grid.Column>
            </Grid.Row>
        )
    }
}

export class EditExperience extends React.Component {
    constructor(props) {
        super(props);
        let newContact, isEdit;
        if (props.contact) {
            newContact = Object.assign({}, props.contact);
            newContact.start = moment(newContact.start);
            newContact.end = moment(newContact.end);
            isEdit = true;
        } else {
            newContact =
            {
                company: "",
                position: "",
                responsibilities: "",
                start: moment(),
                end: moment()
            };
            isEdit = false;
        }
        this.state = {
            isEdit: isEdit,
            newContact: newContact,
            formErrors:
            {
                company: "",
                position: "",
                responsibilities: "",
                start: "",
                end: ""
            },
            formValid: isEdit
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.setNewValue = this.setNewValue.bind(this);
        this.validateField = this.validateField.bind(this);
    };

    handleInputChange(event) {
        this.setNewValue({ [event.target.name]: event.target.value });
    };

    handleDateChange(name, date) {
        this.setNewValue({ [name]: date });
    };

    setNewValue(data) {
        var newContact = Object.assign({}, this.state.newContact, data);
        Object.keys(newContact).forEach(name => {
            this.validateField(name, data[name]);
        })

        let formErrors = this.state.formErrors;
        let formValid = true;
        Object.keys(formErrors).forEach(field => {
            if (formErrors[field] !== '') {
                formValid = false;
            }
        });
        
        this.setState({
            newContact: newContact,
            formErrors: formErrors,
            formValid: formValid
        });
    };

    validateField(fieldName, value) {
        let formErrors = this.state.formErrors;
        let fieldValid;
        switch (fieldName) {
            case 'company':
                fieldValid = value !== "";
                formErrors.company = fieldValid ? '' : 'company is required';
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <ChildSingleInput
                            inputType="text"
                            label="Company:"
                            name="company"
                            placeholder="Company"
                            value={this.state.newContact.company}
                            isError={this.state.formErrors.company !== ""}
                            errorMessage={this.state.formErrors.company}
                            controlFunc={this.handleInputChange}
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <ChildSingleInput
                            inputType="text"
                            label="Position:"
                            name="position"
                            placeholder="Position"
                            value={this.state.newContact.position}
                            isError={this.state.formErrors.position !== ""}
                            errorMessage={this.state.formErrors.position}
                            controlFunc={this.handleInputChange}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <ChildDatePicker
                            name="start"
                            label="Start Date:"
                            handleChange={this.handleDateChange}
                            dateFormat="DD/MM/YYYY"
                            date={this.state.newContact.start}
                            maxDate={this.state.newContact.end}
                            error={this.state.formErrors.start}
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <ChildDatePicker
                            name="end"
                            label="End Date:"
                            handleChange={this.handleDateChange}
                            dateFormat="DD/MM/YYYY"
                            date={this.state.newContact.end}
                            minDate={this.state.newContact.start}
                            maxDate={moment()}
                            error={this.state.formErrors.end}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ChildSingleInput
                            inputType="text"
                            label="Responsibilities:"
                            name="responsibilities"
                            placeholder="Responsibilities"
                            value={this.state.newContact.responsibilities}
                            isError={this.state.formErrors.responsibilities !== ""}
                            errorMessage={this.state.formErrors.responsibilities}
                            controlFunc={this.handleInputChange}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Button
                            type='reset'
                            compact
                            color='teal'
                            disabled={!this.state.formValid}
                            onClick={e => {
                                this.props.handleConfirm(this.state.newContact);
                            }}
                        >
                            {this.state.isEdit ? "Update" : "Add"}
                        </Button>
                        <Button
                            type='reset'
                            compact
                            onClick={e => {
                                this.props.handleCancel()
                            }}
                        >
                            Cancel
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
