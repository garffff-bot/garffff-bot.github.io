#### Temporary - Stored in Memory

IP Address:

```bash
sudo ip addr add 192.168.1.100/24 dev eth0
```

Bring up interface:

```bash
sudo ip link set eth0 up
```

Default static route:

```bash
sudo ip route add default via 192.168.1.1
```

Set DNS server:

```bash
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf > /dev/null
```
### Permanently

Using `nmcli`:

```bash
sudo nmcli con mod "Wired connection 1" ipv4.addresses 192.168.1.100/24
sudo nmcli con mod "Wired connection 1" ipv4.gateway 192.168.1.1
sudo nmcli con mod "Wired connection 1" ipv4.dns "8.8.8.8"
sudo nmcli con mod "Wired connection 1" ipv4.method manual
sudo nmcli con up "Wired connection 1"
```

Edit `/etc/network/interfaces`:

```bash
sudo nano /etc/network/interfaces

auto eth0
iface eth0 inet static
  address 192.168.1.100
  netmask 255.255.255.0
  gateway 192.168.1.1
  dns-nameservers 8.8.8.8
```

