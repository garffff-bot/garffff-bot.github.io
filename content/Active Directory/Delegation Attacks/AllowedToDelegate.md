(Constrained Delegation )

![[Pasted image 20250612162923.png]]

```bash
garffff@garffff:~/vulnlab/tengu$findDelegation.py tengu.vl/t2_m.winters:Tengu123
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

AccountName  AccountType                          DelegationType                      DelegationRightsTo         
-----------  -----------------------------------  ----------------------------------  --------------------------
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/SQL:1433          
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/sql.tengu.vl:1433 
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/sql.tengu.vl      
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/sql
```

