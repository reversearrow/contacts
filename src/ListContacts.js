import React,{Component} from 'react';
import PropTypes from 'prop-types';
import SortBy from 'sort-by'
import escapeRegexp from 'escape-string-regexp'
import * as ContactsAPI from './utils/ContactsAPI.js'

class ListContacts extends React.Component{
  state = {
    query: '',
    contacts: []
  }

  removeContact = (contact) => {
    this.setState((state) => ({
      contacts: state.contacts.filter((c) => c.id !== contact.id)
    }))
    ContactsAPI.remove(contact)
  }

  componentDidMount() {
    ContactsAPI.getAll().then((contacts) =>
      this.setState({contacts})
    )
  }

  updateQuery = (query) => {
    this.setState({query: query.trim()
    })
  }

  clearQuery = () => {
    this.setState({query: ''})
  }

  filterContacts = () => {
    let showingContacts
    if(this.state.query){
      const match = new RegExp(escapeRegexp(this.state.query),'i')
      showingContacts = this.state.contacts.filter(
        (contact) => match.test(contact.name)
      )
    }else{
      showingContacts = this.state.contacts
    }
    return showingContacts.sort(SortBy('name'))
  }

  render() {
    const contacts = this.filterContacts()
    return(
      <div className="list-contacts">
        <div className="list-contacts-top">
          <input className="search-contacts"
            type="text"
            placeholder="Search Contacts"
            value = {this.state.query}
            onChange = {(event)=>this.updateQuery(event.target.value)}
          />
        </div>
        {contacts.length !== this.state.contacts.length &&
          (
              <div className="showing-contacts">
              <span>Showing {contacts.length} out of {this.state.contacts.length} total.</span>
              <button onClick={this.clearQuery}>Show All</button>
              </div>
          )}
        <ol className="contact-list">
          {contacts.map(
            (contact) => (
              <li className='contact-list-item' key={contact.id}>
               <div className='contact-avatar' style={{
                 backgroundImage: `url(${contact.avatarURL})`
                }}/>
                     <div className='contact-details'>
                          <p>{contact.name}</p>
                          <p>{contact.email}</p>
                     </div>
                     <button onClick={() => this.removeContact(contact)} className='contact-remove'>
                          Remove
                     </button>
                     </li>
                            )
                          )
                        }
                    </ol>
                    </div>
                  )
                }
}


export default ListContacts
