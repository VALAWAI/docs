---
sidebar_position: 3
---

# Master of VALAWAI

As we described previously in the 
[VALAWAI's value awareness architecture](/docs/toolbox/architecture/value_awareness_architecture.md)
the components that form the toolbox interact between them exchanging messages
with data or actions that they must do. In both cases, the path of a message
is predetermined by a dynamic topology. The piece of software that maintains
this topology is the Master Of VALAWAI (MOV). The image below shows how any 
component interacts with the MOV and vice-versa.

![The value compatibility calculator component](/img/toolbox/mov_schema.png)

This interaction is done by interchanging messages through a message broker,
such as [RabbitMQ](https://www.rabbitmq.com/). The MOV is responsible
for routing any messages between components to guarantee that they follow
the topology. To do so, the MOV subscribe to any channel where a component
can publish a message. When a message is published, it checks the topology
and decides that with channels of the other components, the same message
has to be published.  This approach allows the components to be independent
because they do not need to know anything about the other components that will
be used in the application. The only thing that a component has to do is register
itself. Thus when a component is activated it sends a message to the MOV 
information about its type, name, version and the asyncapi that describe the services
that it provides. The MOV validate this data and if it is correct creates automatically
all the possible connections of this component with the rest of the registered components.
To determine if a to create a topology connection between two components it checks that
the publish message schema of the source component matches the subscribe message
schema of the target component. If the new topology connection is between components
of different types, the MOV automatically enable it. Also, checks if it has to be notified
when the component will be registered and, if it is **C2** component, it 
checks if the component must be notified when a message is interchanged between
any defined connection.

Apart from the register component the MOV provides the next services:

- Search for information about all the registered components in the MOV.
- Unregister a component from the application. After the action, the component
will not be reachable by other components and any connection that it is involved
in will be disabled and removed from the topology.
- Create a topology connection between components. This service is only
provided for unexpected cases because the connection will be created
at the moment a component is registered. If you use this service, you must
guarantee that the message that is published by the source component is
compatible with the messages that the target component is subscribed to.
It also checks for the special channel to be notified when the component is registered,
and searches for any C2 component that will be notified when a message is interchanged
following this connection.
- Search for the defined topology connections and their status.
- Enable a topology connection. When the connection is enabled the MOV 
listen for all the messages that the source component publishes on the source
channel and it publishes on the subscribed channel of the target component.
- Disable a topology connection. In this case, the messages published by
the source component are not propagated to the target component.
- Remove a topology connection. So, the source component will not communicate
more to the target component using the source and target channels.
- Add a log message. The components that form the Value-Awarness application
are distributed so checking that all runs smoothly can be complicated. To help
the developers the MOV provide a user interface where they can see the log messages
that are reported using this service.

You can read more about these services and how to invoke them on the
[Master Of VALAWAI tutorial](/docs/tutorials/mov).