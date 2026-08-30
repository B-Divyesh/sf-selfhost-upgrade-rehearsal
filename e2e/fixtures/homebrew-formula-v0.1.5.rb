class Rehearsal < Formula
  desc "Rehearse self-hosted upgrades and issue readiness receipts"
  homepage "https://selfhost-upgrade-rehearsal.sociobot.in"
  version "0.1.5"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-aarch64.tar.gz"
      sha256 "12757bee8f861ff524e4c2425ef3b3e8d720ff361b6eb4a8661cc5250d82d741"
    else
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-x86_64.tar.gz"
      sha256 "8db93350ddb5752ff08f5dc404cf29f1006b7043c20b093e466d96107f73c68f"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-linux-x86_64.tar.gz"
    sha256 "d5ba325542908d43af0a02dda5361c9e432f04f10284bbf4f05a4ad1726846b7"
  end

  def install
    bin.install "rehearsal"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/rehearsal --version")
  end
end
