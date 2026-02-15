![[Pasted image 20260102103903.png]]


```bash
pbkdf2:sha256:600000$AMtzteQIG7yAbZIa$0673ad90a0b4afb19d662336f0fce3a9edd0b7b19193717be28ce4d66c887133
```

```bash
python3 - << 'EOF'
import base64, binascii

h = "pbkdf2:sha256:600000$AMtzteQIG7yAbZIa$0673ad90a0b4afb19d662336f0fce3a9edd0b7b19193717be28ce4d66c887133"

_, algo, rest = h.split(':', 2)
iters, salt, hexhash = rest.split('$')

salt_b64 = base64.b64encode(salt.encode()).decode()
hash_b64 = base64.b64encode(binascii.unhexlify(hexhash)).decode()

print(f"{algo}:{iters}:{salt_b64}:{hash_b64}")
EOF
```

```bash
hashcat -m 10900 hashcat.txt /opt/rockyou.txt
```

