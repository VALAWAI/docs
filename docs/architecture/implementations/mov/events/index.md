---
sidebar_position: 1
---

# RabbitMQ Events

The Master Of VALAWAI (MOV) uses **RabbitMQ** as a message broker to facilitate communication
 between the components of the VALAWAI Application. The structure and details of these messages 
 are defined in the
[asyncapi.yml](https://raw.githubusercontent.com/VALAWAI/MOV/ASYNCAPI_1.2.0/asyncapi.yml) file.

The MOV provides the following functionalities related to these events:

## Component Management

* [Register a Component](/docs/architecture/implementations/mov/events/register_component): 
A component sends this message to the MOV to announce that it is ready to receive messages.
* [Unregister a Component](/docs/architecture/implementations/mov/events/unregister_component): 
A component sends this message to the MOV when it is stopping, indicating that it is no longer 
available to receive messages.
* [Query About Components](/docs/architecture/implementations/mov/events/component_query): 
These events are used to request information about the currently registered components.


## Connection Management

* [Create Topology Connection](/docs/architecture/implementations/mov/events/create_connection): 
This event is used to create a new connection between two components within the VALAWAI 
application's topology.
* [Modify Topology Connection](/docs/architecture/implementations/mov/events/modify_connection): 
This event allows for the modification of a topology connection, such as enabling, disabling, 
or deleting it.
* [Query About Connections](/docs/architecture/implementations/mov/events/connection_query): 
This event is used to obtain information about the existing topology connections.


## Notifications

* [Notify Component is Registered](/docs/architecture/implementations/mov/events/registered_notification): 
The MOV uses this message to inform a component that its registration has been successfully 
processed.
* [Notify C2 Components](/docs/architecture/implementations/mov/events/notify_c2_components): 
This message is used to notify a C2 component that a message has been sent through 
a specific connection.

## Other Events

* [Add Log](/docs/architecture/implementations/mov/events/add_log): 
This event is used to send a log message to the MOV.
