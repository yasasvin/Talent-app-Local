import React from 'react'
import PropTypes from 'prop-types';
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { ChildSelect } from '../Form/Select.jsx';
import { Grid, Button, Dropdown } from 'semantic-ui-react';


export const getCountries = () => {
    let countries = [];
    Object.keys(Countries).map((key, index) => {
        countries.push({ key: key, value: key, text: key });
    });
    return countries;
};

export class Address extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditSection: false
        };
        this.setNewValue = this.setNewValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.saveContact = this.saveContact.bind(this);
    };

    getCities(country) {
        if (!Array.isArray(Countries[country])) return [];
        let cities = [];
        Countries[country].map(value => {
            cities.push({ key: value, value: value, text: value });
        });
        return cities;
    };

    handleCountryChange(e, { value }) {
        this.setNewValue({ country: value, city:"" });
    };

    handleCityChange(e, { value }) {
        this.setNewValue({ city: value });
    };

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;
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
            case 'postCode':
                fieldValid = value === "" ? true : (/^\d*$/i).test(value);
                formErrors.postCode = fieldValid ? '' : 'PostCode is invalid';
                break;
            default:
                break;
        }
    };

    saveContact(e) {
        this.props.saveProfileData({ address: this.state.newContact });
        this.setState({ showEditSection: false });
    };

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    };

    renderEdit() {
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <ChildSingleInput
                                    inputType="text"
                                    label="Number"
                                    name="number"
                                    placeholder="Street number"
                                    value={this.state.newContact.number}
                                    isError={this.state.formErrors.number !== ""}
                                    errorMessage={this.state.formErrors.number}
                                    controlFunc={this.handleInputChange}
                                />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <ChildSingleInput
                                    inputType="text"
                                    label="Street"
                                    name="street"
                                    placeholder="Street name"
                                    value={this.state.newContact.street}
                                    isError={this.state.formErrors.street !== ""}
                                    errorMessage={this.state.formErrors.street}
                                    controlFunc={this.handleInputChange}
                                />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <ChildSingleInput
                                    inputType="text"
                                    label="Suburb"
                                    name="suburb"
                                    placeholder="Suburb"
                                    value={this.state.newContact.suburb}
                                    isError={this.state.formErrors.suburb !== ""}
                                    errorMessage={this.state.formErrors.suburb}
                                    controlFunc={this.handleInputChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <ChildSelect
                                    name="Country"
                                    options={getCountries()}
                                    handleChange={this.handleCountryChange}
                                    value={this.state.newContact.country}
                                    placeholder="Country"
                                />
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <ChildSelect
                                    name="City"
                                    options={this.getCities(this.state.newContact.country)}
                                    handleChange={this.handleCityChange}
                                    value={this.state.newContact.city}
                                    placeholder="City"
                                />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <ChildSingleInput
                                    inputType="text"
                                    label="Post Code"
                                    name="postCode"
                                    placeholder="Post Code"
                                    value={this.state.newContact.postCode}
                                    isError={this.state.formErrors.postCode !== ""}
                                    errorMessage={this.state.formErrors.postCode}
                                    controlFunc={this.handleInputChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Button
                                    type='reset'
                                    color='teal'
                                    disabled={!this.state.formValid}
                                    onClick={this.saveContact}
                                >
                                    Save
                                </Button>
                                <Button type='reset' onClick={() => this.setState({ showEditSection: false }) }>
                                     Cancel
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid.Row>
        )
    };

    renderDisplay() {
        let address, city, country;
        if (this.props.address) {
            let data = this.props.address;
            address = "";
            if (data.number) address = address ? address + ", " + data.number : data.number;
            if (data.street) address = address ? address + ", " + data.street : data.street;
            if (data.suburb) address = address ? address + ", " + data.suburb : data.suburb;
            if (data.postCode) address = address ? address + ", " + data.postCode : data.postCode;
            city = this.props.address.city;
            country = this.props.address.country;
        } else {
            address = city = country = "";
        }
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <React.Fragment>
                        <p>Address: {address}</p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <Button type='reset' color='teal' floated='right' onClick={e => {
                        this.setState({
                            showEditSection: true,
                            newContact: Object.assign({}, this.props.address),
                            formErrors: {
                                number: "",
                                street: "",
                                suburb: "",
                                postCode: "",
                                city: "",
                                country: ""
                            },
                            formValid: true
                        })
                    }}>
                        Edit
                    </Button>
                </Grid.Column>
            </Grid.Row>
        )
    };
}

Address.propTypes = {
    address: PropTypes.exact({
        number: PropTypes.string,
        street: PropTypes.string,
        suburb: PropTypes.string,
        postCode: PropTypes.number,
        city: PropTypes.string,
        country: PropTypes.string
    }).isRequired,
    saveProfileData: PropTypes.func
};

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e, { value }) {
        this.props.saveProfileData({ nationality: value });
    };

    render() {
        return (
            <Grid.Row>
                <Grid.Column width={8}>
                    <Dropdown
                        fluid
                        selection
                        search={true}
                        options={getCountries()}
                        onChange={this.handleChange}
                        value={this.props.nationality}
                        placeholder="Select your nationality"
                        onFocus={e => { e.target.setAttribute("autocomplete", "nope"); }}
                    />
                </Grid.Column>
            </Grid.Row>
        )
    };
}

Nationality.propTypes = {
    nationality: PropTypes.string,
    saveProfileData: PropTypes.func
};