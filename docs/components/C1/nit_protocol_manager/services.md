---
sidebar_position: 2
---

# Services

The services of this component are described in the [asyncapi](https://raw.githubusercontent.com/VALAWAI/C1_nit_protocol_manager/main/asyncapi.yaml)
that you can find on the [source code of this component](https://github.com/VALAWAI/C1_nit_protocol_manager).


## Check treatment

This component receives, on the channel **valawai/c1/nit_protocol_manager/data/treatment**,
the treatments that have to be applied to a patient and checks that they follow the
NIT protocol. For every action of the treatment, it publishes a feedback
(see [Notify about the treatment action feedback](#notify-about-the-treatment-action-feedback)).
This treatment has the next attributes:

 - **id** the identifier of the treatment.
 - **patient_id** the identifier of the patient to apply the treatment.
 - **created_time** the epoch time, in seconds, when the treatment is created.
 - **before_status** the status of the patient before the treatment is applied,
   described using the patient status criteria.
 - **actions** the list of treatment actions to apply over the patient, each one
   being a value from the next set.
 - **expected_status** the expected status of the patient after the treatment has
   been applied, described using the patient status criteria.

The possible **actions** to apply over a patient are:

 - **CPR** the patient can receive a cardiopulmonary resuscitation.
 - **TRANSPLANT** the patient needs an organ transplant.
 - **ICU** the patient can be in the intensive care unit.
 - **NIMV** the patient can have non-invasive mechanical ventilation.
 - **VASOACTIVE_DRUGS** the patient can receive vasoactive drugs.
 - **DIALYSIS** the patient can have dialysis.
 - **SIMPLE_CLINICAL_TRIAL** the patient can receive a simple clinical trial.
 - **MEDIUM_CLINICAL_TRIAL** the patient can receive a medium clinical trial.
 - **ADVANCED_CLINICAL_TRIAL** the patient can receive an advanced clinical trial.
 - **PALLIATIVE_SURGERY** the patient can have palliative surgery.
 - **CURE_SURGERY** the patient can have surgery with the intention of curing.

Both the **before_status** and the **expected_status** are objects that describe the
status of the patient using the next criteria:

 - **age_range** the range of age of the patient (from `AGE_BETWEEN_0_AND_19` to `AGE_MORE_THAN_99`).
 - **ccd** whether the patient has a complex chronic disease.
 - **maca** whether, to the question "would you be surprised if this patient died in less than 12 months?", the answer is no.
 - **expected_survival** the expected survival time of the patient (`LESS_THAN_12_MONTHS`, `MORE_THAN_12_MONTHS`, or `UNKNOWN`).
 - **frail_VIG** the fragility index of the patient (`LOW`, `MODERATE`, `HIGH`, or `UNKNOWN`).
 - **clinical_risk_group** the clinical risk group of the patient (`PROMOTION_AND_PREVENTION`, `SELF_MANAGEMENT_SUPPORT`, `ILLNESS_MANAGEMENT`, `CASE_MANAGEMENT`, or `UNKNOWN`).
 - **has_social_support** whether the patient has social support.
 - **independence_at_admission** the functional independence of the patient at admission (`TOTAL`, `SEVERE`, `MODERATE`, `MILD`, `INDEPENDENT`, or `UNKNOWN`).
 - **independence_instrumental_activities** the index that measures the independence of the patient for instrumental activities (from `0` to `8`).
 - **has_advance_directives** whether the patient has advance directives.
 - **is_competent** whether the patient is competent to understand the instructions of health personnel.
 - **has_been_informed** whether the patient, or his/her authorized referent, has been informed of the possible treatments and the consequences of receiving them.
 - **is_coerced** whether the patient has been coerced or pressured by third parties.
 - **has_cognitive_impairment** the cognitive impairment of the patient (`ABSENT`, `MILD_MODERATE`, `SEVERE`, or `UNKNOWN`).
 - **has_emocional_pain** whether the patient has emotional pain.
 - **discomfort_degree** the degree of discomfort of the patient before applying any action (`LOW`, `MEDIUM`, `HIGH`, or `UNKNOWN`).
 - **nit_level** the level of therapeutic intensity of the patient. It ranges from **ONE** (all measures to prolong survival) to **FIVE** (only comfort treatments), passing through **TWO_A** (all measures except CPR), **TWO_B** (all measures except CPR and ICU), and **THREE** (complementary scans and non-invasive treatments).

The next JSON is an example of this data model.

```jsx
{
  "id": "1234",
  "patient_id": "4321",
  "created_time": 1715342664,
  "before_status": {
    "age_range": "AGE_BETWEEN_0_AND_19",
    "ccd": true,
    "maca": true,
    "expected_survival": "LESS_THAN_12_MONTHS",
    "frail_VIG": "LOW",
    "clinical_risk_group": "PROMOTION_AND_PREVENTION",
    "has_social_support": true,
    "independence_at_admission": "TOTAL",
    "independence_instrumental_activities": 8,
    "has_advance_directives": true,
    "is_competent": true,
    "has_been_informed": true,
    "is_coerced": true,
    "has_cognitive_impairment": "ABSENT",
    "has_emocional_pain": true,
    "discomfort_degree": "LOW",
    "nit_level": "ONE"
  },
  "actions": [
    "CPR"
  ],
  "expected_status": {
    "age_range": "AGE_BETWEEN_0_AND_19",
    "ccd": true,
    "maca": true,
    "expected_survival": "LESS_THAN_12_MONTHS",
    "frail_VIG": "LOW",
    "clinical_risk_group": "PROMOTION_AND_PREVENTION",
    "has_social_support": true,
    "independence_at_admission": "TOTAL",
    "independence_instrumental_activities": 8,
    "has_advance_directives": true,
    "is_competent": true,
    "has_been_informed": true,
    "is_coerced": true,
    "has_cognitive_impairment": "ABSENT",
    "has_emocional_pain": true,
    "discomfort_degree": "LOW",
    "nit_level": "ONE"
  }
}
```

## Notify about the treatment action feedback

For each treatment it receives, this component checks whether it follows the NIT protocol
and publishes a feedback for each of its actions on the channel
**valawai/c1/nit_protocol_manager/data/treatment_action_feedback**. This feedback has the next attributes:

 - **treatment_id** the identifier of the treatment that has been checked.
 - **action** the treatment action that has been checked, one of the possible actions
   described in [Check treatment](#check-treatment).
 - **feedback** the result of the check, that can be **ALLOW** if the action is allowed
   by the NIT protocol, **DENY** if it is not allowed, or **UNKNOWN** if there is not
   enough information to take a decision.

The next JSON is an example of this data model.

```jsx
{
  "treatment_id": "1234",
  "action": "CPR",
  "feedback": "ALLOW"
}
```
