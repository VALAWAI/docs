---
sidebar_position: 3
---

# C2

C2 components are responsible for reflection within the VALAWAI framework. Critically, 
this reflection is *value-driven*.  The set of values acts as parameters that guide 
the behavior of C2 components. While the current implementation focuses on value-driven 
reflection, the architecture is designed to be flexible and adaptable to other drivers 
of reflection.

The following C2 components are defined in the RGNW toolbox:

*   **Alignment Calculator:** The [Alignment calculator](/docs/components/C2/alignment_calculator)
 measures the alignment of a set of norms with respect to a given value.

*   **Shapley Calculator:** The [Shapley calculator](/docs/components/C2/shapley_calculator) 
quantifies the contribution of a specific norm within a set to the overall 
alignment with a given value.

*   **Value Compatibility Calculator:** The [Value compatibility calculator](/docs/components/C2/value_compatibility_calculator)
 measures the degree of compatibility among a set of values.

*   **LLM Reflection:** The [LLM reflection](/docs/components/C2/llm_reflection)
 component generates reflections on received dialogue messages, taking a provided 
 list of values into account.

*   **MFT Values Detection:** The [MFT values detection](/docs/components/C2/mft_values_detection) 
component identifies moral foundations present in Twitter posts about immigration.

*   **Treatment Autonomy Valuator:** The [Treatment autonomy valuator](/docs/components/C2/treatment_autonomy_valuator)
 calculates the autonomy value associated with a specific treatment applied to a patient.

*   **Treatment Beneficence Valuator:** The [Treatment beneficence valuator](/docs/components/C2/treatment_beneficence_valuator)
 calculates the beneficence value associated with a specific treatment applied to a patient.

*   **Treatment Justice Valuator:** The [Treatment justice valuator](/docs/components/C2/treatment_justice_valuator)
 calculates the justice value associated with a specific treatment applied to a patient.

*   **Treatment Nonmaleficence Valuator:** The [Treatment nonmaleficence valuator](/docs/components/C2/treatment_nonmaleficence_valuator)
 calculates the nonmaleficence value associated with a specific treatment applied to a patient.