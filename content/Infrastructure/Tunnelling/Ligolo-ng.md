
### Linux Host
```bash
sudo ip tuntap add user garffff mode tun ligolo 
sudo ip link set ligolo up
sudo ./proxy -laddr 0.0.0.0:8080 -selfcert
```
### Windows Target:

```bash
agent.exe -connect <host_ip>:8080 -ignore-cert
```
### Linux Target

```bash
agent_linux -connect <host_ip>:8080 -ignore-cert
```

Then Back on the Linux host within Ligolo-ng:

```bash
session [select session]
ifconfig
[grab subnet you want to reach]
```

New Linux terminal:

```bash
sudo ip route add x.x.x.x/xx dev ligolo
route
ip route list
```

Back in Ligolo-ng - make sure you are in the correct session

```bash
start
```