### From Attacking Device

#### Connect to a port on another device

```bash
ssh -N -L [local_port]:[target_ip]:[target_port] [user]@[target]
```

Examples:

Opens 3389 locally. Connected to 3389 locally will forward traffic to 10.1.1.10 on port 3389:

```bash
ssh -N -L 3389:10.1.1.10:3389 [user]@[target]

```

```bash
sudo ssh -N -L [local_port]:127.0.0.1:[target_port] [user]@[target]
```

Dynamic Port Forwarding:

```bash
sudo ssh -N -D 127.0.0.1:1080 [user]@[target]
```

### From Victim

This will open a new port on the attacking device from the target. If 3306 is open on the target but we don't have access to if we can forward this port over the ssh tunnel.

```bash
ssh -N -R [local_port]:127.0.0.1:[target_port] [user]@[target]
```

or

```bash
ssh -N -R [attacker_ip]:[local_port]:127.0.0.1:[target_port] [user]@[target]
```

Example

```bash
ssh -N -R 3389:127.0.0.1:3389 [user]@[target]
ssh -N -R 10.10.5.1:3389:127.0.0.1:3389 [user]@[target]
```