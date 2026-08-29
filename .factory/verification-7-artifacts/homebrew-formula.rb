class Rehearsal < Formula
  desc "Rehearse self-hosted upgrades and issue readiness receipts"
  homepage "https://selfhost-upgrade-rehearsal.sociobot.in"
  version "0.1.2"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-aarch64.tar.gz"
      sha256 "86304dfa1b0bc1a750a3244751d7c5355b0b11a7621a8f95748d64bdcbcef7a6"
    else
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-x86_64.tar.gz"
      sha256 "c2ae05e0b69816c912ab85ca5c65bfd21670a2b445eccf943d11d9f7eb58b936"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-linux-x86_64.tar.gz"
    sha256 "baae9909cffe06c7d5a3ba0f0f50eb2c8678a02461eb89fe05c1e2f6152f3f3a"
  end

  def install
    bin.install "rehearsal"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/rehearsal --version")
  end
end
