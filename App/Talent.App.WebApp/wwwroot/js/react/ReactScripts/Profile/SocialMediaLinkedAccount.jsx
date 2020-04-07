/* Social media JSX */
import React from 'react';
import PropTypes from 'prop-types';
import { SingleInput } from '../Form/SingleInput.jsx';
import { Button, Icon } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        const linkedAccounts = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: ""
            };

        this.state = {
            showEditSection: false,
            newContact: linkedAccounts
        };
        this.saveContact = this.saveContact.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    saveContact() {
        this.props.saveProfileData({ linkedAccounts: this.state.newContact });
        this.setState({ showEditSection: false })
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        let formErrors = this.state.formErrors;
        let fieldValid;
        switch (name) {
            case 'linkedIn':
                fieldValid = value === "" ? true : value.match(/^https:\/\/www.linkedin.com\/*/i);
                formErrors.linkedIn = fieldValid ? '' : 'LinkedIn URL is invalid';
                break;
            case 'github':
                fieldValid = value === "" ? true : value.match(/^https:\/\/github.com\/*/i);
                formErrors.github = fieldValid ? '' : 'GitHub URL is invalid';
                break
            default:
                break;
        }

        let formValid = true;
        Object.keys(formErrors).forEach(field => {
            if (formErrors[field] != '') {
                formValid = false;
            }
        });

        this.setState({
            formErrors: formErrors,
            formValid: formValid,
            newContact: Object.assign({}, this.state.newContact, { [name]: value })
        });
    };

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    };

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <SingleInput
                    inputType="text"
                    title="LinkedIn"
                    name="linkedIn"
                    placeholder="Enter your LinkedIn URL"
                    content={this.state.newContact.linkedIn}
                    isError={this.state.formErrors.linkedIn !== ""}
                    errorMessage={this.state.formErrors.linkedIn}
                    controlFunc={this.handleChange}
                />
                <SingleInput
                    inputType="text"
                    title="GitHub"
                    name="github"
                    placeholder="Enter your GitHub URL"
                    content={this.state.newContact.github}
                    isError={this.state.formErrors.github !== ""}
                    errorMessage={this.state.formErrors.github}
                    controlFunc={this.handleChange}
                />
                
                <Button
                    type='button'
                    color='teal'
                    disabled={!this.state.formValid}
                    onClick={this.saveContact}
                >
                    Save
                </Button>
                <Button type='button' onClick={() => this.setState({ showEditSection: false })}>
                    Cancel
                </Button>
            </div>
        )
    };

    renderDisplay() {
        if (item != null) {

        return (
            <div className='ui sixteen wide column'>
                <Button
                    type='button'
                    color='linkedin'
                    disabled={this.props.linkedAccounts.linkedIn === ""}
                    onClick={e => window.open(this.props.linkedAccounts.linkedIn, "_blank")}
                >
                    <Icon name='linkedin' /> LinkedIn
                </Button>
                <Button
                    type='button'
                    color='black'
                    disabled={this.props.linkedAccounts.github === ""}
                    onClick={e => window.open(this.props.linkedAccounts.github, "_blank")}
                >
                    <Icon name='github'/> GitHub
                </Button>
                <Button type='reset' color='teal' floated='right' onClick={e => {
                    this.setState({
                        showEditSection: true,
                        newContact: Object.assign({}, this.props.linkedAccounts),
                        formErrors: { linkedIn: '', github: '' },
                        formValid: true
                    })
                }}>
                    Edit
                </Button>
            </div>
        )
        }
        else {
            return (<View></View>);
        }
    };

}

SocialMediaLinkedAccount.propTypes = {
    linkedAccounts: PropTypes.exact({
        linkedIn: PropTypes.string,
        github: PropTypes.string
    }).isRequired,
    saveProfileData: PropTypes.func
};