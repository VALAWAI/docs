# LLM dialogue manager

A dialogue manager is the core component of conversational systems. It facilitates
coherent and meaningful interactions between the dialogue participants.
The main responsibility of a dialogue manager is selecting the most appropriate
response to an input, in order to maintain the flow of the conversation.
To achieve this objective there are many techniques such as rule-based systems,
state machines, and reinforcement learning. This component uses a large language
model fine-tuned for this purpose.

In addition, dialogue managers can use various information sources to decide which
is the most appropriate response, such as the dialogue history, the user profile,
and the context of the conversation.
What sets this component apart from other dialogue managers is that it can accept
additional input, called **reflections**, to steer the conversation.
These reflections are used together with the current conversation history and
the last input to select the most appropriate response.

The component can be customised with the identifier for the character impersonated
by the dialogue manager.