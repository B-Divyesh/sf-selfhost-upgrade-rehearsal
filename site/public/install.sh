#!/bin/sh
set -eu
repo="B-Divyesh/sf-selfhost-upgrade-rehearsal"
case "$(uname -s)-$(uname -m)" in
  Linux-x86_64) asset="rehearsal-linux-x86_64.tar.gz" ;;
  Linux-aarch64|Linux-arm64) asset="rehearsal-linux-aarch64.tar.gz" ;;
  Darwin-x86_64) asset="rehearsal-macos-x86_64.tar.gz" ;;
  Darwin-arm64) asset="rehearsal-macos-aarch64.tar.gz" ;;
  *) echo "No binary is published for this platform." >&2; exit 1 ;;
esac
base="https://github.com/$repo/releases/latest/download"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT INT TERM
curl -fsSL "$base/$asset" -o "$tmp_dir/$asset"
curl -fsSL "$base/SHA256SUMS" -o "$tmp_dir/SHA256SUMS"
(cd "$tmp_dir" && grep "  $asset$" SHA256SUMS | sha256sum -c -)
tar -xzf "$tmp_dir/$asset" -C "$tmp_dir"
install_dir="${REHEARSAL_INSTALL_DIR:-$HOME/.local/bin}"
mkdir -p "$install_dir"
install -m 755 "$tmp_dir/rehearsal" "$install_dir/rehearsal"
echo "Installed rehearsal in $install_dir and verified its SHA256 checksum."
