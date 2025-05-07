# Step 2 (Optional). Set up the development environment

For a consistent and isolated development experience, you can utilize Docker to create 
a dedicated environment for building and testing your component. This step is optional 
but provides all the necessary software and tools, minimizing potential conflicts with 
your local system setup.

To set up this development environment, you will need to create the following files and 
directories within your project's root:

```
C1_echo_example_with_python_and_pika/
├── startDevelopmentEnvironment.sh
├── stopDevelopmentEnvironment.sh
└── docker/
    └── dev/
        ├── Dokerfile
        └── docker-compose.yaml
```

The next subsectins explain the content and purpose of each of this files.


## The `startDevelopmentEnvironment.sh` file

The `startDevelopmentEnvironment.sh` script will start the development environment, which includes 
the necessary tools and services for building and testing your component.
The next code is the expected content for this file:

```bash reference {107} showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/startDevelopmentEnvironment.sh
```

If you want to use this in a different component you must change the `c1_echo_example_with_python_and_pika` 
with the type and name of your component.


## The `stopDevelopmentEnvironment.sh` file

The `stopDevelopmentEnvironment.sh` script will stop the development environment, which includes 
the started services. The next code is the expected content for this file:

```bash reference {107} showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/stopDevelopmentEnvironment.sh
```

If you want to use this in a different component you must change the `c1_echo_example_with_python_and_pika` 
with the type and name of your component.

This script will stop the development environment,	
   which includes the started tools and services for building and testing your component.

## `docker/dev/Dockerfile`

This file defines the Docker image for the development environment.
 
## `docker/dev/docker-compose.yaml`

This file defines the required services for the development environment.
 

## Start the environment

To start the development environment, run the following command:

```bash
./startDevelopmentEnvironment.sh
```

After that, you have a bash shell where you can interact with
the Python development environmentand use the next commands:

* `run:` Starts the component.
* `testAll:` Runs all unit tests for the codebase.
* `test test/test_something.py:` Runs the unit tests defined in
 the file `test_something.py`.
	* `test test/test_something.py::TestClassName::test_do_something:` Runs 
	a specific unit test named `test_do_something` defined within the class `TestClassName` 
	in the file `test_something.py`.
* `coverage:` Runs all unit tests and generates a coverage report.
* `fmt:` Runs a static code analyzer to check for formatting and style issues.

Also you can use the `stopDevelopmentEnvironment.sh` script to stop the environment.