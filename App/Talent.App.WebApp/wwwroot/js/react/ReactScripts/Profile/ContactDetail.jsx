import React, { Component } from "react";
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Location } from '../Employer/CreateJob/Location.jsx';
export class IndividualDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            }

        this.state = {
            showEditSection: false,
            newContact: details
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.setNewValue = this.setNewValue.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    openEdit() {
        const details = Object.assign({}, this.props.details)
        this.setState({
            showEditSection: true,
            newContact: details,
            formErrors: {
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            },
            formValid: true
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value;
        this.setState({
            newContact: data
        })
        this.setNewValue({ [event.target.name]: event.target.value });
    }

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
            case 'firstName':
                fieldValid = value != "";
                formErrors.firstName = fieldValid ? '' : 'FirstName is required';
                break;
            case "email":
                fieldValid = /^[a-z]{1}.*@.*/i.test(value);
                formErrors.email = fieldValid ? '' : 'Email is invalid';
                break;
            case "phone":
                fieldValid = /^\+{0,1}\d+/.test(value);
                formErrors.phone = fieldValid ? '' : 'Phone is invalid';
                break;
            default:
                break;
        }
    };

    saveContact() {
        //console.log(this.props.componentId)
        console.log(this.state.newContact)
        const data = Object.assign({}, this.state.newContact)
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="First Name"
                    name="firstName"
                    value={this.state.newContact.firstName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your first name"
                    isError={this.state.formErrors.firstName != ""}
                    errorMessage={this.state.formErrors.firstName}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Last Name"
                    name="lastName"
                    value={this.state.newContact.lastName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    isError={this.state.formErrors.lastName != ""}
                    errorMessage={this.state.formErrors.lastName}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    isError={this.state.formErrors.email != ""}
                    errorMessage={this.state.formErrors.email}
                />

                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    isError={this.state.formErrors.phone != ""}
                    errorMessage={this.state.formErrors.phone}
                />

                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        let fullName, email, phone;
        if (this.props.details) {
            if (this.props.details.firstName) fullName = this.props.details.firstName;
            if (this.props.details.lastName) fullName = fullName ? `${fullName} ${this.props.details.lastName}` : this.props.details.lastName;
            email = this.props.details.email ? this.props.details.email : "";
            phone = this.props.details.phone ? this.props.details.phone : "";
        } else {
            fullName = "";
            email = "";
            phone = "";
        }

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {fullName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}


export class CompanyDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                name: "",
                email: "",
                phone: ""
            }

        this.state = {
            showEditSection: false,
            newContact: details
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const details = Object.assign({}, this.props.details)
        this.setState({
            showEditSection: true,
            newContact: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value
        this.setState({
            newContact: data
        })
    }

    saveContact() {
        const data = Object.assign({}, this.state.newContact)
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        let location = { city: '', country: '' }
        if (this.state.newContact && this.state.newContact.location) {
            location = this.state.newContact.location
        }

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Name"
                    name="name"
                    value={this.state.newContact.name}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    errorMessage="Please enter a valid name"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                />

                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number"
                />
                Location:
                <Location location={location} handleChange={this.handleChange} />
                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let companyName = this.props.details ? this.props.details.name : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""
        let location = {city:'',country:''}
        if (this.props.details && this.props.details.location) {
            location = this.props.details.location
        }

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {companyName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                        <p> Location: {location.city}, {location.country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}
