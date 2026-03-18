Metasploit:

```bash
run post/multi/gather/ping_sweep RHOSTS=172.16.5.0/23
```

Linux:

```bash
for i in {1..254} ;do (ping -c 1 172.16.5.$i | grep "bytes from" &) ;done
```

Windows CMD:

```bash
for /L %i in (1 1 254) do ping 172.16.5.%i -n 1 -w 100 | find "Reply"
```

Windows Powershell:

```bash
1..254 | % {"172.16.5.$($_): $(Test-Connection -count 1 -comp 172.15.5.$($_) -quiet)"}

cmd /c 'for /l %i in (1,1,254) do @ping -n 1 -w 100 172.16.2.%i | find "TTL="'

```

FPing:

- -a: Shows targets that are alive
- -s: Prints stats at the end
- -g: Generate a target list from the CIDR network
- -q: Not show per-target results

```bash
fping -asgq 172.16.5.0/23
```

Nmap

```bash
echo '10.10.110.0/24' > targets.txt
echo '10.10.14.9' > exclude.txt

nmap -sS -T4 -Pn --top-ports=25 -n -oA ./Nmap-PortSweep --open -iL targets.txt --excludefile exclude.txt

nmap -sn -PE -T5 --disable-arp-ping -n -oA ./Nmap-PingSweep -iL targets.txt --excludefile exclude.txt

grep open ./Nmap-PortSweep.gnmap |awk '{print $2}' > Port-Live.txt
grep Up ./Nmap-PingSweep.gnmap |awk '{print $2}' > Ping-Live.txt 
cat Port-Live.txt Ping-Live.txt |sort -uV > LiveIPs.txt
```