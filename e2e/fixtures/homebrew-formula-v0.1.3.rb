class Rehearsal < Formula
  desc "Rehearse self-hosted upgrades and issue readiness receipts"
  homepage "https://selfhost-upgrade-rehearsal.sociobot.in"
  version "0.1.3"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-aarch64.tar.gz"
      sha256 "f3a88c14a9f809906c50b2c81f75809ffabd4753a9d7fb30ed35fb53309bb383"
    else
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-x86_64.tar.gz"
      sha256 "57ff035c2caf979714bbbce75454be56787976acfee6cf7d96a2310cb4c634a3"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-linux-x86_64.tar.gz"
    sha256 "84676836384b1d87e7a590147989656f82e77d6e2c73e24222cf984c7d8e03ca"
  end

  def install
    bin.install "rehearsal"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/rehearsal --version")
  end
end
