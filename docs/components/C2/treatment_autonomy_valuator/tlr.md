---
sidebar_position: 4
---

# Technology Readiness Level (TRL)

The **Treatment Autonomy Valuator** is a C2 reflective component designed for the VALAWAI project's medical protocol demonstrator. Its primary function is to evaluate the degree to which a proposed treatment plan respects the patient's autonomy and right to self-determination. As part of the C2 reflective layer, it provides a value-based constraint that can inhibit or modify decisions made by the C1 NIT Protocol Manager if the treatment is found to conflict with the patient's expressed preferences or legal capacity for consent.

Given its current stage, the Treatment Autonomy Valuator is classified at **TRL 3: 
Analytical and experimental critical function and/or characteristic proof-of-concept**.
This rating is based on the successful implementation of the autonomy-value calculus in simulated environments, demonstrating that the component can translate patient preference data into a quantifiable ethical constraint.

To advance to **TRL 4: Component and/or breadboard validation in a laboratory environment**,
the component must be integrated into the live reflective loop of the demonstrator.
Key requirements for reaching
TRL 4 include:

* **C1-C2 Interface Validation:** Verifying the seamless exchange of value-alignment requests and responses with the NIT Protocol Manager via the project's communication topology.

* **Reflective Feedback Loop Testing:** Demonstrating the ability of the valuator to trigger "inhibitory" signals that force the C1 component to re-evaluate a treatment plan based on autonomy constraints.

* **Synthetic Preference Modeling:** Testing the valuator against a diverse range of synthetic patient profiles with varying levels of autonomy and consent complexity to verify the precision of the value calculus.
