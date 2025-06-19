```bash
sudo apt install vlan 
sudo modprobe 8021q 

sudo vconfig add eth1 10  
sudo vconfig add eth1 20  
sudo vconfig add eth1 30 

sudo ip link add link eth1 name eth1.10 type vlan id 10  
sudo ip link add link eth1 name eth1.30 type vlan id 20  
sudo ip link add link eth1 name eth1.40 type vlan id 30 

sudo ip addr add 172.16.10.1/24 dev eth1.10  
sudo ip addr add 172.17.20.1/24 dev eth1.20  
sudo ip addr add 172.17.30.1/24 dev eth1.30 

sudo ip link set up eth1.10  
sudo ip link set up eth1.20  
sudo ip link set up eth1.30
```

