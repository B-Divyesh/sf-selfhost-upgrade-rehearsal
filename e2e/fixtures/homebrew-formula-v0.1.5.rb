class Rehearsal < Formula
  desc "Rehearse self-hosted upgrades and issue readiness receipts"
  homepage "https://selfhost-upgrade-rehearsal.sociobot.in"
  version "0.1.5"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-aarch64.tar.gz"
      sha256 "b1231afef52f8f9840b3c61bac3c6cb790f4388262078e0f568381a0403cc034"
    else
      url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-macos-x86_64.tar.gz"
      sha256 "f9152d216655f7c9b6b70f8d3f7b6e906f6c0dc3c4127969b5451fee9a6651c2"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v#{version}/rehearsal-linux-x86_64.tar.gz"
    sha256 "f0ca9d0ea06bf9600cc7d3dbcaab7191305540473d897cc06d1b23cc5ab3ef1d"
  end

  def install
    bin.install "rehearsal"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/rehearsal --version")
  end
end
