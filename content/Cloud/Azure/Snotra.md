Grab latest version

```bash
docker pull registry.gitlab.com/snotra.cloud/azure:latest
```

Snotra Usage. Don't forget the login first.

```bash
docker run --rm -v ~/.azure:/root/.azure -v $(pwd)/results:/results registry.gitlab.com/snotra.cloud/azure:latest -r /results -t <tenant> -s <subscription>
```


