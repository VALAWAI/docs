---
sidebar_position: 1
---


# How to use

The Text Renderer (C0) is a web-based interface designed to visualize text data streams from the VALAWAI ecosystem in real-time. It acts as a centralized display for messages coming from various components, supporting multiple formats to ensure that information is presented in a human-readable and structured manner.

The component monitors the `valawai/c0/text_renderer/data/text` channel for incoming messages. You can find more details on the message format and the communication process in the [Services](/docs/components/C0/text_renderer/services) section.

The web application provides a streamlined experience for managing and viewing these messages through a navigation menu located on the right side of the interface, which allows you to switch between two primary views: **Texts** and **Status**.

## Texts View

The Texts view is the central hub for monitoring incoming messages. It displays a table of all received texts, providing a quick overview of the current data stream.

The table includes the following information for each message:
*   **Identifier**: A unique ID for the message.
*   **Title**: The title associated with the text (if provided).
*   **Timestamp**: When the text was received by the renderer.

On the right side of each row, a menu button provides two actions:

### View Message
Choosing *View* takes you to a dedicated rendering page. Depending on the `mime_type` specified in the message, the Text Renderer will automatically format the content:
*   **Plain Text**: Rendered as standard unformatted text.
*   **Markdown**: Rendered using Markdown syntax (e.g., headers, bold text, lists).
*   **HTML**: Rendered as a web page, allowing for complex layouts and styling.

### Delete Message
Choosing *Delete* directs you to a confirmation page. To prevent accidental data loss, you must confirm the action before the message is removed from the renderer's local display.

## Status View

The Status view allows you to monitor the operational health of the component. This view provides a real-time indication of whether the Text Renderer is **UP** (running and ready) or **DOWN** (experiencing issues).

This status is derived from the component's internal health checks, ensuring that you can quickly verify if the renderer is successfully connected to the VALAWAI infrastructure and capable of processing incoming text streams.
