#!/usr/bin/env python3
"""One-time: push local home clips into Emergent Object Storage."""
import os
import sys
import urllib.request
import json

ENV = "/app/frontend/.env"


def load_env():
    env = {}
    with open(ENV) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


def main():
    env = load_env()
    base = (env.get("INTEGRATION_PROXY_URL") or "https://integrations.emergentagent.com").rstrip("/")
    key = env["EMERGENT_LLM_KEY"]
    storage_url = base + "/objstore/api/v1/storage"

    # init
    req = urllib.request.Request(
        storage_url + "/init",
        data=json.dumps({"emergent_key": key}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        storage_key = json.loads(r.read())["storage_key"]
    print("init ok")

    clips = ["clip-london.mp4", "clip-west.mp4", "clip-interior.mp4"]
    for name in clips:
        path = f"foxy-property/home/{name}"
        with open(f"/app/public/home/{name}", "rb") as fh:
            data = fh.read()
        req = urllib.request.Request(
            storage_url + "/objects/" + path,
            data=data,
            headers={"X-Storage-Key": storage_key, "Content-Type": "video/mp4"},
            method="PUT",
        )
        with urllib.request.urlopen(req, timeout=300) as r:
            res = json.loads(r.read())
        print(f"uploaded {name} -> {res.get('path')} ({res.get('size')} bytes)")


if __name__ == "__main__":
    main()
