The ESC5 attack involves exploiting access controls over Active Directory (AD) objects indirectly connected to Active Directory Certificate Services (ADCS). If an attacker compromises an account with high privileges over these AD objects—such as the CA server’s AD computer object, the CA server’s RPC/DCOM server, or any descendant AD objects within the PKI configuration container—they can potentially escalate their privileges and compromise the entire Public Key Infrastructure (PKI). Key targets include Certificate Templates, Certification Authorities, NTAuthCertificates, and Enrollment Services. By manipulating these elements, an attacker can issue fraudulent certificates or gain unauthorized access, leading to a severe security breach. 

To successfully execute an ESC5 attack against Active Directory Certificate Services (ADCS), a low-privileged attacker needs to obtain specific rights and privileges over certain accounts and objects that typically possess elevated permissions. Key requirements for the attack include:

1. **Access to the CA Server's AD Computer Object**: The attacker must have rights over the Certificate Authority (CA) server’s Active Directory computer object, which can be compromised using techniques such as **S4U2Self** or **S4U2Proxy**. These methods enable service accounts to impersonate users with higher privileges.
    
2. **Permissions on RPC/DCOM Services**: The attacker needs access to the CA server's RPC (Remote Procedure Call) and DCOM (Distributed Component Object Model) services. This access allows the attacker to perform remote calls and execute commands on the CA server.
    
3. **Rights Over AD Objects Related to ADCS**: The attacker should possess permissions over various Active Directory objects within the Public Key Services hierarchy, including:
    
    - **Certification Authorities Container**: Access to manage and modify configurations of certificate authorities.
    - **Certificate Templates Container**: Permissions to alter certificate templates, enabling the issuance of potentially malicious certificates.
    - **NTAuthCertificates Object**: Rights to modify the NTAuthCertificates, which can impact the trust chain of issued certificates.
    - **Enrollment Services Container**: Permissions to manage enrollment services that handle certificate requests.
4. **Ability to Modify Attributes**: Specifically, the attacker needs rights to modify attributes of these critical objects:
    
    - **CA Server’s AD Computer Object**: Adjust settings that can affect how the CA server operates and interacts with other systems.
    - **Certificate Templates**: Change properties of templates to allow for the issuance of certificates with escalated privileges.
    - **Certification Authorities Container**: Alter configurations that can enable unauthorized issuance or modification of certificates.
    - **NTAuthCertificates Object**: Manipulate the trust chain, potentially adding unauthorized certificate authorities.
    - **Enrollment Services Container**: Adjust settings that handle certificate enrollment processes, potentially allowing unauthorised enrollments.

