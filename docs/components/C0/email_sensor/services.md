---
sidebar_position: 2
---

# Services

The Email Sensor (C0) offers core services that enable it to integrate with and 
contribute to the VALAWAI infrastructure. You can find a full, detailed description 
of these services in the component's [AsyncAPI specification](https://raw.githubusercontent.com/VALAWAI/C0_email_sensor/main/asyncapi.yaml),
which is available directly within the [source code of this component](https://github.com/VALAWAI/C0_email_sensor).

Below, we'll describe the primary services this component provides.

## Publish e-mail

As a sensor, the Email Sensor's main purpose is to capture information from the real 
world and seamlessly propagate it throughout the VALAWAI infrastructure. It achieves 
this by fetching emails from a user's account, parsing their content, and then publishing 
the extracted data.

This information is published to the channel `valawai/c0/email_sensor/data/e_mail`. The messages 
sent to this channel are in JSON format and include the following fields:

 -`address`: An array of objects describing the sender and recipients. Each object specifies 
 the type (e.g., `FROM`, `TO`, `CC`, or `BCC`), the name of the user (if available), and their 
 address (email address).
 - `subject`: The subject line of the email.
 - `mime_type`: Describes how the email's content is encoded (e.g., text/plain, text/html).
 - `content`: The actual body of the email.
 - `received_at`: The epoch time in seconds when the email was received by the server.

Here's an example of the JSON data model published to the channel:

```jsx
{
  "address": [
    {
      "type": "FROM",
      "name": "Jane doe",
      "address": "jane.doe@valawai.eu"
    },
    {
      "type": "TO",
      "address": "info@valawai.eu"
    }
  ],
  "subject": "How to publish a component?",
  "mime_type": "text/plain",
  "content": "Hi! Could you please inform me about the necessary steps to have a component available in the VALAWAI?",
  "received_at": 1715342664
}
```

## Change component parameters

The Email Sensor, like other sensors, has parameters that control how it interacts 
with its environment. One key parameter you can modify is the fetching interval, 
which dictates how often the component checks for new, unread emails to process.

To adjust this interval, you need to send a message to the channel 
`valawai/c0/email_sensor/control/change_parameters`. The message payload must be in JSON format 
and contain the `fetching_interval` value in seconds.

For example, to set the interval for checking new emails to every 5 minutes (300 seconds), 
you would send the following JSON payload:

```jsx
{
  "fetching_interval": 300
}
```
