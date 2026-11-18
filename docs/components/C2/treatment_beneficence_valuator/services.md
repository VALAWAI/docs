---
sidebar_position: 2
---

# Services

The services of this component are described in the [asyncapi](https://raw.githubusercontent.com/VALAWAI/C2_treatment_beneficence_valuator/main/asyncapi.yaml)
that you can find on the [source code of this component](https://github.com/VALAWAI/C2_treatment_beneficence_valuator).


## Check treatment beneficence value

This component receives, on the channel **valawai/c2/treatment_beneficence_valuator/data/treatment**,
a treatment to check its alignment with the beneficence value. For every treatment checked, it publishes
a feedback (see [Notify about the treatment value alignment](#notify-about-the-treatment-value-alignment)).
This treatment has the next attributes:

 - **id** the identifier of the treatment.
 - **patient_id** the identifier of the patient to apply the treatment.
 - **created_time** the epoch time, in seconds, when the patient treatment is created.
 - **before_status** the status before to apply the treatment, described using the patient status criteria.
 - **actions** the list of treatment actions to apply over the patient.
 - **expected_status** the expected status of the patient after applying the treatment, described using the patient status criteria.

The **before_status** and **expected_status** are objects that describe the status of the patient using the next criteria:

 - **age_range** the range of age of the patient.
 - **ccd** check if the patient status has a Complex Cronic Disease (CCD).
 - **maca** whether, to the question "would you be surprised if this patient died in less than 12 months?", the answer is no.
 - **expected_survival** the expected survival time for the patient status.
 - **frail_VIG** the fragility index of the patient status.
 - **clinical_risk_group** the clinical risk group of the patient status.
 - **has_social_support** check if the patient status has social support.
 - **independence_at_admission** the functional independence of the patient at admission.
 - **independence_instrumental_activities** the index that measures the independence for instrumental activities.
 - **has_advance_directives** whether the patient has advance directives.
 - **is_competent** whether the patient is competent to understand the instructions of health personnel.
 - **has_been_informed** whether the patient, or his/her authorized referent, has been informed of the possible treatments and the consequences of receiving them.
 - **is_coerced** whether the patient has been coerced or pressured by third parties.
 - **has_cognitive_impairment** inform if the patient status has cognitive impairment.
 - **has_emocional_pain** inform if the patient status has emotional pain.
 - **discomfort_degree** describe the degree of discomfort of the patient status before applying any action.
 - **nit_level** the level of therapeutic intensity of the patient.

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

## Notify about the treatment value alignment

For each treatment it receives, this component calculates the alignment of the treatment with the beneficence value and publishes the result on the channel
**valawai/c2/treatment_beneficence_valuator/data/treatment_value_feedback**. This feedback has the next attributes:

 - **treatment_id** the identifier of the treatment.
 - **value_name** the name of the value that the treatment is aligned.
 - **alignment** the alignment of the value with the the treatment.

The next JSON is an example of this data model.

```jsx
{
  "treatment_id": "1234",
  "value_name": "beneficence",
  "alignment": 0.72
}
```
