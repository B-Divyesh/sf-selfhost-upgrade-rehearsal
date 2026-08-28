use assert_cmd::Command;
use predicates::prelude::*;

#[test]
fn demo_writes_both_receipts() {
    let temp = tempfile::tempdir().unwrap();
    Command::cargo_bin("rehearsal")
        .unwrap()
        .args(["demo", "--output", temp.path().to_str().unwrap()])
        .assert()
        .success()
        .stdout(predicate::str::contains("READY"));
    assert!(temp.path().join("report/readiness.json").is_file());
    assert!(temp.path().join("report/readiness.html").is_file());
    let receipt = std::fs::read_to_string(temp.path().join("report/readiness.json")).unwrap();
    assert!(receipt.contains("Restore backup"));
    assert!(!receipt.contains("three synthetic workspaces"));
}

#[test]
fn bad_declaration_explains_the_next_step() {
    let temp = tempfile::tempdir().unwrap();
    let path = temp.path().join("bad.yml");
    std::fs::write(&path, "schema: 8\n").unwrap();
    Command::cargo_bin("rehearsal")
        .unwrap()
        .args(["check", "--file", path.to_str().unwrap()])
        .assert()
        .failure()
        .stderr(predicate::str::contains(
            "not a valid rehearsal declaration",
        ));
}
