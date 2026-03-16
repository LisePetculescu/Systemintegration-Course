## Warehouse Robot Service

A logistics company operates a warehouse with autonomous robots that move boxes between storage areas, packing stations, and loading zones. The warehouse control system exposes a gRPC API used internally by:
- Robot controllers
- Warehouse management software
- Monitoring dashboards

The API must allow clients to:
- Assign a task to a robot
- Retrieve the status of a robot
- Mark a task as completed

Write the corresponding `warehouse_robot_service.proto` file.

**Functional requirements**

1. Assign a task to a robot

    - A client sends `robot_id`, `task_id`, `pickup_zone`, `delivery_zone`, `box_id`
    - The server returns: `confirmation_message`, `assigned_task_id`

2. Get robot status

    - A client sends: `robot_id`
    - The server returns: `robot_id`, `current_zone`, `battery_level`, `status`

3. Complete a task

    - A client sends: `task_id`, `robot_id`
    - The server returns: `confirmation_message`

Define an enum for robot `status`: `IDLE`, `MOVING`, `CHARGING`, `ERROR`.

Exercise authored by [**Arturo Mora-Rioja**](https://github.com/arturomorarioja)  