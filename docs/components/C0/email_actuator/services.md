---
sidebar_position: 2
---

# Services

The services of this component are described in the [asyncapi](https://raw.githubusercontent.com/VALAWAI/C0_email_actuator/main/asyncapi.yaml)
that you can find on the [source code of this component](https://github.com/VALAWAI/C0_email_actuator).


## Send e-mail

This component converts any message received on the channel **valawai/c0/email_actuator/data/e_mail**
into an email that will be sent to a server. This message has the next attributes:

 - **address** the information from which the message is, and to which the message is sent.
 Each is an object with the address type (TO, CC or BCC), the name of the user, and the e-mail address.
 - **subject** of the e-mail.
 - **is_html** is true if the content is HTML. Otherwise, the content is considered plain text.
 - **content** of the e-mail

The next JSON is an example of this data model.

```jsx
{
  "address": [
    {
      "type": "TO",
      "address": "info@valawai.eu"
    },
    {
      "type": "CC",
      "name": "Jane doe",
      "address": "jane.doe@valawai.eu"
    }
  ],
  "subject": "How to publish a component?",
  "is_html": false,
  "content": "Hi! Could you please inform me about the necessary steps to have a component available in the VALAWAI?"
}
```
