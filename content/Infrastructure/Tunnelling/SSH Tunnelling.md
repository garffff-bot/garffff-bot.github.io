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

This setup creates a new port on the attacker's machine `[target]`, which forwards traffic originating from the victim's machine (`127.0.0.1`). If a service (e.g., MySQL on port `3306`) is only accessible locally on the victim (`127.0.0.1:3306`), SSH remote port forwarding can be used to expose it to the attacker's machine.

```bash
ssh -N -R [local_port]:127.0.0.1:[target_port] [user]@[target]
```

or, to restrict access to a specific IP on the attacker's machine:

```bash
ssh -N -R [attacker_ip]:[local_port]:127.0.0.1:[target_port] [user]@[target]
```

Example

```bash
ssh -N -R 3389:127.0.0.1:3389 [user]@[target]
ssh -N -R 10.10.5.1:3389:127.0.0.1:3389 [user]@[target]
```