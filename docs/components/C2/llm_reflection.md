# LLM Reflection

A reflection is a short text used to control other components. Specifically,
this component generates reflections on the dialogue messages it receives and
on a list of values modeled as text and fixed in the component configuration.
In the future it will be possible to explore scenarios with value preferences 
that vary over time and depend on the interlocutor.

Modeling values as text is justified, for example in the social robots application,
for two reasons. First, in the social robots application the chosen scenario is
the home environment, where the values are often expressed in the form of rules,
such as "do not smoke in the house". Additionally, in this scenario the values
at play do not involve complex concepts, such as "justice" or "freedom", and
the consequences of the system behaviour are not critical, such as in the case
of a self-driving car. For this reason it is possible to avoid the complexity
of modeling values as rules in a strict reasoning system.

Second, the values are modeled as text because the component uses a large language
model to generate the reflections. If on one hand the home environment reduces
the stakes of the system behaviour, on the other hand it is a complex environment
where the system must be able to deal with a wide range of situations and complex,
unstructured interactions. Expressing values as text enables the system to understand
very complex situations and interactions, thanks to the underlying large language model.

The choice of using text to influence the system behaviour is a consequence of
the choice of using a large language model as the C1 dialogue manager. In the future,
it will be necessary to study the impact of this choice on the system behaviour,
and explore alternative approaches if necessary.
