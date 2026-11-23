---
sidebar_position: 1
---

# How to use

The **C1 Treatment Report Generator** is a clinical and ethical decision-support component that synthesizes complex medical data into human-readable reports. It acts as a bridge between the structured outputs of the VALAWAI reflective loop and the final clinical review, transforming technical evaluations of protocol adherence and ethical value alignment into a cohesive narrative for medical professionals.

By leveraging Large Language Models (LLMs) via [Ollama](/docs/components/C1/treatment_report_generator/deploy#ollama-llm-configuration), the component produces rich, formatted reports that highlight clinical tensions, ethical trade-offs, and critical safeguards, ensuring that the reasoning behind a treatment plan is transparent and accessible.

## Operational Flow

The Treatment Report Generator operates as an asynchronous synthesis module within the VALAWAI architecture:

1.  **Data Collection**: The component continuously monitors the system for new treatment plans and their associated evaluations. It aggregates data from three primary sources:
    *   **Treatment Payloads**: The core details of the proposed medical actions and patient status.
    *   **Action Protocol Feedback**: Compliance results from components like the [NIT Protocol Manager](/docs/components/C1/nit_protocol_manager), indicating whether actions are allowed, denied, or uncertain.
    *   **Value Alignment Feedback**: Ethical scores from C2 reflective modules (e.g., [Treatment Autonomy Valuator](/docs/components/C2/treatment_autonomy_valuator)), quantifying alignment with principles like autonomy and beneficence.
2.  **Scheduled Synthesis**: Instead of immediate generation, the component uses a configurable cron job (defined by `c1_treatment_report_generator.report-cron`) to periodically identify treatments that require reporting.
3.  **LLM-Powered Generation**: For each identified treatment, the component invokes an LLM to synthesize the aggregated data. The LLM follows strict clinical and ethical domain rules to produce a report structured into:
    *   **Executive Summary**: A concise overview of the treatment and overall alignment.
    *   **Patient Baseline & Proposed Treatment**: Integration of prognosis and patient status.
    *   **Action Protocol Evaluation**: A detailed breakdown of protocol compliance.
    *   **Value Alignment Assessment**: Analysis of ethical alignment scores.
    *   **Clinical & Ethical Considerations**: Identification of tensions or missing information.
4.  **Report Publication**: The final formatted report (in Markdown, HTML, or Plain Text) is published to the VALAWAI infrastructure, where it can be consumed by interfaces like the [Patient Treatment UI](/docs/components/C0/patient_treatment_ui).

## Understanding the Reports

The reports are designed to provide high-density clinical intelligence without overwhelming the user with raw data. They specifically focus on:

*   **Transparency**: Explicitly stating when information is missing or when the system is uncertain about a protocol's application.
*   **Tension Detection**: Highlighting cases where a treatment might be protocol-compliant but ethically misaligned (or vice-versa), prompting human clinicians to intervene.
*   **Narrative Reasoning**: Moving beyond simple "Allowed/Denied" flags to explain *why* a certain result was reached based on the patient's specific clinical baseline.

## Configuration

The behavior of the report generator can be customized via environment variables and properties:

*   **Output Format**: The default MIME type (e.g., `text/markdown`, `text/html`, `text/plain`) can be configured via `c1_treatment_report_generator.mime-type`.
*   **Generation Frequency**: The timing of report synthesis is controlled by the `c1_treatment_report_generator.report-cron` expression.
*   **LLM Parameters**: Connection details and model selection for the LLM are managed through the Ollama configuration described in the [Deploying](/docs/components/C1/treatment_report_generator/deploy) section.

## Monitoring

You can monitor the report generation process and track LLM interaction logs through the [MOV user interface](/docs/architecture/implementations/mov/wui/live#manage-logs). The logs provide visibility into which treatments are being processed and any failures during the synthesis phase.
