class Rehearsal < Formula
  desc "Rehearse self-hosted upgrades and issue readiness receipts"
  homepage "https://selfhost-upgrade-rehearsal.sociobot.in"
  version "__VERSION__"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-aarch64.tar.gz"
      sha256 "__MAC_ARM_SHA256__"
    else
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-x86_64.tar.gz"
      sha256 "__MAC_INTEL_SHA256__"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-linux-x86_64.tar.gz"
    sha256 "__LINUX_SHA256__"
  end

  def install
    bin.install "rehearsal"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/rehearsal --version")
  end
end
