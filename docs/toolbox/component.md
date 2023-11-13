---
sidebar_position: 2
---

# Component definition

## Component names

The name of a component starts with the type of component c0,c1, or c2 plus
the name of the component in lower and Python case. For example, the C0 component
named ‘voice to text’ will be named c0_voice_to_text.


## Component versions

All the components will follow the next version schema: [major, minor, and bug](https://semver.org/).
Thus, for the first major version, with the seven minor changes and the second
bug fixed the version will be: 1.7.2

The developers must provide backward compatibility only between minor versions. Thus backward compatibility is only applied to the versions that happen on the same major, and not between majors but developers may try to do it if it is feasible.


## Component license

The components defined on the RGNW toolbox uses as common the license [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
The use of this license is not not mandatory and you can found components that uses other licenses.


## Code repository

The components’s code is public and hosted on GitHub under [VALAWAI organization](https://github.com/VALAWAI).

Each component has the following files:

 * README.md contains a short description of what the component has done, a summary with the key element
  of the component (type, version, API version, Partner name, License name), and the text that will be included
  on the deliverable.
 * LICENSE of the component that by default has to be GPLv3.
 * CHANGELOG.md will contain a description of the significant changes in all the public versions of the component,
  and any necessary instructions to upgrade from the previous version.
 * asyncapi.yaml that contains the minimum description of the messages that the component can receive and send.
 * docker-compose.yml on this file you describes how to deploy the component on a docker environment.
