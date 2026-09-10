#!/usr/bin/env python3
"""
Strip extraneous User IDs from the PGP certificates published in the Web Key
Directory (WKD).

Each file under a WKD "hu" directory is named after the zbase32(SHA-1) hash
of the local-part of a single email address, but the certificates in this
repo carry User IDs for every address we own (debian@, devel@, contact@,
me@, ...). This script uses `sq keyring filter --prune-certs` to keep, in
each file, only the User ID whose hash matches that file's name -- for both
the standard key and the PQC key when a file is a keyring of the two.

The target email for each file is derived from the certificate's own User
IDs (by recomputing the WKD hash of each candidate email and matching it
against the filename), so no hardcoded list of addresses is needed.

Requires the `sq` (Sequoia PGP) CLI.
"""

import argparse
import hashlib
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ZBASE32_ALPHABET = "ybndrfg8ejkmcpqxot1uwisza345h769"
HASH_RE = re.compile(r"^[" + ZBASE32_ALPHABET + r"]{32}$")
USERID_RE = re.compile(r"^\s*UserID:\s*(.*)$", re.MULTILINE)
EMAIL_RE = re.compile(r"<([^<>@\s]+@[^<>\s]+)>")


def zbase32_wkd_hash(local_part: str) -> str:
    digest = hashlib.sha1(local_part.lower().encode("utf-8")).digest()
    bits = "".join(f"{byte:08b}" for byte in digest)
    chars = []
    for i in range(0, len(bits), 5):
        chunk = bits[i : i + 5].ljust(5, "0")
        chars.append(ZBASE32_ALPHABET[int(chunk, 2)])
    return "".join(chars)


def run(cmd, **kwargs):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kwargs)


def find_hu_dirs(root: Path):
    return sorted(p for p in root.rglob("hu") if p.is_dir())


def emails_in_cert_file(path: Path):
    result = subprocess.run(
        ["sq", "inspect", str(path)], capture_output=True, text=True
    )
    # `sq inspect` exits non-zero for some inputs it still describes fully
    # (e.g. certs with expired/revoked components), so inspect stdout
    # regardless of exit code, but bail out if there's truly nothing to read.
    if not result.stdout.strip():
        raise RuntimeError(f"sq inspect produced no output for {path}: {result.stderr.strip()}")
    emails = []
    seen = set()
    for uid in USERID_RE.findall(result.stdout):
        m = EMAIL_RE.search(uid)
        if m and m.group(1) not in seen:
            seen.add(m.group(1))
            emails.append(m.group(1))
    return emails


def resolve_target_email(path: Path):
    file_hash = path.name
    candidates = [
        email
        for email in emails_in_cert_file(path)
        if zbase32_wkd_hash(email.split("@", 1)[0]) == file_hash
    ]
    distinct = sorted(set(candidates))
    if len(distinct) == 0:
        raise RuntimeError(
            f"no User ID in {path} hashes to its filename; can't tell which address it belongs to"
        )
    if len(distinct) > 1:
        raise RuntimeError(
            f"{path} has User IDs for multiple addresses hashing to the same filename: {distinct}"
        )
    return distinct[0]


def strip_file(path: Path, target_email: str, dry_run: bool):
    before_emails = emails_in_cert_file(path)
    if before_emails == [target_email]:
        return False, before_emails, before_emails

    if dry_run:
        return True, before_emails, [target_email]

    filter_proc = subprocess.run(
        [
            "sq",
            "keyring",
            "filter",
            "--experimental",
            f"--email={target_email}",
            "--prune-certs",
            str(path),
        ],
        capture_output=True,
    )
    if filter_proc.returncode != 0:
        raise RuntimeError(f"sq keyring filter failed on {path}: {filter_proc.stderr.decode().strip()}")

    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        dearmor_proc = subprocess.run(
            ["sq", "packet", "dearmor", "--output", str(tmp_path), "--overwrite"],
            input=filter_proc.stdout,
            capture_output=True,
        )
        if dearmor_proc.returncode != 0:
            raise RuntimeError(f"sq packet dearmor failed on {path}: {dearmor_proc.stderr.decode().strip()}")
        shutil.copymode(path, tmp_path)
        tmp_path.replace(path)
    finally:
        tmp_path.unlink(missing_ok=True)

    after_emails = emails_in_cert_file(path)
    return True, before_emails, after_emails


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "root",
        nargs="?",
        default=".well-known",
        help="directory to search for WKD 'hu' directories in (default: .well-known)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="report what would change without modifying any files",
    )
    args = parser.parse_args()

    if shutil.which("sq") is None:
        print("error: the `sq` (Sequoia PGP) CLI is required but was not found in PATH", file=sys.stderr)
        return 1

    root = Path(args.root)
    hu_dirs = find_hu_dirs(root)
    if not hu_dirs:
        print(f"error: no 'hu' directory found under {root}", file=sys.stderr)
        return 1

    had_errors = False
    changed_any = False
    for hu_dir in hu_dirs:
        for path in sorted(hu_dir.iterdir()):
            if not path.is_file() or not HASH_RE.match(path.name):
                continue
            try:
                target_email = resolve_target_email(path)
                changed, before, after = strip_file(path, target_email, args.dry_run)
            except RuntimeError as exc:
                print(f"error: {exc}", file=sys.stderr)
                had_errors = True
                continue

            if changed:
                changed_any = True
                verb = "would strip" if args.dry_run else "stripped"
                print(f"{path}: {verb} {before} -> {after}")
            else:
                print(f"{path}: already contains only {target_email}, skipping")

    if not changed_any and not had_errors:
        print("nothing to do")

    return 1 if had_errors else 0


if __name__ == "__main__":
    sys.exit(main())
