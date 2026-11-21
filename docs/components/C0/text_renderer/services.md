---
sidebar_position: 2
---

# Services

The Text Renderer (C0) offers core services that enable it to integrate with and 
contribute to the VALAWAI infrastructure. You can find a full, detailed description 
of these services in the component's [AsyncAPI specification](https://raw.githubusercontent.com/VALAWAI/C0_text_renderer/main/asyncapi.yaml),
which is available directly within the [source code of this component](https://github.com/VALAWAI/C0_text_renderer).

Below, we'll describe the primary services this component provides.

## Render text

The main purpose of the Text Renderer is to provide a web user interface where received text messages are displayed in a human-readable format. It supports multiple formats, including plain text, Markdown, and HTML, allowing for flexible visualization of data streams in real-time.

To render a message, the component subscribes to the channel `valawai/c0/text_renderer/data/text`. The message payload is in JSON format and includes the following fields:

 - `mime_type`: The mime type of the message, which determines how it will be rendered (e.g., `text/plain`, `text/html`, or `text/markdown`).
 - `title`: The title of the text (optional).
 - `content`: The actual text content to be rendered.

Here's an example of the JSON payload received from the channel:

```json
{
  "mime_type": "text/markdown",
  "title": "System Alert",
  "content": "# Warning\nAn unexpected event has occurred in the **C0** layer."
}
```
