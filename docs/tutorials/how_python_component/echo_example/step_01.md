# Step 1. Set up the Project Structure

To begin, we need to establish the fundamental file and directory organization for our "echo" 
component. Following the [recommended component skeleton structure](/docs/tutorials/how_python_component/skeleton#base-structure),
create the following files and directories in your project's root directory, which we'll assume
is named `C1_echo_example_with_python_and_pika/`:

```
C1_echo_example_with_python_and_pika/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── asyncapi.yaml
├── docker-compose.yml
├── pyproject.toml
├── src/
│    └── c1_echo_example_with_python_and_pika/
│        ├── __init__.py
│        └── __main__.py
└── tests/
```

The content to be added to these files will be explained in the subsequent steps.
