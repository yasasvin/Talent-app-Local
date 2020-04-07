/* Language section */
import React from 'react';
import PropTypes from 'prop-types';
import { EditableTable } from '../Table/EditableTable.jsx';
import { SingleInput } from '../Form/SingleInput.jsx';
import { Grid, Dropdown, Button } from 'semantic-ui-react';

const languageLevels = [
    { key: "Basic", value: "Basic", text: "Basic" },
    { key: "Conversational", value: "Conversational", text: "Conversational" },
    { key: "Fluent", value: "Fluent", text: "Fluent" },
    { key: "Native/Bilingual", value: "Native/Bilingual", text: "Native/Bilingual" }
]

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.getAddComponent = this.getAddComponent.bind(this);
        this.getEditComponent = this.getEditComponent.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    getAddComponent(handleAdd, handleCancel, languages) {
        return <EditLanguage
            languages={languages}
            handleConfirm={handleAdd}
            handleCancel={handleCancel}
            />
    };

    getEditComponent(data, handleUpdate, handleCancel, languages) {
        return <EditLanguage
            language={data}
            languages={languages}
            handleConfirm={handleUpdate}
            handleCancel={handleCancel}
            />;
    };

    handleAdd(data) {
        var newLanguages = [...this.props.languages, data];
        this.props.updateProfileData({ languages: newLanguages });
    };

    handleDelete(index, data) {
        var newLanguages = this.props.languages.filter(value => value.id != data.id);
        this.props.updateProfileData({ languages: newLanguages });
    };

    handleUpdate(index, data) {
        var newLanguages = [...this.props.languages];
        newLanguages[index] = data;
        this.props.updateProfileData({ languages: newLanguages });
    };

    render() {
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <EditableTable
                        fieldNames={[{ name: "Language", key:"name", width: 5 }, { name: "Level", key:"level", width: 7 }]}
                        rowData={this.props.languages}
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

Language.propTypes = {
    languages: PropTypes.arrayOf(function (propValue, key, componentName, location, propFullName) {
        if (typeof propValue[key].id !== "string") return new Error(`Invalid prop '${propFullName}.id' supplied to '${componentName}' . Validation failed.`);
        if (typeof propValue[key].name !== "string") return new Error(`Invalid prop '${propFullName}.name' supplied to '${componentName}' . Validation failed.`);
        if (typeof propValue[key].level !== "string") return new Error(`Invalid prop '${propFullName}.level' supplied to '${componentName}' . Validation failed.`);
    }).isRequired,
    updateProfileData: PropTypes.func.isRequired
};

export class EditLanguage extends React.Component {
    constructor(props) {
        super(props);
        let language, isEdit, levelError;
        if (props.language) {
            language = Object.assign({}, props.language);
            isEdit = true;
            levelError = "";
        } else {
            language = { name: "", level: "" };
            isEdit = false;
            levelError = "level is required";
        }
        this.state = {
            isEdit: isEdit,
            newContact: language,
            formErrors: { name: "", level: levelError },
            formValid: isEdit
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleLeveChange = this.handleLeveChange.bind(this);
        this.setNewValue = this.setNewValue.bind(this);
        this.validateField = this.validateField.bind(this);
    };

    handleNameChange(event) {
        this.setNewValue({ [event.target.name]: event.target.value });
    };

    handleLeveChange(event, { name, value }) {
        this.setNewValue({ [name]: value });
    };

    setNewValue(data) {
        Object.keys(data).forEach(name => {
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
            newContact: Object.assign({}, this.state.newContact, data),
            formErrors: formErrors,
            formValid: formValid
        });
    };

    validateField(fieldName, value) {
        let formErrors = this.state.formErrors;
        let fieldValid;
        switch (fieldName) {
            case 'name':
                fieldValid = value !== "";
                formErrors.name = fieldValid ? '' : 'name is required';
                if (fieldValid && this.props.languages)
                {
                    this.props.languages.map((data, index) => {
                        if (data.name == value
                            && (this.state.newContact.id == undefined || this.state.newContact.id != data.id))
                        {
                            fieldValid = false;
                            formErrors.name = `Can't save a language which you already have.`;
                        }
                    })
                }
                break;
            case "level":
                fieldValid = value !== "";
                formErrors.level = fieldValid ? '' : 'level is required';
            default:
                break;
        }
    };

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <SingleInput
                            isError={this.state.formErrors.name!=""}
                            inputType="text"
                            placeholder="Enter language name"
                            name="name"
                            content={this.state.newContact.name}
                            controlFunc={this.handleNameChange}
                            errorMessage={this.state.formErrors.name}
                        />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Dropdown
                            fluid
                            selection
                            name="level"
                            search={true}
                            options={languageLevels}
                            onChange={this.handleLeveChange}
                            value={this.state.newContact.level}
                            placeholder="Select language level"
                            onFocus={e => { e.target.setAttribute("autocomplete", "nope"); }}
                        />
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Button
                            type='reset'
                            basic={this.state.isEdit ? true : false}
                            compact
                            color={this.state.isEdit ? "blue" : "teal"}
                            disabled={!this.state.formValid}
                            onClick={e => {
                                this.props.handleConfirm(this.state.newContact);
                            }}
                        >
                            {this.state.isEdit ? "Update" : "Add"}
                        </Button>
                        <Button
                            type='reset'
                            basic={this.state.isEdit ? true : false}
                            compact
                            color={this.state.isEdit ? "red" : null}
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

EditLanguage.propTypes = {
    language: PropTypes.exact({
        id: PropTypes.string,
        name: PropTypes.string,
        level: PropTypes.string,
        currentUserId: PropTypes.string
    }),

    handleConfirm: PropTypes.func.isRequired,   // (data:"Object")
    handleCancel: PropTypes.func.isRequired,    // ()
};