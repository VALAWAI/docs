---
sidebar_position: 2
---

# Value Awareness

To integrate value awareness into the GNW, we must first understand what awareness 
entails. The term "aware" is inherently ambiguous, but it generally relates to 
explicitly recognizing, perceiving, or knowing something.  For instance, situation 
awareness [[Endsley, 2011]](/references#endsley_2011) describes a mental state where 
all relevant elements of a situation and their interrelationships are understood, 
enabling prediction (or at least the formation of reasonable expectations) about 
future events or appropriate actions.

Within VALAWAI, we focus specifically on *value-aware* AI, which we define as:

> "An AI system that is capable of capturing the relevant (human) value system, 
> understanding that value system, abiding by it, and explaining its own behavior 
> and that of others in terms of that value system."

Achieving value awareness requires, we argue, four key technical capabilities:

1.  **Value Acquisition:** The AI must be able to capture the relevant value system, 
reflecting the stakeholder's value preferences, which are often context-dependent. 
For example, the values of equality or fairness can have different meanings and 
importance across various application domains.  This acquisition process may involve 
learning from data, explicit input from users, or a combination of both.

2.  **Value Representation and Reasoning:**  The AI needs to represent values in 
a formal and computationally tractable manner, enabling reasoning about them. This 
includes the ability to detect value conflicts, analyze the impact of adopting 
certain values, and perform other logical operations on value representations.  
This capability is essential for understanding the complex interplay of values 
within a given context.

3.  **Value Alignment:** Mechanisms are required to assess whether a given behavior 
aligns with the preferred values.  This involves comparing actions or decisions 
against the represented values and determining the degree of congruence or conflict.  
This alignment process may involve quantitative measures or qualitative assessments.

4.  **Value-Based Explainability:** For transparency and to enhance human 
understanding of AI behavior, the AI must be able to explain how its actions 
(or the actions of others) relate to the underlying value system. This explainability 
component clarifies the connection between behavior and values, supporting both 
value-aligned decision-making and the value-aligned design of AI systems.

These four capabilities enable value-aware AI to achieve a range of functionalities, 
including:

1.  **Value Compliance Monitoring:** Monitoring compliance with values by human or 
AI systems, potentially providing feedback or supporting certification processes.

2.  **Implicit Value Deconstruction:** Inferring the values implicitly used by a human 
or AI system based on observed behavior, and providing feedback to make them aware of 
these values.

3.  **Value-Driven Action Advisement:** Advising a course of action to a human or AI 
system that is compatible with a given value system.

4.  **Autonomous Value-Aligned Action:** Autonomously performing actions that are 
compatible with a given value system.

Furthermore, value-aware AI can be applied not only to behaviors but also to the *motivators* 
of behavior, such as norms.  This leads to additional capabilities:

5.  **Norm-Value Alignment Analysis:** Analyzing the alignment of norms with values, 
providing feedback on norms, or supporting norm certification processes.

6.  **Implicit Value Deconstruction from Norms:** Inferring the values implicitly adhered 
to by norms.

7.  **Value-Driven Norm Advisement:** Advising on norms to adopt in a given situation, 
ensuring compatibility with a given value system.

8.  **Autonomous Value-Aligned Norm Selection:** Autonomously selecting norms that are 
compatible with a given value system.

Finally, value-aware AI can also play a crucial role in helping humans understand and 
evolve their own value systems:

9.  **Personal Value System Evolution Support:** Helping individuals decide how to evolve 
their personal value systems.

10. **Collective Value System Deliberation Support:** Facilitating collective decision-making 
regarding shared or agreed-upon value systems.

It is crucial to emphasize that deciding on value systems remains a strictly human prerogative.  
AI cannot make decisions *about* value systems but can only adopt and operate according to 
the value system(s) provided by its stakeholders.

These four technical capabilities—value acquisition, value representation and reasoning, value 
alignment, and value-based explainability—form the foundation for developing truly value-aware AI.  
In the following sections, we will illustrate how these capabilities can be integrated into 
the GNW architecture.
