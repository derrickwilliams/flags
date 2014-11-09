## usage
```
$ node flags.js <command> <all | <flagname>> [value]
```
### usage params
* command (required): Action to perform against flag set. Available flags below.
* flagname (required): Flag to perform action on. You can use `all` for this value if you want to view all available flag values.
* value (required for **add** and **update** commands): Value to for given flag name.

## commands
* **view**: Shows value for given flag name.
* **add**: Adds flag and value. Will not overwrite flags. Must use update command.
* **remove**: Remove flag and value for given flag name
* **update**: Update flag with value. Will create flag if is does not exist.
