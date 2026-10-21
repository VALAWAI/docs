---
sidebar_position: 2
---

# Services

The Patient Treatment UI (C0) offers core services that enable it to integrate with and 
contribute to the VALAWAI infrastructure. You can find a full, detailed description 
of these services in the component's [AsyncAPI specification](https://raw.githubusercontent.com/VALAWAI/C0_patient_treatment_ui/main/asyncapi.yaml),
which is available directly within the [source code of this component](https://github.com/VALAWAI/C0_patient_treatment_ui).

Below, we'll describe the primary services this component provides.

## Publish treatment

As a user interface component, the Patient Treatment UI enables doctors to define treatment plans for patients and publish them seamlessly across the VALAWAI infrastructure.

This information is published to the channel `valawai/c0/patient_treatment_ui/data/treatment`. The messages sent to this channel are in JSON format and include the following fields:

 - `id`: The identifier of the treatment.
 - `patient_id`: The identifier of the patient receiving the treatment.
 - `created_time`: The epoch time in seconds when the treatment was created.
 - `before_status`: The patient's status criteria before applying the treatment (includes `age range`, `CCD` status, `MACA` status, `expected survival`, `frailty index`, `clinical risk group`, `social support`, `independence levels`, `advance directives`, `competence`, `informed consent`, `coercion`, `cognitive impairment`, `emotional pain`, `discomfort degree`, and `therapeutic intensity level`).
 - `actions`: An array of treatment actions to apply to the patient (e.g., `CPR`, `TRANSPLANT`, `ICU`, `NIMV`, `VASOACTIVE_DRUGS`, `DIALYSIS`, `SIMPLE_CLINICAL_TRIAL`, `MEDIUM_CLINICAL_TRIAL`, `ADVANCED_CLINICAL_TRIAL`, `PALLIATIVE_SURGERY`, `CURE_SURGERY`).
 - `expected_status`: The expected status criteria of the patient after applying the treatment.

Here's an example of the JSON data model published to the channel:

```json
{
  "id": "1234",
  "patient_id": "4321",
  "created_time": 1715342664,
  "before_status": {
    "age_range": "AGE_BETWEEN_60_AND_69",
    "ccd": false,
    "maca": false,
    "expected_survival": "MORE_THAN_12_MONTHS",
    "frail_VIG": "LOW",
    "clinical_risk_group": "ILLNESS_MANAGEMENT",
    "has_social_support": true,
    "independence_at_admission": "INDEPENDENT",
    "independence_instrumental_activities": 8,
    "has_advance_directives": true,
    "is_competent": true,
    "has_been_informed": true,
    "is_coerced": false,
    "has_cognitive_impairment": "ABSENT",
    "has_emocional_pain": false,
    "discomfort_degree": "LOW",
    "nit_level": "ONE"
  },
  "actions": [
    "ICU",
    "VASOACTIVE_DRUGS"
  ],
  "expected_status": {
    "age_range": "AGE_BETWEEN_60_AND_69",
    "ccd": false,
    "maca": false,
    "expected_survival": "MORE_THAN_12_MONTHS",
    "frail_VIG": "LOW",
    "clinical_risk_group": "ILLNESS_MANAGEMENT",
    "has_social_support": true,
    "independence_at_admission": "INDEPENDENT",
    "independence_instrumental_activities": 8,
    "has_advance_directives": true,
    "is_competent": true,
    "has_been_informed": true,
    "is_coerced": false,
    "has_cognitive_impairment": "ABSENT",
    "has_emocional_pain": false,
    "discomfort_degree": "LOW",
    "nit_level": "ONE"
  }
}
```

## Receive treatment value feedback

The Patient Treatment UI receives feedback regarding how well a proposed treatment aligns with specific values.

To receive this feedback, the component subscribes to the channel `valawai/c0/patient_treatment_ui/data/treatment_value_feedback`. The message payload is in JSON format and contains the following fields:

 - `treatment_id`: The identifier of the treatment.
 - `value_name`: The name of the value with which the treatment is aligned (e.g., "Autonomy").
 - `alignment`: A numeric value between -1 and 1 indicating the degree of alignment.

Here's an example of the JSON payload received from the channel:

```json
{
  "treatment_id": "1234",
  "value_name": "Autonomy",
  "alignment": 0.81675
}
```

## Receive treatment action feedback

The component also receives feedback regarding whether specific treatment actions are allowed, denied, or unknown.

To receive this feedback, the component subscribes to the channel `valawai/c0/patient_treatment_ui/data/treatment_action_feedback`. The message payload is in JSON format and contains the following fields:

 - `treatment_id`: The identifier of the treatment.
 - `action`: The specific treatment action being evaluated (e.g., `CPR`, `ICU`, `TRANSPLANT`).
 - `feedback`: The feedback result (`ALLOW`, `DENY`, or `UNKNOWN`).

Here's an example of the JSON payload received from the channel:

```json
{
  "treatment_id": "1234",
  "action": "ICU",
  "feedback": "ALLOW"
}
```
