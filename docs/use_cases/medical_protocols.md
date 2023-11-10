---
sidebar_position: 3
---

# Medical Protocols

One of the objectives of the medical protocols' use case is to raise the awareness of medical
professionals with respect to the values being promoted/demoted when making decisions. 
In what follows, we describe one sample scenario of this use case and how we envision building
it using the VALAWAI architecture.


## Main aim

Develop a tool that connects with / complements Hospital del Mar's NIT system
(Therapeutic Intensity Level) to provide medical professionals with feedback on the actions
they are considering taking. 


## Users

Medical professionals using the existing NIT system.


## Description

The NIT system was developed at Hospital del Mar, Barcelona, to help patients and medical
professionals choose together the best intervention level at the end of a patient's life,
giving the patient a say on this issue. Each NIT level has a number of norms built within it,
like prohibiting or permitting some actions (such as moving the patient to an ICU unit or not,
applying CPR or not). But then there are many more actions that a medical professional may choose
to apply when at a certain level. Our tool will take into consideration the 4 fixed basic values
(justice, autonomy, beneficial, non-maleficent), in addition to other patient values (like privacy)
and other organisational values (like cost-effectiveness), and it will evaluate that action with
respect to those values. The medical professional will then know which values their action upholds
or breaks, and to what degree. This, in summary, raises value awareness in the medical professional's
decision-making process.


## User input

The user (medical professional) provides a set of potential actions that they are considering performing.


## Output

The system suggests which actions are recommended and which are not and why,
considering their alignment with NIT norms and relevant values.
