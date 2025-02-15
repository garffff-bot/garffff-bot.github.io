### Installation

Install the python collector

```bash
pip3 install bloodhound
```

And install the GUI and Neo4j: https://github.com/BloodHoundAD/BloodHound
### Usage

#### Linux

```bash
bloodhound-python -u user -p password -d domain.local -ns x.x.x.x -c all
```

If using proxychains add `--dns-tcp`

```bash
proxychains -q bloodhound-python -u user -p password -d domain.local -ns x.x.x.x -c alll --dns-tcp
```

Any weird timeout issues, use DNSChef and point it to the DC https://github.com/iphelix/dnschef:

```bash
sudo python3 /opt/dnschef/dnschef.py --fakeip x.x.x.x
          _                _          __  
         | | version 0.4  | |        / _| 
       __| |_ __  ___  ___| |__   ___| |_ 
      / _` | '_ \/ __|/ __| '_ \ / _ \  _|
     | (_| | | | \__ \ (__| | | |  __/ |  
      \__,_|_| |_|___/\___|_| |_|\___|_|  
                   iphelix@thesprawl.org  

(13:39:49) [*] DNSChef started on interface: 127.0.0.1
(13:39:49) [*] Using the following nameservers: 8.8.8.8
(13:39:49) [*] Cooking all A replies to point to 192.168.56.126
```

Then run Bloodhound pointing to your loopback address. You may also need to add the `-dc` or `-gc` flag and add the name of the DC:

```bash
bloodhound-python -u user -p password -d domain.local -ns 127.0.0.1 -c all -dc dc_name
```

You may also need to set your systems time to the same time as the DC, if you get a `KRB_AP_ERR_SKEW` error:

```bash
sudo ntpdate x.x.x.x
```

#### Windows

```bash
.\SharpHound1.1.0.exe -c all -d domain.local
```

Once you have collected the data, run Neo4j and the Bloodhound GUI:

```bash
sudo neo4j start
BloodHound-linux-x64/BloodHound
```

I have an alias set up for this. On my system I have to use the `--disable-gpu-sandbox` flag:

```bash
alias bloodhound="~/Downloads/BloodHound-linux-x64/BloodHound-linux-x64/BloodHound --disable-gpu-sandbox"
```

When starting neo4j, if this error happens:

```bash
WARNING! You are using an unsupported Java runtime.
* Please use Oracle(R) Java(TM) 17, OpenJDK(TM) 17 to run Neo4j.
* Please see https://neo4j.com/docs/ for Neo4j installation instructions
```

Select the correct java version:

```bash
sudo update-alternatives --config java
```

Select `/usr/lib/jvm/java-17-openjdk-amd64/bin/java`

