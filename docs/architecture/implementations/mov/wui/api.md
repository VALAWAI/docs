---
sidebar_position: 3
---

# RESTful API

The Master Of VALAWAI (MOV) exposes a RESTful API, mirroring the functionality 
available through the user interface. This API allows programmatic interaction 
with the MOV, enabling external systems and applications to manage and monitor 
the VALAWAI system.  Full documentation for these services can be found in 
the [openapi.yaml](https://editor.swagger.io/?url=https://raw.githubusercontent.com/VALAWAI/MOV/main/openapi.yaml)
file. The user interface itself is built upon these same API endpoints.

The following services are currently provided:

 - **GET /v1/components**: Retrieves a paginated list of registered components, 
 including relevant information about each component.
 - **GET /v1/components/\{component_id\}**: Retrieves detailed information about 
 a specific registered component, identified by its `component_id`.
 - **POST /v1/components**: Registers a new component with the system. 
 - **DELETE /v1/components/\{component_id\}**: Unregisters a component from the system, 
 identified by its `component_id`.
 - **GET /v1/connections**: Retrieves a paginated list of registered topology 
 connections, including information about each connection.
 - **GET /v1/connections/\{connection_id\}**: Retrieves detailed information about 
 a specific topology connection, identified by its `connection_id`.
 - **POST /v1/connections**: Registers a new topology connection with the system. 
 - **PUT /v1/connections/\{connection_id\}**: Modifies the status of a specific topology
 connection, identified by its `connection_id`. This might be used to enable, 
 disable or remove a connection, for example.
 - **GET /v1/logs**: Retrieves a paginated list of log messages from the system. 
 This endpoint likely supports filtering and sorting by log level, timestamp, etc.
 
This RESTful API provides a comprehensive interface for interacting with the MOV. 
The [OpenAPI specification](https://editor.swagger.io/?url=https://raw.githubusercontent.com/VALAWAI/MOV/main/openapi.yaml) 
provides detailed information about the request and response formats for each 
endpoint, facilitating client development.
