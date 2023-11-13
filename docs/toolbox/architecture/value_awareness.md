---
sidebar_position: 2
---

# Value Awareness

To introduce value awareness into the GNW, we first need to understand what is awareness.
The term ‘aware’ is ambiguous, but it commonly has to do with explicitly realising,
perceiving or knowing something. For example, situation awareness (or situational awareness)
[[Endsley, 2011]](/references#10.5555/2208018) refers to a mental state where all the relevant
elements of a situation and the way they hang together are known and it becomes possible
to predict (or at least form sensible expectations about) what will happen next or what action
should be taken.

In VALAWAI, we are specifically interested in value-aware AI, and we define it as follows:

> “An AI system that is capable of capturing the relevant (human) value system,
> understanding that value system, abiding by it, and explaining its own behaviour
> and that of others in terms of that value system.”

To achieve value awareness, we argue that an AI should first and foremost have “value acquisition”
abilities for it to be able to capture the relevant value system reflecting the stakeholder’s
value preferences, which is usually context-dependent. For example, the values of equality
or fairness might have different meanings and different importance in various application domains.

Second, to allow an AI to understand value systems, “value representation and reasoning” is
required to allow the AI to formally reason about values, such as detecting value conflicts or
analysing the impact of adopting certain values.

Third, “value alignment” mechanisms will need to be developed to allow the AI to analyse
whether certain behaviour abides by preferred values or not.

Finally, for full transparency and for helping the human stakeholders become more aware of
the alignment of behaviour with respect to values, “explanation” mechanisms will need to be
developed to allow the AI to explain how one behaviour is aligned (or not) with a given value
system. This supports value-aligned decision making as well as the value-aligned design of AI
systems. A summary of what value-aware AI could achieve is listed below:

 1. Monitor compliance with values by a human or AI system, and possibly provide feedback
 or support a certification process.

 2. Deconstruct the values implicitly used by a human or AI system based on reported/observed
 behaviour, and possibly provide feedback for the human or AI system so they are aware of those values.

 3. Advise a course of action in a given situation to a human or AI system, compatible with a
 given value system.
 
 4. Autonomously perform actions compatible with a given value system.

Furthermore, the same way value-aware AI can be used to analyse and impact behaviour, it
can also be used to analyse and impact motivators of behaviour, such as norms. We choose to
focus on norms specifically since norms have traditionally and been used in multiagent systems
as means to coordinate behaviour and ensure it is respecting aspired properties. As such,
value-aware AI could also achieve the following:

 5. Analyse the alignment of norms with values, for example in order to provide feedback on
 norms or support a certification process for the norms.

 6. Deconstruct the values implicitly adhered to by norms.

 7. Advise on the norms to adopt in a given situation, compatible with a given value system.

 8. Autonomously select the norms compatible with a given value system.

Last, but not least, by making humans aware of their value systems, the impact of their value
systems on behaviour, the alignment of their actions and norms with these value systems,
as well as making them understand conflicting values, value-aware AI could also achieve the
following:
 
 9. Help a human decide on how to evolve its value system.
 
 10. Help humans collectively decide on their preferred/agreed upon value system.

Notice that deciding on value systems is a strictly human decision. An AI cannot make decisions
on a value system, but adopt the value system of its stakeholder(s).

We close this section by making the statement that the above four technical capabilities—value
acquisition, value representation and reasoning, value-alignment mechanisms, and value-based
explainability— provide the basis for developing value-aware AI. In what follows, we illustrate
how these capabilities may be introduced into the GNW